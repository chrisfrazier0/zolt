+++
title = "Getting Started with Rust"
description = "The first stop on my journey learning the Rust programming language."

[taxonomies]
tags = ["rust", "programming"]
series = ["Rust Journey"]

[extra]
hero_image = "article/hero/rust.svg"
hero_alt = "Abstract Rust banner"

# Social sharing
social_image = "article/hero/rust-og.png"
social_image_alt = "Getting Started with Rust"
social_author = "@zolt"
+++

Rust is a systems programming language focused on safety and performance :crab:. In this
first post of the series we set up a toolchain[^rustup] and write our very first program.

<!-- more -->

## Installing the toolchain

Install `rustup`, then confirm the compiler is available:

```bash
rustup default stable
rustc --version
```

> [!CAUTION]
> Don't mix a distro-packaged `rustc` with `rustup`; conflicting toolchains cause confusing version errors.

## Hello, world

Every journey starts somewhere:

```rust
fn main() {
    println!("Hello, world!");
}
```

> [!TIP]
> Prefer `cargo run` over calling `rustc` directly — Cargo builds and runs in one step.

In the next installment we dig into traits.

[^rustup]: `rustup` is the official Rust toolchain installer and version manager.
