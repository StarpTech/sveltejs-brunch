# sveltejs-brunch

[![npm](https://img.shields.io/npm/v/sveltejs-brunch.svg?maxAge=3600)](https://www.npmjs.com/package/sveltejs-brunch)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](#badge)

Compile [Svelte](https://github.com/sveltejs/svelte) components inside [Brunch](https://github.com/brunch/brunch) projects.

# Installation

```
npm install --save-dev sveltejs-brunch
```

By default all `*.svelte.html`, `.svelte` files are compiled, unless you use the `pattern` option.

# Advanced usage

- Extract CSS
- Sourcemaps
- Preprocessing of html, css, script
- File Pattern
- Pass Svelte compiler options

```js
module.exports.plugins = {
  sveltejs: {
    // To extract the CSS into files, simply include to extractCSS option in your Brunch config like so...
    extractCSS: true,
    out: './public/components.css',
    // By default, svelte, svelte.html are used.
    pattern: /\.(svelte|html)$/
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
