import { DevtoolsConnection } from './devtools-connection.js';
import { Trigger } from '../plan/plan-producer.js';
export class PlanningExplorerAdapter {
    static updatePlanningResults(result, metadata, devtoolsChannel) {
        if (devtoolsChannel) {
            devtoolsChannel.send({
                messageType: 'suggestions-changed',
                messageBody: {
                    suggestions: PlanningExplorerAdapter._formatSuggestions(result.suggestions),
                    lastUpdated: result.lastUpdated.getTime(),
                    metadata
                }
            });
        }
    }
    static updateVisibleSuggestions(visibleSuggestions, devtoolsChannel) {
        if (devtoolsChannel) {
            devtoolsChannel.send({
                messageType: 'visible-suggestions-changed',
                messageBody: {
                    visibleSuggestionHashes: visibleSuggestions.map(s => s.hash)
                }
            });
        }
    }
    static updatePlanningAttempt(suggestions, metadata, devtoolsChannel) {
        if (devtoolsChannel) {
            devtoolsChannel.send({
                messageType: 'planning-attempt',
                messageBody: {
                    suggestions: suggestions ? PlanningExplorerAdapter._formatSuggestions(suggestions) : null,
                    metadata
                }
            });
        }
    }
    static _formatSuggestions(suggestions) {
        return suggestions.map(s => {
            const suggestionCopy = Object.assign({}, s);
            suggestionCopy['particles'] = s.plan.particles.map(p => ({ name: p.name }));
            delete suggestionCopy.plan;
            return suggestionCopy;
        });
    }
    static subscribeToForceReplan(planificator) {
        if (DevtoolsConnection.isConnected) {
            const devtoolsChannel = DevtoolsConnection.get().forArc(planificator.arc);
            devtoolsChannel.listen('force-replan', async () => {
                planificator.consumer.result.suggestions = [];
                await planificator.consumer.result.flush();
                await planificator.requestPlanning({ metadata: { trigger: Trigger.Forced } });
                await planificator.loadSuggestions();
            });
        }
    }
}
//# sourceMappingURL=planning-explorer-adapter.js.map