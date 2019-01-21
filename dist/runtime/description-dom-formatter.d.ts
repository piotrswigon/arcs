import { DescriptionFormatter, CombinedDescriptionsOptions, ParticleDescription } from './description.js';
export declare class DescriptionDomFormatter extends DescriptionFormatter {
    private nextID;
    _isSelectedDescription(desc: any): boolean;
    _populateParticleDescription(particle: any, descriptionByName: any): {
        pattern: any;
    } | {
        pattern?: undefined;
    } | {
        template: any;
        model: any;
        pattern: any;
    } | {
        template: any;
        model: any;
        pattern?: undefined;
    };
    _combineSelectedDescriptions(selectedDescriptions: ParticleDescription[], options: CombinedDescriptionsOptions): Promise<any>;
    _retrieveTemplateAndModel(particleDesc: any, index: any, options: any): {
        template: any;
        model: any;
    };
    _capitalizeAndPunctuate(sentence: any): any;
    _joinDescriptions(descs: any): any;
    _joinTokens(tokens: any): any;
    _combineDescriptionAndValue(token: any, description: any, storeValue: any): {
        template: string;
        model: any;
    };
    _formatEntityProperty(handleName: any, properties: any, value: any): {
        template: string;
        model: {
            [x: string]: any;
        };
    };
    _formatCollection(handleName: any, values: any): {
        template: any;
        model: any;
    };
    _formatBigCollection(handleName: any, firstValue: any): {
        template: string;
        model: {
            [x: string]: any;
        };
    };
    _formatSingleton(handleName: any, value: any, handleDescription: any): {
        template: string;
        model: {
            [x: string]: any;
        };
    };
}
