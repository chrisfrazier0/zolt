+++
title = "Highlighting Code and Showing Changes"
description = "Spotlighting a single line and making edits between code blocks obvious."

[taxonomies]
tags = ["rust", "markdown"]
+++

Two things make code far easier to follow in a technical post: being able to
point at one exact line, and being able to show *what changed* between one
version of a snippet and the next. Here is how both look on this blog.

<!-- more -->

## Highlighting a specific line

Append `hl_lines` to the code fence's language annotation and the entire line —
not just the text — is highlighted across the full width of the block.

```rust,hl_lines=3
fn main() {
    let name = "world";
    println!("hello, {name}");
    let _ = name.len();
}
```

The highlight above is a single line (`hl_lines=3`). You can also highlight a
**range** with `2-4`, or several discrete lines by separating them with spaces,
e.g. `hl_lines=1 3-4`. It composes with line numbers too — just add `linenos`:

```rust,linenos,hl_lines=2-3
fn main() {
    let name = "world";
    println!("hello, {name}");
    let _ = name.len();
}
```

## Emphasizing changes between blocks

When an example evolves, showing the starting point and then the finished code
leaves the reader hunting for the difference. Instead, show the original, add a
sentence of context, then show the change directly.

Here is a small function that totals up a list of items:

```rust
fn process(items: &[Item]) -> Summary {
    let mut total = 0;
    let mut count = 0;
    for item in items {
        total += item.price;
        count += 1;
    }
    Summary { total, count }
}
```

Now suppose two things change in different places: prices become fractional, so
the accumulator switches to a float, and we start skipping invalid items and
applying tax inside the loop. Show the updated block and use `hl_lines` to
spotlight only the touched lines — note the highlight is **not** one contiguous
block, it marks a single line up top and a couple more further down:

```rust,hl_lines=2 5-6
fn process(items: &[Item]) -> Summary {
    let mut total = 0.0;
    let mut count = 0;
    for item in items {
        if !item.valid { continue; }
        total += item.price * 1.08;
        count += 1;
    }
    Summary { total, count }
}
```

Everything else stays dim, so your eye jumps straight to the two edit sites: the
changed accumulator on line 2, and the new guard plus tax calculation on lines
5–6. Because it is still real, colorized code, the reader gets the changes *and*
the full surrounding context in a single block.
