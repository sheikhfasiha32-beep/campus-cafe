# HTTP observations (Lab 4, Task 1)

| Question | My answer |
|----------|-----------|
| Request method for index.html | |
| Status code with Disable cache ticked | |
| Status code on a normal reload | |
| Status code for /nothing-here.html | |
| Value of the Content-Type response header | |
| Remote Address (IP and port) | |
| Protocol in the address bar (http or https) | |

## Why is this address http and not https?
This address uses HTTP because Live Server is running a local development website on my computer. HTTPS is not configured for this local development server, so the browser uses HTTP instead.
## Specificity experiment

The #main p selector has higher specificity than .hero p, so it overrides the hero paragraph's white text color.
## Selectors I used

| Selector type | Example from my CSS |
|---|---|
| Element | `body` |
| Class | `.card` |
| ID | `#main` |
| Grouping (comma) | `h1, h2, h3` |
| Descendant (space) | `.menu-item p` |
| Child (`>`) | `form > fieldset` |
| Adjacent sibling (`+`) | `h1 + p` |
| Compound (no space) | `a.active` |
| Attribute | `input[required]` |
| Pseudo-class | `a:hover` |
| Pseudo-element | `::placeholder` |