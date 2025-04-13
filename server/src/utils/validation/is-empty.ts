/**
 * Checks if a value is empty (undefined, null, empty object, or empty string)
 * @param value - The value to check
 * @returns true if the value is empty, false otherwise
 */
const isEmpty = (value: any): boolean =>
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0);

export default isEmpty;
