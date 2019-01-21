import { SlotDomConsumer } from './slot-dom-consumer.js';
import { SuggestDomConsumer } from './suggest-dom-consumer.js';
import { DescriptionFormatter } from './description-formatter.js';
export declare class ModalityHandler {
    readonly slotConsumerClass: typeof SlotDomConsumer;
    readonly suggestionConsumerClass: typeof SuggestDomConsumer;
    readonly descriptionFormatter?: typeof DescriptionFormatter;
    constructor(slotConsumerClass: typeof SlotDomConsumer, suggestionConsumerClass: typeof SuggestDomConsumer, descriptionFormatter?: typeof DescriptionFormatter);
    static createHeadlessHandler(): ModalityHandler;
    static readonly domHandler: ModalityHandler;
}
