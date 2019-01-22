import { ParticleExecutionContext } from './particle-execution-context.js';
export declare class Loader {
    pec?: ParticleExecutionContext;
    path(fileName: string): string;
    join(prefix: string, path: string): string;
    normalizeDots(path: string): string;
    loadResource(file: string): any;
    _loadFile(file: string): Promise<{}>;
    _loadURL(url: string): any;
    loadParticleClass(spec: any): Promise<any>;
    requireParticle(fileName: string): Promise<any>;
    setParticleExecutionContext(pec: ParticleExecutionContext): void;
    unwrapParticle(particleWrapper: any): any;
}
