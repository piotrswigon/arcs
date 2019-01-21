import { Particle } from './particle.js';
/**
 * Particle that interoperates with DOM.
 */
export declare class DomParticleBase extends Particle {
    private currentSlotName;
    constructor();
    /**
     * Override to return a String defining primary markup.
     */
    readonly template: string;
    /**
     * Override to return a String defining primary markup for the given slot name.
     */
    getTemplate(slotName: string): string;
    /**
     * Override to return a String defining the name of the template for the given slot name.
     */
    getTemplateName(slotName: string): string;
    /**
     * Override to return false if the Particle won't use it's slot.
     */
    shouldRender(stateArgs?: any): boolean;
    /**
     * Override to return a dictionary to map into the template.
     */
    render(stateArgs?: any): {};
    renderSlot(slotName: string, contentTypes: string[]): void;
    private slotNamesToModelReferences;
    private enhanceModelWithSlotIDs;
    _getStateArgs(): any[];
    forceRenderTemplate(slotName: string): void;
    fireEvent(slotName: string, { handler, data }: {
        handler: any;
        data: any;
    }): void;
    setParticleDescription(pattern: any): boolean;
    /**
     * Remove all entities from named handle.
     */
    clearHandle(handleName: string): Promise<void>;
    /**
     * Merge entities from Array into named handle.
     */
    mergeEntitiesToHandle(handleName: string, entities: any): Promise<void>;
    /**
     * Append entities from Array to named handle.
     */
    appendEntitiesToHandle(handleName: string, entities: any): Promise<void>;
    /**
     * Create an entity from each rawData, and append to named handle.
     */
    appendRawDataToHandle(handleName: any, rawDataArray: any): Promise<void>;
    /**
     * Modify value of named handle. A new entity is created
     * from `rawData` (`new [EntityClass](rawData)`).
     */
    updateVariable(handleName: string, rawData: any): any;
    /**
     * Modify or insert `entity` into named handle.
     * Modification is done by removing the old entity and reinserting the new one.
     */
    updateSet(handleName: string, entity: any): Promise<void>;
    /**
     * Returns array of Entities found in BOXED data `box` that are owned by `userid`
     */
    boxQuery(box: any, userid: any): any;
}
