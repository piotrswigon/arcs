import { SlotDomConsumer } from './slot-dom-consumer.js';
import { SuggestDomConsumer } from './suggest-dom-consumer.js';
import { DescriptionDomFormatter } from './description-dom-formatter.js';
export declare class Modality {
    readonly name: string;
    readonly slotConsumerClass: typeof SlotDomConsumer;
    readonly suggestionConsumerClass: typeof SuggestDomConsumer;
    readonly descriptionFormatter?: typeof DescriptionDomFormatter;
    private constructor();
    static _modalities: {};
    static addModality(name: string, slotConsumerClass: typeof SlotDomConsumer, suggestionConsumerClass: typeof SuggestDomConsumer, descriptionFormatter?: typeof DescriptionDomFormatter): void;
    static init(): void;
    static forName(name: string): any;
}
