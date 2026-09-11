+++
title = "Advanced Rust Traits"
description = "Diving deeper into traits, generics, and trait objects."

[taxonomies]
tags = ["rust", "traits"]
series = ["Rust Journey"]
+++

Traits are Rust's answer to shared behaviour. This post explores generic bounds
and dynamic dispatch.

<!-- more -->

## Defining a trait

```rust
trait Greet {
    fn greet(&self) -> String;
}

struct Robot;

impl Greet for Robot {
    fn greet(&self) -> String {
        String::from("BEEP BOOP")
    }
}
```

## Static vs dynamic dispatch

Generic bounds are resolved at compile time, while trait objects (`dyn Greet`)
are resolved at runtime.

> [!NOTE]
> Generic bounds are monomorphized[^mono] at compile time, so static dispatch can be faster but produces larger binaries.

[^mono]: Monomorphization generates a specialized copy of a function for each concrete type it is used with.
