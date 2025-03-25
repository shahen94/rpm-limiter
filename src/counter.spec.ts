import { Counter } from './counter';

// ─────────────────────────────────────────────────────────────────────────────

jest.useFakeTimers();

// ─────────────────────────────────────────────────────────────────────────────

describe('Counter', () => {
  const RPM = 5;

  let counter: Counter;

  beforeEach(() => {
    counter = new Counter({ rpm: RPM });
  });

  afterEach(() => {
    counter.stop();
    jest.clearAllTimers();
  });

  it('should start with a count of 0 and allow proceeding', () => {
    expect(counter.canProceed()).toBe(true);
  });

  it('should increment count and allow up to rpm', () => {
    for (let i = 0; i <= RPM; i++) {
      expect(counter.tryIncrement()).toBe(true);
    }

    // Should reject the next increment
    expect(counter.tryIncrement()).toBe(false);
  });

  it('should reset count every minute when started', () => {
    counter.start();

    for (let i = 0; i <= RPM; i++) {
      counter.tryIncrement();
    }

    expect(counter.tryIncrement()).toBe(false);

    jest.advanceTimersByTime(60_000); // simulate 1 minute

    expect(counter.tryIncrement()).toBe(true);
  });

  it('should call reset listeners on reset', () => {
    const listener = jest.fn();
    counter.onCounterReset(listener);

    counter.start();
    jest.advanceTimersByTime(60_000);

    expect(listener).toHaveBeenCalled();
  });

  it('should not reset or increment when stopped', () => {
    const listener = jest.fn();
    counter.onCounterReset(listener);

    counter.start();
    expect(listener).toHaveBeenCalledTimes(1)
    counter.stop();

    jest.advanceTimersByTime(60_000);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should return false for isStarted() before start and true after', () => {
    expect(counter.isStarted()).toBe(false);
    counter.start();
    expect(counter.isStarted()).toBe(true);
  });

  it('should be idempotent when calling stop multiple times', () => {
    expect(() => {
      counter.stop();
      counter.stop();
    }).not.toThrow();
  });
});