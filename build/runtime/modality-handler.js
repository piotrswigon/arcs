import { SlotDomConsumer } from './slot-dom-consumer.js';
import { SuggestDomConsumer } from './suggest-dom-consumer.js';
import { MockSlotDomConsumer } from './testing/mock-slot-dom-consumer.js';
import { MockSuggestDomConsumer } from './testing/mock-suggest-dom-consumer.js';
import { DescriptionDomFormatter } from './description-dom-formatter.js';
export class ModalityHandler {
    constructor(slotConsumerClass, suggestionConsumerClass, descriptionFormatter) {
        this.slotConsumerClass = slotConsumerClass;
        this.suggestionConsumerClass = suggestionConsumerClass;
        this.descriptionFormatter = descriptionFormatter;
    }
    static createHeadlessHandler() {
        return new ModalityHandler(MockSlotDomConsumer, MockSuggestDomConsumer);
    }
}
ModalityHandler.domHandler = new ModalityHandler(SlotDomConsumer, SuggestDomConsumer, DescriptionDomFormatter);
//# sourceMappingURL=modality-handler.js.map