/**
 * @license
 * Copyright (c) 2017 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { Arc } from '../arc.js';
/**
 * Helper class for testing a Collection-based store that collects messages from a particle.
 * This detects when too few or too many messages are sent in addition to matching the message
 * values, and can be used multiple times within the same unit test.
 *
 * Example usage:
 * ```
 *   [manifest]
 *     schema Result
 *       Text value
 *     particle P
 *       out [Result] res
 *
 *   [particle code]
 *     setHandles(handles) {
 *       this._resHandle = handles.get('res');
 *     }
 *     testFunction(arg) {
 *       await this._resHandle.store(new this._resHandle.entityClass({value: arg}));
 *     }
 *
 *   [test code]
 *     let {manifest, arc} = setUpManifestAndArc();
 *     let Result = manifest.findSchemaByName('Result').entityClass();
 *     let resStore = await arc.createStore(Result.type.collectionOf(), 'res');
 *     let recipe = setUpRecipeWithResHandleMapped(resStore);
 *
 *     let inspector = new util.ResultInspector(arc, resStore, 'value');
 *     await arc.instantiate(recipe);
 *     triggerParticleTestFunctionWith('one');
 *     triggerParticleTestFunctionWith('two');
 *     await inspector.verify('one', 'two');
 *
 *     triggerParticleTestFunctionWith('three');
 *     await inspector.verify('three');
 * ```
 */
export declare class ResultInspector {
    private readonly _arc;
    private readonly _store;
    private readonly _field;
    /**
     * @param arc the arc being tested; used to detect when all messages have been processed.
     * @param store a Collection-based store that should be connected as an output for the particle.
     * @param field the field within store's contained Entity type that this inspector should observe.
     */
    constructor(arc: Arc, store: any, field: string);
    /**
     * Wait for the arc to be idle then verify that exactly the expected messages have been received.
     * This clears the contents of the observed store after each call, allowing repeated independent
     * checks in the same test. The order of expectations is not significant.
     */
    verify(...expectations: any[]): Promise<{}>;
}
export declare function assertSingletonWillChangeTo(arc: Arc, store: any, field: string, expectation: any): Promise<void>;
export declare function assertSingletonIs(store: any, field: string, expectation: any): Promise<void>;
export declare function assertThrowsAsync(fn: any, message: string | RegExp): Promise<void>;
