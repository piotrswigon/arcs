import { Strategy } from '../../planning/strategizer.js';
import { Arc } from '../arc.js';
export declare class CoalesceRecipes extends Strategy {
    private recipeIndex;
    constructor(arc: Arc, { recipeIndex }: {
        recipeIndex: any;
    });
    getResults(inputParams: any): any;
    generate(inputParams: any): any;
}
