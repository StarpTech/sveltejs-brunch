# sveltejs-brunch

[![npm](https://img.shields.io/npm/v/sveltejs-brunch.svg?maxAge=3600)](https://www.npmjs.com/package/sveltejs-brunch)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](#badge)

Compile [Svelte](https://github.com/sveltejs/svelte) components inside [Brunch](https://github.com/brunch/brunch) projects.

- Extract the CSS into a separate file
- Support CSS & JS Sourcemaps
- Preprocessing of markup, style, script
- Define file extensions which should be compiled
- Pass any Svelte compiler option

# Installation

```
npm install --save-dev sveltejs-brunch
```

By default all `*.svelte.html`, `.svelte` files are compiled, unless you use the `pattern` option.

# Advanced usage

```js
module.exports.plugins = {
  sveltejs: {
    // To extract the CSS into files, simply include to extractCSS option in your Brunch config like so...
    extractCSS: true,
    // To combine the sourcemaps from all components into one
    combineSourceMapCSS: true,
    // The generated combined css file
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
# Caveats
There are some [limitation](https://github.com/Rich-Harris/svelte-preprocessor-demo#future-work) regarding to sourcemaps. Svelve precompilation step does not consume sourcmaps from the precompilation steps and that's the reason why your code does not point to the exact original code. You can test this if you postCSS your styles.
