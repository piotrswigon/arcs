/**
 * @license
 * Copyright (c) 2018 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { Loader } from '../loader.js';
import { Manifest } from '../manifest.js';
import { MockSlotComposer } from '../testing/mock-slot-composer.js';
import { RecipeIndex } from '../recipe-index.js';
import { Suggestion } from '../plan/suggestion.js';
declare type TestHelperOptions = {
    slotComposerStrict?: boolean;
    slotComposer?: MockSlotComposer;
    logging?: boolean;
    loader?: Loader;
    context?: Manifest;
    manifestFilename?: string;
    manifestString?: string;
    storageKey?: string;
};
declare type TestHelperPlanOptions = TestHelperOptions & {
    expectedNumPlans?: number;
    expectedSuggestions?: any;
    includeInnerArcs?: boolean;
    verify?: any;
};
/**
 * Helper class to recipe instantiation and replanning.
 * Usage example:
 *   let helper = await TestHelper.createAndPlan({manifestFilename: 'my.manifest'});
 *   await helper.acceptSuggestion({particles: ['MyParticle1', 'MyParticle2']});
 *   await helper.verifyData('MyParticle1', 'myHandle1', async (handle) => { ... });
 */
export declare class TestHelper {
    logging?: boolean;
    loader?: Loader;
    timeout: any;
    suggestions: any;
    arc: any;
    slotComposer: MockSlotComposer;
    recipeIndex: RecipeIndex;
    /**
     * Initializes a single arc using a mock slot composer.
     * |options| may contain:
     *   - slotComposerStrict: whether mock slot composer will be executing in strict mode.
     *   - logging: whether to log execution progress (default: false).
     *   - loader: file loader to use.
     *   - context: Manifest object.
     *   - manifestFilename: filename of the manifest file to load as the context.
     *   - manifestString: a string with content of the manifest to load as the context.
     */
    static create(options?: TestHelperOptions): Promise<TestHelper>;
    static parseManifest(manifestString: string, loader: any): Promise<Manifest>;
    /**
     * Creates a Test Helper instances and triggers planning .
     */
    static createAndPlan(options: TestHelperPlanOptions): Promise<TestHelper>;
    setTimeout(timeout: number): void;
    clearTimeout(): void;
    readonly envOptions: {
        context: any;
        loader: any;
    };
    /**
     * Generates suggestions for the arc.
     * |options| contains possible verifications to be performed on the generated plans:
     *   - expectedNumPlans: (optional) number of expected number of generated suggestions to verify.
     *   - expectedSuggestions: (optional) list of expected description texts representing the generated suggestion.
     *   - verify: a handler method to be called to verify the resulting suggestions.
     */
    makePlans(options?: TestHelperPlanOptions): Promise<TestHelper>;
    /**
     * Accepts a suggestion. |options| may provide the exact list of particles representing the
     * suggestion to accept. Otherwise, fallback to a single generated suggestion, if appropriate.
     */
    acceptSuggestion(options?: {
        hostedParticles?: string[];
        particles?: string[];
        descriptionText?: string;
    }): Promise<void>;
    findSuggestionByParticleNames(particlesNames: string[]): any;
    instantiateSuggestion(suggestion: Suggestion): Promise<void>;
    /**
     * Getter for a single available suggestion plan (fails, if there is more than one).
     */
    readonly plan: any;
    /**
     * Sends an event to particle's slot via the slot composer.
     */
    sendSlotEvent(particleName: string, slotName: any, event: any, data: any): Promise<void>;
    /**
     * Awaits particle execution context idleness and mock slot composer expectations completeness.
     */
    idle(): Promise<void>;
    /**
     * Verifies data in handle |connectionName| of |particleName| with the given handler.
     */
    verifyData(particleName: string, connectionName: string, expectationHandler: any): Promise<{}>;
    /**
     * Verifies the size of data collection in handle |connectionName| of |particleName|.
     */
    verifySetSize(particleName: string, connectionName: string, expectedSetSize: number): Promise<{}>;
    verifySlots(numConsumers: number, verifyHandler: any): void;
    log(message: any): void;
}
export {};
