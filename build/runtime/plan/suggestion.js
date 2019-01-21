/**
 * @license
 * Copyright (c) 2018 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { assert } from '../../platform/assert-web.js';
import { DescriptionFormatter } from '../description-formatter.js';
import { Manifest } from '../manifest.js';
import { RecipeResolver } from '../recipe/recipe-resolver.js';
export class Suggestion {
    constructor(plan, hash, rank, versionByStore) {
        // TODO: update Description class to be serializable.
        this.descriptionByModality = {};
        this.versionByStore = {};
        // List of search resolved token groups, this suggestion corresponds to.
        this.searchGroups = [];
        assert(plan, `plan cannot be null`);
        assert(hash, `hash cannot be null`);
        this.plan = plan;
        this.planString = this.plan.toString();
        this.hash = hash;
        this.rank = rank;
        this.versionByStore = versionByStore;
        // TODO(mmandlis): backward compatility for existing suggestions that include undefined
        // versions. Code can be deleted, after we upgrade above 0_6 or wipe out the storage.
        for (const store in this.versionByStore) {
            if (this.versionByStore[store] === undefined) {
                delete this.versionByStore[store];
            }
        }
    }
    static create(plan, hash, relevance) {
        assert(plan, `plan cannot be null`);
        assert(hash, `hash cannot be null`);
        assert(relevance, `relevance cannot be null`);
        const suggestion = new Suggestion(plan, hash, relevance.calcRelevanceScore(), relevance.versionByStore);
        suggestion.setSearch(plan.search);
        return suggestion;
    }
    get descriptionText() {
        return this.getDescription('text');
    }
    getDescription(modality) {
        assert(this.descriptionByModality[modality], `No description for modality '${modality}'`);
        return this.descriptionByModality[modality];
    }
    setDescription(description, modality, descriptionFormatter = DescriptionFormatter) {
        this.descriptionByModality['text'] = description.getRecipeSuggestion();
        for (const planModality of this.plan.modality.names) {
            if (modality.names.includes(planModality)) {
                this.descriptionByModality[planModality] =
                    description.getRecipeSuggestion(descriptionFormatter);
            }
        }
    }
    isEquivalent(other) {
        return (this.hash === other.hash) && (this.descriptionText === other.descriptionText);
    }
    static compare(s1, s2) {
        return s2.rank - s1.rank;
    }
    hasSearch(search) {
        const tokens = search.split(' ');
        return this.searchGroups.some(group => tokens.every(token => group.includes(token)));
    }
    setSearch(search) {
        this.searchGroups = [];
        if (search) {
            this._addSearch(search.resolvedTokens);
        }
    }
    mergeSearch(suggestion) {
        let updated = false;
        for (const other of suggestion.searchGroups) {
            if (this._addSearch(other)) {
                if (this.searchGroups.length === 1) {
                    this.searchGroups.push(['']);
                }
                updated = true;
            }
        }
        this.searchGroups.sort();
        return updated;
    }
    _addSearch(searchGroup) {
        const equivalentGroup = (group, otherGroup) => {
            return group.length === otherGroup.length &&
                group.every(token => otherGroup.includes(token));
        };
        if (!this.searchGroups.find(group => equivalentGroup(group, searchGroup))) {
            this.searchGroups.push(searchGroup);
            return true;
        }
        return false;
    }
    toLiteral() {
        return {
            plan: this.planString,
            hash: this.hash,
            rank: this.rank,
            // Needs to JSON.strigify because store IDs may contain invalid FB key symbols.
            versionByStore: JSON.stringify(this.versionByStore),
            searchGroups: this.searchGroups,
            descriptionByModality: this.descriptionByModality
        };
    }
    static async fromLiteral({ plan, hash, rank, versionByStore, searchGroups, descriptionByModality }, { context, loader }) {
        const manifest = await Manifest.parse(plan, { loader, context, fileName: '' });
        assert(manifest.recipes.length === 1);
        const recipe = manifest.recipes[0];
        assert(recipe.normalize({}), `can't normalize deserialized suggestion: ${plan}`);
        const suggestion = new Suggestion(recipe, hash, rank, JSON.parse(versionByStore || '{}'));
        suggestion.searchGroups = searchGroups || [];
        suggestion.descriptionByModality = descriptionByModality;
        return suggestion;
    }
    async instantiate(arc) {
        // For now shell is responsible for creating and setting the new arc.
        assert(arc, `Cannot instantiate suggestion without and arc`);
        const plan = await this.getResolvedPlan(arc);
        assert(plan && plan.isResolved(), `can't resolve plan: ${this.plan.toString({ showUnresolved: true })}`);
        return arc.instantiate(plan);
    }
    async getResolvedPlan(arc) {
        if (this.plan.isResolved()) {
            return this.plan;
        }
        // TODO(mmandlis): Is this still needed? Find out why and fix.
        const recipeResolver = new RecipeResolver(arc);
        return recipeResolver.resolve(this.plan);
    }
}
//# sourceMappingURL=suggestion.js.map