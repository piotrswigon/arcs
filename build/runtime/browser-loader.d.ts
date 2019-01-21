/**
 * @license
 * Copyright (c) 2017 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { Loader } from './loader.js';
export declare class BrowserLoader extends Loader {
    private base;
    constructor(base: any);
    _resolve(path: any): string;
    loadResource(name: any): any;
    requireParticle(fileName: any): Promise<any>;
}
