/**
 * A wrapper around a set of Bytes that roughly mimics the browser
 * Blob type as used in the File API.  This is a separate
 * implementation that works across Node and the Browser.
 *
 * here's a way to construct a Blob from a Bytes object:
 *
 * ```
 *   const blob = new Blob([bytes.content()]);
 * ```
 */
export declare class Bytes {
    private blob;
    /**
     * Constructs a Bytes object from a base64 string.
     */
    constructor(base64bytes: string);
    /**
     * Returns a Promise with the Blob.
     */
    content(): Promise<Uint8Array>;
    /**
     * Returns a Promise with the bytes for the specified range of data.
     */
    range(offset: number, length: number): Promise<Uint8Array>;
    /**
     * Returns a Promise with the String for a URL that can fetch the contents
     * of the stored Blob.
     */
    url(): Promise<string>;
    toString(): string;
}
