# ⏱️ rpm-limiter

A lightweight, zero-dependency **rate limiter and queue manager** built in TypeScript. `rpm-limiter` helps you run functions at a controlled rate per minute — ideal for APIs with rate limits such as OpenAI, Gemini, or VertexAI.

> ✅ Supports both synchronous and queued execution based on Requests Per Minute (RPM).

---

## ✨ Features

- ⚡ Execute functions at a fixed RPM
- 🕒 Automatically queues overflow calls
- 🔁 Automatically resets every minute
- ✅ Built-in counter and listener system
- 🔍 Fully tested with 100% coverage
- 💡 Small, tree-shakable, ESM/CommonJS/browser compatible

---

## 📦 Installation

```bash
npm install rpm-limiter
```

---

## 🚀 Basic Usage

```typescript
import { RPMQueue } from 'rpm-limiter';

const queue = new RPMQueue(5); // 5 requests per minute

queue.run(() => console.log('Call 1'));
queue.run(() => console.log('Call 2'));
queue.run(() => console.log('Call 3'));
queue.run(() => console.log('Call 4'));
queue.run(() => console.log('Call 5'));
queue.run(() => console.log('Call 6')); // gets queued
```

You can optionally wait until the queue has been fully processed:

```typescript
await queue.wait(); // resolves once all queued items are flushed
```

## 🧠 Purpose

Many APIs and third-party services impose limits on the number of requests you can make per minute. This package ensures that:

* You stay within the allowed RPM
* You don’t need to manage timers manually
* Any extra requests are queued and retried after reset
* You can safely await queue completion with .wait()

## 🔧 API Reference

### RPMQueue

```typescript
new RPMQueue(rpm: number)
```

Creates a new queue limited to rpm calls per minute.

**Methods**
* `run(fn: () => void): void` - Runs a function and queues it if the RPM limit is exceeded.
* `wait(): Promise<void>` - Waits until all queued items are processed.

### Counter
A lower-level utility used internally by RPMQueue, but also useful for custom rate logic.

```typescript
new Counter({ rpm: number })
```

**Methods**
* `start(): void` – Starts the reset interval.
* `stop(): void` – Stops the reset interval.
* `canProceed(): boolean` – Checks if you can increment.
* `tryIncrement(): boolean` – Increments the counter if under the limit.
* `isStarted(): boolean` – Returns whether the counter is running.
* `onCounterReset(listener: () => void): void` – Registers a listener for every reset.


## 🧪 Tests
Run tests and generate coverage report:

```bash
npm test
```

## 🛠️ Build
Builds CommonJS, ESM, and browser-friendly UMD bundles:

```bash
npm run build
```
Output:

```
dist/
├── cjs/        (CommonJS)
├── esm/        (ESM)
├── browser/    (UMD for browser use)
├── types/      (Type declarations)
```

## 🤝 Contributing
1. Clone the repo
2. Create a feature branch
3. Run `yarn`
4. Add tests for new features
5. Make a PR!

## 📄 License
MIT © [Shahen Hovhannisyan](https://github.com/shahen94)


## 🙌 Acknowledgements
This library was inspired by practical use cases when integrating with rate-limited APIs like OpenAI and VertexAI. Built with ❤️ in TypeScript.

