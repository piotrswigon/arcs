import { Arc } from './arc.js';
import { SlotComposer } from './slot-composer.js';
import { Particle } from './recipe/particle.js';
import { ParticleSpec } from './particle-spec.js';
export declare class ParticleExecutionHost {
    private _apiPort;
    close: () => void;
    private arc;
    private nextIdentifier;
    slotComposer: SlotComposer;
    private idleVersion;
    private idlePromise;
    private idleResolve;
    constructor(port: any, slotComposer: SlotComposer, arc: Arc);
    stop(): void;
    readonly idle: Promise<Map<Particle, number[]>>;
    readonly messageCount: number;
    sendEvent(particle: any, slotName: any, event: any): void;
    instantiate(particle: any, spec: any, handles: any): any;
    startRender({ particle, slotName, providedSlots, contentTypes }: {
        particle: ParticleSpec;
        slotName: string;
        providedSlots: {
            [index: string]: string;
        };
        contentTypes: string[];
    }): void;
    stopRender({ particle, slotName }: {
        particle: ParticleSpec;
        slotName: string;
    }): void;
    innerArcRender(transformationParticle: ParticleSpec, transformationSlotName: string, hostedSlotId: string, content: any): void;
}
