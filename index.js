'use strict'

const svelte = require('svelte')
const fs = require('fs')

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

    this.opts.onerror = err => {
      console.error(err.message)
    }

    this.opts.onwarn = warning => {
      console.warn(warning.message)
    }
  }
  onCompile() {
    this.extractCSS()
  }
  compile(args) {
    return svelte.preprocess(args.data, this.opts.preprocess).then(result => {
      const compiled = svelte.compile(result.toString(), this.opts)

      if (this.opts.extractCSS) {
        this.cssLookup.set(args.path, {
          code: compiled.css
        })
      }

      return compiled.code
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
