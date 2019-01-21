/**
 * Returns the set delta between two lists based on direct object comparison.
 */
export declare function setDiff<T>(from: T[], to: T[]): {
    add: T[];
    remove: T[];
};
/**
 * Returns the set delta between two lists based on custom object comparison.
 * `keyFn` takes type T and returns the value by which items should be compared.
 */
export declare function setDiffCustom<T, U>(from: T[], to: T[], keyFn: (T: any) => U): {
    add: T[];
    remove: T[];
};
