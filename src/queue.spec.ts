import { RPMQueue } from './queue';

// ─────────────────────────────────────────────────────────────────────────────

jest.useFakeTimers();

// ─────────────────────────────────────────────────────────────────────────────

describe('RPMQueue', () => {
  const rpm = 3;

  let queue: RPMQueue;

  beforeEach(() => {
    jest.useFakeTimers();
    queue = new RPMQueue(rpm);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should execute immediately if within rpm limit', () => {
    const fn = jest.fn();

    queue.run(fn);
    queue.run(fn);
    queue.run(fn);

    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should queue functions once rpm is exceeded', () => {
    const fn = jest.fn();

    for (let i = 0; i < rpm + 2; i++) {
      queue.run(fn);
    }

    expect(fn).toHaveBeenCalledTimes(rpm);
  });

  it('should execute queued functions after reset', () => {
    const fn = jest.fn();

    for (let i = 0; i < rpm + 2; i++) {
      queue.run(fn);
    }

    expect(fn).toHaveBeenCalledTimes(rpm);

    jest.advanceTimersByTime(60_000); // simulate 1 minute

    expect(fn).toHaveBeenCalledTimes(rpm + 2);
  });

  it('should call wait() and resolve when queue is empty', async () => {
    const fn = jest.fn();

    for (let i = 0; i < rpm + 1; i++) {
      queue.run(fn);
    }

    const waitPromise = queue.wait();

    let resolved = false;
    waitPromise.then(() => (resolved = true));

    expect(resolved).toBe(false);

    jest.advanceTimersByTime(60_000);

    for (let i = 0; i < 5; i++) {
      jest.advanceTimersByTime(60_000);
      await Promise.resolve(); // flush queue
    }

    expect(fn).toHaveBeenCalledTimes(rpm + 1);
    expect(resolved).toBe(true);
  });

  it('should not resolve wait() if queue is already empty', async () => {
    const promise = queue.wait();
    await expect(promise).resolves.toBeUndefined();
  });

  it('should stop the counter after queue is empty', () => {
    const fn = jest.fn();
    queue.run(fn);
    queue.run(fn);
    queue.run(fn);
    queue.run(fn);

    const stopSpy = jest.spyOn<any, any>(queue['counter'], 'stop');

    jest.advanceTimersByTime(60_000);

    expect(stopSpy).toHaveBeenCalled();
  });
});