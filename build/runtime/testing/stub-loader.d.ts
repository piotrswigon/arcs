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
/**
 * A Loader initialized with a per-path canned responses.
 * Value for '*' key can be specified for a response if the path did not match.
 * If '*' is not specified and path is not matched, Loader logic is invoked.
 */
export declare class StubLoader extends Loader {
    _fileMap: any;
    _cannedResponse: any;
    constructor(fileMap: any);
    loadResource(path: string): any;
    path(fileName: string): string;
    join(prefix: string, path: string): string;
    clone(): StubLoader;
}
