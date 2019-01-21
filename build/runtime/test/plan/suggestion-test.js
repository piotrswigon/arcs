/**
 * @license
 * Copyright (c) 2017 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { assert } from '../chai-web.js';
import { TestHelper } from '../../testing/test-helper.js';
import { Suggestion } from '../../plan/suggestion.js';
import { Search } from '../../recipe/search.js';
import { Recipe } from '../../recipe/recipe.js';
describe('suggestion', () => {
    function createSuggestion(hash, descriptionText) {
        const suggestion = new Suggestion(/* plan= */ JSON.parse('{}'), hash, /* rank= */ 1, /* versionByStore= */ {});
        suggestion.descriptionByModality['text'] = descriptionText;
        return suggestion;
    }
    it('adds and merges search', async () => {
        const descriptionText = 'hello world';
        const hash1 = 'hash1';
        const s1 = createSuggestion(hash1, descriptionText);
        const s2 = createSuggestion(hash1, descriptionText);
        assert.isTrue(s1.isEquivalent(s2));
        assert.isTrue(s2.isEquivalent(s1));
        // Sets search to null.
        assert.isEmpty(s2.searchGroups);
        s2.setSearch(null);
        assert.isEmpty(s2.searchGroups);
        // Sets search to resolved tokens. Suggestions are still equivalent.
        s2.setSearch(new Search('one two three', /* unresolvedTokens= */ ['two']));
        assert.deepEqual(s2.searchGroups, [['one', 'three']]);
        assert.isTrue(s2.isEquivalent(s1));
        // Merges search groups.
        s1.mergeSearch(s2);
        assert.deepEqual(s1.searchGroups, [[''], ['one', 'three']]);
        // Merges another search group.
        s2.setSearch(new Search('three four five', /* unresolvedTokens= */ ['three', 'four']));
        s1.mergeSearch(s2);
        assert.deepEqual(s1.searchGroups, [[''], ['five'], ['one', 'three']]);
    });
    it('deserialize empty', async () => {
        const helper = await TestHelper.create();
        const envOptions = helper.envOptions;
        const plan = new Recipe();
        const suggestion1 = await Suggestion.fromLiteral({ plan: plan.toString(), hash: '123', rank: 1 }, envOptions);
        assert.isTrue(Boolean(suggestion1.plan));
        const suggestion2 = await Suggestion.fromLiteral({
            plan: plan.toString(),
            hash: '123',
            rank: 1,
            versionByStore: '{}',
            searchGroups: [],
            descriptionByModality: {}
        }, envOptions);
        assert.isTrue(Boolean(suggestion2.plan));
        assert.deepEqual(suggestion2.toLiteral(), (await Suggestion.fromLiteral(suggestion2.toLiteral(), envOptions)).toLiteral());
    });
});
//# sourceMappingURL=suggestion-test.js.map