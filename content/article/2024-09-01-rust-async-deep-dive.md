+++
title = "Rust Async Deep Dive"
description = "Futures, executors, and the async/await model in Rust."
updated = "2025-06-15"

[taxonomies]
tags = ["rust", "async"]
series = ["Rust Journey"]
+++

The final chapter of the journey: asynchronous programming.

<!-- more -->

## An async function

```rust,linenos
async fn fetch(url: &str) -> String {
    // pretend we do IO here
    format!("contents of {url}")
}
```

Futures are lazy; they do nothing until polled by an executor. :rocket:

> [!WARNING]
> Never call blocking code inside an `async fn` — it stalls the entire executor thread[^block].

[^block]: For CPU-bound or blocking work, use `spawn_blocking` (Tokio) or a dedicated thread pool.
