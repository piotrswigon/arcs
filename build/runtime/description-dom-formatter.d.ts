/**
 * @license
 * Copyright (c) 2017 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { DescriptionFormatter, CombinedDescriptionsOptions, ParticleDescription } from './description-formatter.js';
export declare class DescriptionDomFormatter extends DescriptionFormatter {
    private nextID;
    _isSelectedDescription(desc: any): boolean;
    _combineSelectedDescriptions(selectedDescriptions: ParticleDescription[], options: CombinedDescriptionsOptions): any;
    _retrieveTemplateAndModel(particleDesc: ParticleDescription, index: any, options: any): {
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
    _formatSingleton(handleName: any, value: any): {
        template: string;
        model: {
            [x: string]: any;
        };
    };
}
