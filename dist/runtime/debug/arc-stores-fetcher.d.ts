/**
 * @license
 * Copyright (c) 2018 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
export declare class ArcStoresFetcher {
    private arc;
    constructor(arc: any, arcDevtoolsChannel: any);
    _listStores(): Promise<{
        arcStores: any[];
        contextStores: any[];
    }>;
    _digestStores(stores: any): Promise<any[]>;
}
