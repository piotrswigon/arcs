import { Planificator } from '../plan/planificator.js';
import { Suggestion } from '../plan/suggestion';
export declare class PlanningExplorerAdapter {
    static updatePlanningResults(result: any, metadata: any, devtoolsChannel: any): void;
    static updateVisibleSuggestions(visibleSuggestions: any, devtoolsChannel: any): void;
    static updatePlanningAttempt(suggestions: Suggestion[], metadata: {}, devtoolsChannel: any): void;
    private static _formatSuggestions;
    static subscribeToForceReplan(planificator: Planificator): void;
}
