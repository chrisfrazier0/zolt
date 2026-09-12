+++
title = "Math and Markdown"
description = "Demonstrating KaTeX math and syntax-highlighted code in an article."

[taxonomies]
tags = ["math", "markdown"]

[extra]
hero_image = "article/hero/math.svg"
hero_alt = "Mathematics banner"

# Social sharing
social_image = "article/hero/math-og.png"
social_title = "Beautiful Math & Code, Rendered"
social_description = "See KaTeX equations and syntax-highlighted code shared with a rich preview card."
+++

This standalone article (not part of any series) shows off inline and block math
alongside highlighted code. :sparkles:

<!-- more -->

## Inline and display math

Euler's identity is beautiful: {% <katex> %}e^{i\pi} + 1 = 0{% </katex> %}.

The Gaussian integral, as a display equation:

{% <katex block={true}> %}
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
{% </katex> %}

## Some code

```python
import math

def gaussian(x, mu=0.0, sigma=1.0):
    coeff = 1.0 / (sigma * math.sqrt(2 * math.pi))
    return coeff * math.exp(-((x - mu) ** 2) / (2 * sigma ** 2))
```

Math and code, side by side.

> [!IMPORTANT]
> Wrap expressions in the `katex` component[^katex] so Markdown doesn't escape the backslashes before KaTeX runs.

[^katex]: The component emits the raw expression into a span that the KaTeX auto-render script processes in the browser.
