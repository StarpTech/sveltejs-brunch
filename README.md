# sveltejs-brunch

Compile Svelte components inside Brunch projects

# Installation

```
npm install --save-dev sveltejs-brunch
```

By default all `*.svelte.html`, `.svelte` files are compiled, unless you use the `pattern` option.

# Advanced usage

```js
module.exports.plugins = {
  sveltejs: {
    pattern: /\.(svelte|html)$/ // By default, svelte, svelte.html is used.
    // Optionally, preprocess components with svelte.preprocess:
    // https://github.com/sveltejs/svelte#preprocessor-options
    preprocess: {
      style: ({ content }) => {
        return transformStyles(content)
      }
    },
    // Other compiler options https://github.com/sveltejs/svelte#compiler-options
    ...
  }
}
```
