import { Arc } from './arc.js';
import { Strategizer, StrategyDerived } from '../planning/strategizer.js';
import { Speculator } from './speculator.js';
import { Suggestion } from './plan/suggestion';
export declare class Planner {
    private _arc;
    strategizer: Strategizer;
    init(arc: Arc, { strategies, ruleset, strategyArgs }?: {
        strategies?: StrategyDerived[];
        ruleset?: import("../planning/strategizer.js").Ruleset;
        strategyArgs?: {};
    }): void;
    plan(timeout: number, generations: any): Promise<any[]>;
    _speculativeThreadCount(): number;
    _splitToGroups(items: any, groupCount: number): any[];
    suggest(timeout: number, generations?: {}[], speculator?: Speculator): Promise<Suggestion[]>;
    _updateGeneration(generations: any, hash: string, handler: any): void;
    static InitializationStrategies: StrategyDerived[];
    static ResolutionStrategies: StrategyDerived[];
    static AllStrategies: StrategyDerived[];
}
