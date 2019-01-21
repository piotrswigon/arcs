// Copyright (c) 2017 Google Inc. All rights reserved.
// This code may only be used under the BSD style license found at
// http://polymer.github.io/LICENSE.txt
// Code distributed by Google as part of this project is also
// subject to an additional IP rights grant found at
// http://polymer.github.io/PATENTS.txt
import { Strategy } from '../../planning/strategizer.js';
export class InitPopulation extends Strategy {
    constructor(arc, { contextual = false, recipeIndex }) {
        super(arc, { contextual });
        this._contextual = contextual;
        this._recipeIndex = recipeIndex;
        this._loadedParticles = new Set(this.arc.loadedParticles().map(spec => spec.implFile));
    }
    async generate({ generation }) {
        if (generation !== 0) {
            return [];
        }
        await this._recipeIndex.ready;
        const results = this._contextual
            ? this._contextualResults()
            : this._allResults();
        return results.map(({ recipe, score = 1 }) => ({
            result: recipe,
            score,
            derivation: [{ strategy: this, parent: undefined }],
            hash: recipe.digest(),
            valid: Object.isFrozen(recipe)
        }));
    }
    _contextualResults() {
        const results = [];
        for (const slot of this.arc.activeRecipe.slots.filter(s => s.sourceConnection)) {
            results.push(...this._recipeIndex.findConsumeSlotConnectionMatch(slot).map(({ slotConn }) => ({ recipe: slotConn.recipe })));
        }
        for (const handle of [].concat(...this.arc.allDescendingArcs.map(arc => arc.activeRecipe.handles))) {
            results.push(...this._recipeIndex.findHandleMatch(handle, ['use', '?']).map(otherHandle => ({ recipe: otherHandle.recipe })));
        }
        return results;
    }
    _allResults() {
        return this._recipeIndex.recipes.map(recipe => ({
            recipe,
            score: 1 - recipe.getParticlesByImplFile(this._loadedParticles).length
        }));
    }
}
//# sourceMappingURL=init-population.js.map