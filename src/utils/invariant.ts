/**
 * Throws an error if the condition is false.
 * @param condition - The condition to evaluate.
 * @param message - The error message to throw if the condition is false.
 */
export const invariant = (condition: boolean, message: string): void => {
  if (!condition) {
    const error = new Error(message);
    error.name = 'Invariant Violation';
    error.stack = (new Error()).stack;

    throw error;
  }
};