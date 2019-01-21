export class Relevance {
    constructor() {
        // stores a copy of arc.getVersionByStore
        this.versionByStore = {};
        // public for testing
        this.relevanceMap = new Map();
    }
    static create(arc, recipe) {
        const relevance = new Relevance();
        const versionByStore = arc.getVersionByStore({ includeArc: true, includeContext: true });
        recipe.handles.forEach(handle => {
            if (handle.id && versionByStore[handle.id] !== undefined) {
                relevance.versionByStore[handle.id] = versionByStore[handle.id];
            }
        });
        return relevance;
    }
    apply(relevance) {
        for (const key of relevance.keys()) {
            if (this.relevanceMap.has(key)) {
                this.relevanceMap.set(key, this.relevanceMap.get(key).concat(relevance.get(key)));
            }
            else {
                this.relevanceMap.set(key, relevance.get(key));
            }
        }
    }
    calcRelevanceScore() {
        let relevance = 1;
        let hasNegative = false;
        for (const rList of this.relevanceMap.values()) {
            const particleRelevance = Relevance.particleRelevance(rList);
            if (particleRelevance < 0) {
                hasNegative = true;
            }
            relevance *= Math.abs(particleRelevance);
        }
        return relevance * (hasNegative ? -1 : 1);
    }
    // Returns false, if at least one of the particles relevance lists ends with a negative score.
    isRelevant(plan) {
        const hasUi = plan.particles.some(p => Object.keys(p.consumedSlotConnections).length > 0);
        let rendersUi = false;
        for (const [particle, rList] of this.relevanceMap) {
            if (rList[rList.length - 1] < 0) {
                continue;
            }
            else if (Object.keys(particle.consumedSlotConnections).length) {
                rendersUi = true;
                break;
            }
        }
        // If the recipe has UI rendering particles, at least one of the particles must render UI.
        return hasUi === rendersUi;
    }
    static scaleRelevance(relevance) {
        if (relevance == undefined) {
            relevance = 5;
        }
        relevance = Math.max(-1, Math.min(relevance, 10));
        // TODO: might want to make this geometric or something instead;
        return relevance / 5;
    }
    static particleRelevance(relevanceList) {
        let relevance = 1;
        let hasNegative = false;
        relevanceList.forEach(r => {
            const scaledRelevance = Relevance.scaleRelevance(r);
            if (scaledRelevance < 0) {
                hasNegative = true;
            }
            relevance *= Math.abs(scaledRelevance);
        });
        return relevance * (hasNegative ? -1 : 1);
    }
    calcParticleRelevance(particle) {
        if (this.relevanceMap.has(particle)) {
            return Relevance.particleRelevance(this.relevanceMap.get(particle));
        }
        return -1;
    }
}
//# sourceMappingURL=relevance.js.map