import { Counter } from './counter';

// ─────────────────────────────────────────────────────────────────────────────

/**
 * A queue that runs functions at a specific rate per minute.
 * If the rate limit is reached, the functions will be queued.
 * @class RPMQueue
 * @example
 * const queue = new RPMQueue(5);
 * queue.run(() => console.log('Hello, World 1!'));
 * queue.run(() => console.log('Hello, World 2!'));
 * queue.run(() => console.log('Hello, World 3!'));
 * queue.run(() => console.log('Hello, World 4!'));
 * queue.run(() => console.log('Hello, World 5!'));
 * queue.run(() => console.log('Hello, World 6!'));
 * queue.run(() => console.log('Hello, World 7!'));
 * queue.run(() => console.log('Hello, World 8!'));
 */
export class RPMQueue {
  private readonly counter: Counter;

  private queue: EnqueueFunc[] = [];
  private waitResolver: (() => void) | null = null;

  /**
   * @param rpm The rate per minute.
   */
  constructor(rpm: number) {
    this.counter = new Counter({ rpm });
    this.counter.onCounterReset(() => this.batchQueue());
  }

  /**
   * Runs a function.
   * If the rate limit is reached, the function will be queued.
   * @param {EnqueueFunc} func The function to run.
   */
  run(func: EnqueueFunc) {
    if (!this.counter.isStarted()) {
      this.counter.start();
    }

    if (this.counter.tryIncrement()) {
      func();
      return;
    }

    this.enqueue(func);
  }

  async wait(): Promise<void> {
    if (this.queue.length === 0) {
      return;
    }

    return new Promise<void>((resolve) => {
      this.waitResolver = resolve;
    });
  }

  private batchQueue() {
    while (this.counter.tryIncrement()) {
      const func = this.dequeue();

      if (!func) {
        this.fulfillQueue();
        
        break;
      }

      func();
    }
  }

  private fulfillQueue() {
    this.counter.stop();
    this.waitResolver?.();
    this.waitResolver = null;
  }

  private enqueue(func: EnqueueFunc) {
    this.queue.push(func);
  }

  private dequeue() {
    return this.queue.shift();
  }
}

// ─────────────────────────────────────────────────────────────────────────────

type EnqueueFunc = () => void;