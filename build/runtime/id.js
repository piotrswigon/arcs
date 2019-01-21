/**
 * @license
 * Copyright (c) 2017 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { Random } from './random.js';
export class Id {
    constructor(currentSession, components = []) {
        this.nextIdComponent = 0;
        this.components = [];
        this.session = currentSession;
        this.currentSession = currentSession;
        this.components = components;
    }
    static newSessionId() {
        const session = Math.floor(Random.next() * Math.pow(2, 50)) + '';
        return new Id(session);
    }
    /**
     * When used in the following way:
     *   const id = Id.newSessionId().fromString(stringId);
     *
     * The resulting id will receive a newly generated session id in the currentSession field,
     * while maintaining an original session from the string representation in the session field.
     */
    fromString(str) {
        const newId = new Id(this.currentSession);
        let components = str.split(':');
        if (components[0][0] === '!') {
            newId.session = components[0].slice(1);
            components = components.slice(1);
        }
        newId.components.push(...components);
        return newId;
    }
    toString() {
        return `!${this.session}:${this.components.join(':')}`;
    }
    // Only use this for testing!
    toStringWithoutSessionForTesting() {
        return this.components.join(':');
    }
    createId(component = '') {
        const id = new Id(this.currentSession, this.components.slice());
        id.components.push(component + this.nextIdComponent++);
        return id;
    }
    equal(id) {
        if (id.session !== this.session || id.components.length !== this.components.length) {
            return false;
        }
        for (let i = 0; i < id.components.length; i++) {
            if (id.components[i] !== this.components[i]) {
                return false;
            }
        }
        return true;
    }
}
//# sourceMappingURL=id.js.map