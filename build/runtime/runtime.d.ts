/**
 * @license
 * Copyright (c) 2018 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { Manifest } from './manifest.js';
export declare class Runtime {
    private arcs;
    constructor();
    /**
     * Given an arc, returns it's description as a string.
     */
    static getArcDescription(arc: any): Promise<string>;
    /**
     * Parse a textual manifest and return a Manifest object. See the Manifest
     * class for the options accepted.
     */
    static parseManifest(content: any, options?: any): Promise<Manifest>;
    /**
     * Load and parse a manifest from a resource (not striclty a file) and return
     * a Manifest object. The loader determines the semantics of the fileName. See
     * the Manifest class for details.
     */
    static loadManifest(fileName: any, loader: any, options: any): Promise<Manifest>;
}
