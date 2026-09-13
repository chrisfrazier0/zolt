+++
title = "Typography & Markdown"
description = "A quick tour of the Markdown formatting this theme supports, all on one page."

[taxonomies]
tags = ["markdown", "typography"]
+++

A one-page reference for the everyday Markdown this theme renders — headings,
text styles, lists, tables, links, images, and more. Code blocks, KaTeX, and
Mermaid have their own articles, so they're skipped here. :pencil2:

<!-- more -->

## Text styles

You can write **bold text**, _italic text_, **_bold italic_**, and
~~strikethrough~~. Sprinkle in some `inline code` where it helps, and drop a
footnote[^note] when an aside is worth keeping out of the main flow. Emoji work
too :rocket:, and so do super simple things like line
breaks in the source.

Here's a longer paragraph to show how body copy sits on the page. Good
typography is mostly about rhythm: consistent spacing, comfortable line length,
and enough contrast to stay readable without shouting. The measure here is
capped so lines never run too wide.

## Headings

The heading above is an `h2`. Sub-sections use smaller levels:

### Third-level heading

#### Fourth-level heading

##### Fifth-level heading

###### Sixth-level heading

## Lists

Unordered lists are handy for loose collections:

- First item
- Second item, with a **bold** word
- Third item
  - A nested item
  - Another nested item, with `code`
- Back to the top level

Ordered lists keep their numbering:

1. Set up the project
2. Write some content
3. Build the site
   1. Run the checks
   2. Ship it

Task lists render checkboxes:

- [x] Draft the article
- [x] Add every format
- [ ] Review the styling

## Blockquotes

> Simplicity is the ultimate sophistication.
>
> Nested quotes are supported as well:
>
> > A quote inside a quote, for when you're citing someone citing someone.

GitHub-style alerts add a little colour:

> [!NOTE]
> This is a note. Use it for helpful, non-critical context.

> [!TIP]
> This is a tip — a shortcut or a nicer way to do something.

> [!WARNING]
> This is a warning. Read before you proceed.

## Links & images

Links can be [inline](https://www.getzola.org/), [reference-style][zola], or
bare autolinks like <https://www.getzola.org/>. Links can also carry a
[title attribute](https://www.getzola.org/ "Zola's homepage").

An inline image sits in the flow of the page:

![The zolt logo](/img/zolt.png)

[zola]: https://www.getzola.org/documentation/content/overview/

## Tables

| Feature       | Syntax       | Supported |
| ------------- | ------------ | :-------: |
| Bold          | `**text**`   |    yes    |
| Italic        | `*text*`     |    yes    |
| Strikethrough | `~~text~~`   |    yes    |
| Inline code   | `` `code` `` |    yes    |
| Footnotes     | `[^id]`      |    yes    |

Columns can be aligned left, right, or centre:

| Left    | Centre | Right |
| :------ | :----: | ----: |
| apples  |  one   |  1.00 |
| oranges |  two   | 12.50 |
| pears   | three  |  3.75 |

## Horizontal rule

Use a thematic break to separate sections:

---

That's the whole toolbox. Everything above is plain Markdown — no custom
components required.

[^note]:
    Footnotes collect at the bottom of the article and link back to where
    they were referenced.
