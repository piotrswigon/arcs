import { Arc } from './arc.js';
import { Particle } from './recipe/particle.js';
import { Recipe } from './recipe/recipe.js';
export declare class Relevance {
    readonly versionByStore: {};
    private readonly relevanceMap;
    private constructor();
    static create(arc: Arc, recipe: Recipe): Relevance;
    apply(relevance: Map<Particle, number[]>): void;
    calcRelevanceScore(): number;
    isRelevant(plan: any): boolean;
    static scaleRelevance(relevance: any): number;
    static particleRelevance(relevanceList: any): number;
    calcParticleRelevance(particle: Particle): number;
}
