export declare abstract class KeyBase {
    protocol: string;
    location: string;
    abstract base(): string;
    abstract readonly arcId: string;
    abstract childKeyForHandle(id: any): KeyBase;
    abstract childKeyForArcInfo(): KeyBase;
    abstract childKeyForSuggestions(userId: any, arcId: any): KeyBase;
    abstract childKeyForSearch(userId: any): KeyBase;
    abstract toString(): string;
}
