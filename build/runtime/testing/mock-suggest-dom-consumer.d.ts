import { Arc } from '../arc.js';
import { SuggestDomConsumer } from '../suggest-dom-consumer.js';
export declare class MockSuggestDomConsumer extends SuggestDomConsumer {
    _eventHandler: any;
    _setContentPromise: any;
    _suggestion: any;
    _suggestionContent: any;
    _content: any;
    contentAvailable: any;
    _contentAvailableResolve: any;
    constructor(arc: any, containerKind: any, suggestion: any, suggestionContent: any, eventHandler: any);
    readonly suggestion: any;
    readonly templatePrefix: string;
    onContainerUpdate(container: any, originalContainer: any): void;
    static render(arc: Arc, container: any, plan: any, content: any): SuggestDomConsumer;
    setContent(content: any, handler: any): Promise<void>;
    createNewContainer(container: any, subId: any): any;
    isSameContainer(container: any, contextContainer: any): boolean;
    getInnerContainer(slotId: any): any;
    createTemplateElement(template: any): any;
    static findRootContainers(container: any): any;
    static clear(container: any): void;
    _onUpdate(rendering: any): void;
    _stampTemplate(template: any): void;
    _initMutationObserver(): MutationObserver;
    _observe(): void;
}
