'use strict'

const svelte = require('svelte')
const fs = require('fs')
const path = require('path')

function sanitize(input) {
  return path
    .basename(input)
    .replace(path.extname(input), '')
    .replace(/[^a-zA-Z_$0-9]+/g, '_')
    .replace(/^_/, '')
    .replace(/_$/, '')
    .replace(/^(\d)/, '_$1')
}

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1)
}

class SvelteCompiler {
  constructor(cfg) {
    this.opts = cfg.plugins.sveltejs || {}
    this.opts.preprocess = this.opts.preprocess || {}
    this.opts.format = this.opts.format || 'cjs'
    this.cssLookup = new Map()

    if (this.opts.pattern) {
      this.pattern = this.opts.pattern
      delete opts.pattern
    }

    if (this.opts.extractCSS) this.opts.css = false
  }
  onCompile() {
    if (this.opts.extractCSS) {
      this.extractCSS()
    }
  }
  compile(args) {
    if (!this.opts.name) this.opts.name = capitalize(sanitize(args.path))

    return svelte.preprocess(args.data, this.opts.preprocess).then(result => {
      let { code, map, css, cssMap } = svelte.compile(
        result.toString(),
        Object.assign(
          {
            filename: args.path
          },
          {
            onwarn: warning => {
              // TODO replace this with warning.code, post sveltejs/svelte#824
              if (
                options.css === false &&
                warning.message === 'Unused CSS selector'
              )
                return
              console.warn(warning)
            },
            onerror: error => console.error(error)
          },
          this.opts
        )
      )

      if (this.opts.extractCSS && css) {
        this.cssLookup.set(args.path, {
          code: css,
          map: cssMap
        })
      }

      return {
        data: code,
        map
      }
    })
  }
  extractCSS() {
    const outPath = this.opts.out || this.opts.o || 'bundle.css'
    let css = ''
    for (let chunk of this.cssLookup.values()) {
      if (!chunk.code) continue
      css += chunk.code + '\n'
    }

    if (typeof outPath === 'object' && outPath.write) {
      outPath.write(css)
      outPath.end()
    } else if (typeof outPath === 'string') {
      fs.writeFileSync(outPath, css)
    }
  }
}

SvelteCompiler.prototype.brunchPlugin = true
SvelteCompiler.prototype.type = 'javascript'
SvelteCompiler.prototype.pattern = /\.(svelte|svelte\.html)$/

module.exports = SvelteCompiler
