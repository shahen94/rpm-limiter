import { invariant } from './utils';

/**
 * Counter class that counts the number of requests per minute.
 */
export class Counter {
  private count: number;
  private timeoutId: number = NO_TIMEOUT;
  private readonly rpm: number;

  private readonly onCounterResetListeners: Array<() => void> = [];

  constructor(options: CounterOptions) {
    invariant(options.rpm > 0, 'RPM must be greater than 0');

    this.count = 0;
    this.rpm = options.rpm;
  }

  /**
   * Checks if the counter can proceed based on the current count and rpm.
   * @returns {boolean} True if the counter can proceed, false otherwise.
   */
  canProceed(): boolean {
    return this.count <= this.rpm;
  }

  /**
   * Starts the counter.
   * The counter will reset every minute.
   */
  start() {
    this.reset();
    // @ts-ignore
    this.timeoutId = setInterval(() => this.reset(), MINUTE_IN_MILLISECONDS);
  }

  isStarted(): boolean {
    return this.timeoutId !== NO_TIMEOUT;
  }

  /**
   * Stops the counter.
   * Counting interval will be cleared.
   */
  stop() {
    if (this.timeoutId === NO_TIMEOUT) {
      return;
    }

    clearInterval(this.timeoutId);
    this.timeoutId = NO_TIMEOUT;
  }

  /**
   * Increments the counter.
   * If the counter can proceed, the count will be incremented.
   * @returns {boolean} True if the counter can proceed, false otherwise.
   */
  tryIncrement(): boolean {
    if (this.canProceed()) {
      this.count++;
      return true;
    }

    return false;
  }

  /**
   * Adds a listener for the counter reset event.
   * @param {() => void} listener Listener function.
   */
  onCounterReset(listener: () => void) {
    this.onCounterResetListeners.push(listener);
  }

  private reset() {
    this.count = 0;
    this.invokeOnCounterResetListeners();
  }

  private invokeOnCounterResetListeners() {
    this.onCounterResetListeners.forEach(listener => listener());
  }
}

// ─── Constants ───────────────────────────────────────────────────────────────

const NO_TIMEOUT = -2;
const MINUTE_IN_MILLISECONDS = 60 * 1000;

// ─── Types ───────────────────────────────────────────────────────────────────

type CounterOptions = {
  rpm: number;
};