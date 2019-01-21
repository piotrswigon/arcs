/**
 * @license
 * Copyright (c) 2018 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { assert } from '../platform/assert-web.js';
var ModalityName;
(function (ModalityName) {
    ModalityName["Dom"] = "dom";
    ModalityName["DomTouch"] = "dom-touch";
    ModalityName["Vr"] = "vr";
    ModalityName["Voice"] = "voice";
})(ModalityName || (ModalityName = {}));
export class Modality {
    constructor(names) {
        this.names = names;
    }
    static create(names) {
        assert(names.every(name => Modality.all.names.includes(name)), `Unsupported modality in: ${names}`);
        return new Modality(names);
    }
    intersection(other) {
        return new Modality(this.names.filter(name => other.names.includes(name)));
    }
    isResolved() {
        return this.names.length > 0;
    }
    isCompatible(names) {
        return this.intersection(Modality.create(names)).isResolved();
    }
    static get Name() { return ModalityName; }
}
Modality.all = new Modality([
    Modality.Name.Dom, Modality.Name.DomTouch, Modality.Name.Vr, Modality.Name.Voice
]);
Modality.dom = new Modality([Modality.Name.Dom]);
Modality.domTouch = new Modality([Modality.Name.DomTouch]);
Modality.voice = new Modality([Modality.Name.Voice]);
Modality.vr = new Modality([Modality.Name.Vr]);
//# sourceMappingURL=modality.js.map