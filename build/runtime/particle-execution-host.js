/**
 * @license
 * Copyright (c) 2017 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { assert } from '../platform/assert-web.js';
import { PECOuterPort } from './api-channel.js';
import { Manifest } from './manifest.js';
import { RecipeResolver } from './recipe/recipe-resolver.js';
import { reportSystemException } from './arc-exceptions.js';
export class ParticleExecutionHost {
    constructor(port, slotComposer, arc) {
        this.nextIdentifier = 0;
        this.idleVersion = 0;
        this.close = () => {
            port.close();
            this._apiPort.close();
        };
        this.arc = arc;
        this.slotComposer = slotComposer;
        const pec = this;
        this._apiPort = new class extends PECOuterPort {
            onRender(particle, slotName, content) {
                if (pec.slotComposer) {
                    pec.slotComposer.renderSlot(particle, slotName, content);
                }
            }
            onInitializeProxy(handle, callback) {
                const target = {};
                handle.on('change', data => this.SimpleCallback(callback, data), target);
            }
            async onSynchronizeProxy(handle, callback) {
                const data = await handle.modelForSynchronization();
                this.SimpleCallback(callback, data);
            }
            async onHandleGet(handle, callback) {
                // TODO(shans): fix typing once we have types for Singleton/Collection/etc
                // tslint:disable-next-line: no-any
                const data = await handle.get();
                this.SimpleCallback(callback, data);
            }
            async onHandleToList(handle, callback) {
                // TODO(shans): fix typing once we have types for Singleton/Collection/etc
                // tslint:disable-next-line: no-any
                this.SimpleCallback(callback, await handle.toList());
            }
            onHandleSet(handle, data, particleId, barrier) {
                // TODO(shans): fix typing once we have types for Singleton/Collection/etc
                // tslint:disable-next-line: no-any
                handle.set(data, particleId, barrier);
            }
            onHandleClear(handle, particleId, barrier) {
                // TODO(shans): fix typing once we have types for Singleton/Collection/etc
                // tslint:disable-next-line: no-any
                handle.clear(particleId, barrier);
            }
            async onHandleStore(handle, callback, data, particleId) {
                // TODO(shans): fix typing once we have types for Singleton/Collection/etc
                // tslint:disable-next-line: no-any
                await handle.store(data.value, data.keys, particleId);
                this.SimpleCallback(callback, {});
            }
            async onHandleRemove(handle, callback, data, particleId) {
                // TODO(shans): fix typing once we have types for Singleton/Collection/etc
                // tslint:disable-next-line: no-any
                await handle.remove(data.id, data.keys, particleId);
                this.SimpleCallback(callback, {});
            }
            async onHandleRemoveMultiple(handle, callback, data, particleId) {
                // TODO(shans): fix typing once we have types for Singleton/Collection/etc
                // tslint:disable-next-line: no-any
                await handle.removeMultiple(data, particleId);
                this.SimpleCallback(callback, {});
            }
            async onHandleStream(handle, callback, pageSize, forward) {
                // TODO(shans): fix typing once we have types for Singleton/Collection/etc
                // tslint:disable-next-line: no-any
                this.SimpleCallback(callback, await handle.stream(pageSize, forward));
            }
            async onStreamCursorNext(handle, callback, cursorId) {
                // TODO(shans): fix typing once we have types for Singleton/Collection/etc
                // tslint:disable-next-line: no-any
                this.SimpleCallback(callback, await handle.cursorNext(cursorId));
            }
            onStreamCursorClose(handle, cursorId) {
                // TODO(shans): fix typing once we have types for Singleton/Collection/etc
                // tslint:disable-next-line: no-any
                handle.cursorClose(cursorId);
            }
            onIdle(version, relevance) {
                if (version === pec.idleVersion) {
                    pec.idlePromise = undefined;
                    pec.idleResolve(relevance);
                }
            }
            async onGetBackingStore(callback, storageKey, type) {
                if (!storageKey) {
                    storageKey = pec.arc.storageProviderFactory.baseStorageKey(type, pec.arc.storageKey || 'volatile');
                }
                const store = await pec.arc.storageProviderFactory.baseStorageFor(type, storageKey);
                // TODO(shans): THIS IS NOT SAFE!
                //
                // Without an auditor on the runtime side that inspects what is being fetched from
                // this store, particles with a reference can access any data of that reference's type.
                this.GetBackingStoreCallback(store, callback, type.collectionOf(), type.toString(), store.id, storageKey);
            }
            onConstructInnerArc(callback, particle) {
                const arc = pec.arc.createInnerArc(particle);
                this.ConstructArcCallback(callback, arc);
            }
            async onArcCreateHandle(callback, arc, type, name) {
                // At the moment, inner arcs are not persisted like their containers, but are instead
                // recreated when an arc is deserialized. As a consequence of this, dynamically
                // created handles for inner arcs must always be volatile to prevent storage
                // in firebase.
                const store = await arc.createStore(type, name, null, [], 'volatile');
                // Store belongs to the inner arc, but the transformation particle,
                // which itself is in the outer arc gets access to it.
                this.CreateHandleCallback(store, callback, type, name, store.id);
            }
            onArcMapHandle(callback, arc, handle) {
                assert(pec.arc.findStoreById(handle.id), `Cannot map nonexistent handle ${handle.id}`);
                // TODO: create hosted handles map with specially generated ids instead of returning the real ones?
                this.MapHandleCallback({}, callback, handle.id);
            }
            onArcCreateSlot(callback, arc, transformationParticle, transformationSlotName, handleId) {
                let hostedSlotId;
                if (pec.slotComposer) {
                    hostedSlotId = pec.slotComposer.createHostedSlot(arc, transformationParticle, transformationSlotName, handleId);
                }
                this.CreateSlotCallback({}, callback, hostedSlotId);
            }
            async onArcLoadRecipe(arc, recipe, callback) {
                const manifest = await Manifest.parse(recipe, { loader: arc.loader, fileName: '' });
                const successResponse = {
                    providedSlotIds: {}
                };
                let error = undefined;
                // TODO(wkorman): Consider reporting an error or at least warning if
                // there's more than one recipe since currently we silently ignore them.
                let recipe0 = manifest.recipes[0];
                if (recipe0) {
                    for (const slot of recipe0.slots) {
                        slot.id = slot.id || `slotid-${arc.generateID()}`;
                        if (slot.sourceConnection) {
                            const particlelocalName = slot.sourceConnection.particle.localName;
                            if (particlelocalName) {
                                successResponse.providedSlotIds[`${particlelocalName}.${slot.name}`] = slot.id;
                            }
                        }
                    }
                    const missingHandles = [];
                    for (const handle of recipe0.handles) {
                        const fromHandle = pec.arc.findStoreById(handle.id) || manifest.findStoreById(handle.id);
                        if (!fromHandle) {
                            missingHandles.push(handle);
                            continue;
                        }
                        handle.mapToStorage(fromHandle);
                    }
                    if (missingHandles.length > 0) {
                        let recipeToResolve = recipe0;
                        // We're resolving both against the inner and the outer arc.
                        for (const resolver of [new RecipeResolver(arc /* inner */), new RecipeResolver(pec.arc /* outer */)]) {
                            recipeToResolve = await resolver.resolve(recipeToResolve) || recipeToResolve;
                        }
                        if (recipeToResolve === recipe0) {
                            error = `Recipe couldn't load due to missing handles [recipe=${recipe0}, missingHandles=${missingHandles.join('\n')}].`;
                        }
                        else {
                            recipe0 = recipeToResolve;
                        }
                    }
                    if (!error) {
                        const options = { errors: new Map() };
                        // If we had missing handles but we made it here, then we ran recipe
                        // resolution which will have already normalized the recipe.
                        if ((missingHandles.length > 0) || recipe0.normalize(options)) {
                            if (recipe0.isResolved()) {
                                // TODO: pass tags through too, and reconcile with similar logic
                                // in Arc.deserialize.
                                manifest.stores.forEach(store => pec.arc._registerStore(store, []));
                                arc.instantiate(recipe0);
                            }
                            else {
                                error = `Recipe is not resolvable:\n${recipe0.toString({ showUnresolved: true })}`;
                            }
                        }
                        else {
                            error = `Recipe ${recipe0} could not be normalized:\n${[...options.errors.values()].join('\n')}`;
                        }
                    }
                }
                else {
                    error = 'No recipe defined';
                }
                this.SimpleCallback(callback, error ? { error } : successResponse);
            }
            onRaiseSystemException(exception, methodName, particleId) {
                const particle = pec.arc.particleHandleMaps.get(particleId).spec.name;
                reportSystemException(exception, methodName, particle);
            }
        }(port, arc);
    }
    stop() {
        this._apiPort.Stop();
    }
    get idle() {
        if (this.idlePromise == undefined) {
            this.idlePromise = new Promise((resolve, reject) => {
                this.idleResolve = resolve;
            });
        }
        this.idleVersion = this.nextIdentifier;
        this._apiPort.AwaitIdle(this.nextIdentifier++);
        return this.idlePromise;
    }
    get messageCount() {
        return this._apiPort.messageCount;
    }
    sendEvent(particle, slotName, event) {
        this._apiPort.UIEvent(particle, slotName, event);
    }
    instantiate(particle, spec, handles) {
        handles.forEach(handle => {
            this._apiPort.DefineHandle(handle, handle.type.resolvedType(), handle.name);
        });
        this._apiPort.InstantiateParticle(particle, particle.id, spec, handles);
        return particle;
    }
    startRender({ particle, slotName, providedSlots, contentTypes }) {
        this._apiPort.StartRender(particle, slotName, providedSlots, contentTypes);
    }
    stopRender({ particle, slotName }) {
        this._apiPort.StopRender(particle, slotName);
    }
    innerArcRender(transformationParticle, transformationSlotName, hostedSlotId, content) {
        this._apiPort.InnerArcRender(transformationParticle, transformationSlotName, hostedSlotId, content);
    }
}
//# sourceMappingURL=particle-execution-host.js.map