import { invariant } from './invariant';

// ─────────────────────────────────────────────────────────────────────────────

describe('invariant', () => {
  it('should not throw when condition is true', () => {
    expect(() => invariant(true, 'This should not throw')).not.toThrow();
  });

  it('should throw an error with the given message when condition is false', () => {
    const message = 'Condition failed';
    expect(() => invariant(false, message)).toThrowError(new Error(message));
  });

  it('should throw an error named "Invariant Violation"', () => {
    try {
      invariant(false, 'some message');
    } catch (err: any) {
      expect(err.name).toBe('Invariant Violation');
    }
  });

  it('should have a stack trace', () => {
    try {
      invariant(false, 'another message');
    } catch (err: any) {
      expect(err.stack).toBeDefined();
      expect(typeof err.stack).toBe('string');
    }
  });
});