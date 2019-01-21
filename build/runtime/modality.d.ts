declare enum ModalityName {
    Dom = "dom",
    DomTouch = "dom-touch",
    Vr = "vr",
    Voice = "voice"
}
export declare class Modality {
    readonly names: string[];
    private constructor();
    static create(names: string[]): Modality;
    intersection(other: Modality): Modality;
    isResolved(): boolean;
    isCompatible(names: string[]): boolean;
    static readonly Name: typeof ModalityName;
    static readonly all: Modality;
    static readonly dom: Modality;
    static readonly domTouch: Modality;
    static readonly voice: Modality;
    static readonly vr: Modality;
}
export {};
