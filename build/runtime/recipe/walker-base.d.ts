import { StrategizerWalker } from '../../planning/strategizer.js';
/**
 * Walkers traverse an object, calling methods based on the
 * features encountered on that object. For example, a RecipeWalker
 * takes a list of recipes and calls methods when:
 *  - a new recipe is encountered
 *  - a handle is found inside a recipe
 *  - a particle is found inside a recipe
 *  - etc..
 *
 * Each of these methods can return a list of updates:
 *   [(recipe, encountered_thing) => new_recipe]
 *
 * The walker then does something with the updates depending on the
 * tactic selected.
 *
 * If the tactic is "Permuted", then an output will be generated
 * for every combination of 1 element drawn from each update list.
 * For example, if 3 methods return [a,b], [c,d,e], and [f] respectively
 * then "Permuted" will cause 6 outputs to be generated: [acf, adf, aef, bcf, bdf, bef]
 *
 * If the tactic is "Independent", an output will be generated for each
 * update, regardless of the list the update is in. For example,
 * if 3 methods return [a,b], [c,d,e], and [f] respectively,
 * then "Independent" will cause 6 outputs to be generated: [a,b,c,d,e,f]
 */
export declare enum WalkerTactic {
    Permuted = "permuted",
    Independent = "independent"
}
export declare abstract class WalkerBase extends StrategizerWalker {
    tactic: WalkerTactic;
    constructor(tactic: any);
    _runUpdateList(recipe: any, updateList: any): void;
    createDescendant(recipe: any, score: any): void;
    isEmptyResult(result: any): boolean;
}
