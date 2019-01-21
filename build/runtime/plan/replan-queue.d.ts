/**
 * @license
 * Copyright (c) 2018 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { PlanProducer } from './plan-producer.js';
export declare class ReplanQueue {
    planProducer: PlanProducer;
    options: {
        [index: string]: number;
    };
    changes: number[];
    private replanTimer;
    constructor(planProducer: PlanProducer, options?: {});
    addChange(): void;
    private _onPlanningStateChanged;
    isReplanningScheduled(): boolean;
    private _scheduleReplan;
    private _cancelReplanIfScheduled;
    private _postponeReplan;
    private _canPostponeReplan;
}
