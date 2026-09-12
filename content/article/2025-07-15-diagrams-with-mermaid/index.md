+++
title = "Diagrams with Mermaid"
description = "A quick tour of Mermaid diagrams, themed to match the code blocks."

[taxonomies]
tags = ["markdown", "diagrams"]

[extra]
hero_image = "article/hero/mermaid.svg"
hero_alt = "Mermaid banner"
+++

Mermaid turns plain text into diagrams. Wrap the source in the `mermaid`
component and it renders in the browser, themed to match the code blocks.

<!-- more -->

## Flowchart

{% <mermaid> %}
flowchart LR
  A[Write Markdown] --> B{Mermaid block?}
  B -- yes --> C[Render diagram]
  B -- no --> D[Render prose]
  C --> E[Publish]
  D --> E
{% </mermaid> %}

## Sequence

{% <mermaid> %}
sequenceDiagram
  participant R as Reader
  participant S as Site
  participant M as Mermaid
  R->>S: Request page
  S-->>R: HTML + diagram source
  R->>M: Run on load
  M-->>R: Rendered SVG
{% </mermaid> %}

## Class

{% <mermaid> %}
classDiagram
  class Page {
    +String title
    +String body
    +render()
  }
  class Article
  class Gallery
  Page <|-- Article
  Page <|-- Gallery
{% </mermaid> %}

## Pie

{% <mermaid> %}
pie showData
  title Time spent
  "Writing" : 5
  "Diagrams" : 3
  "Tweaking CSS" : 8
{% </mermaid> %}
