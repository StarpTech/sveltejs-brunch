'use strict'

const svelte = require('svelte')

class SvelteCompiler {
  constructor(cfg) {
    this.opts = cfg.plugins.sveltejs || {}
    this.opts.preprocess = this.opts.preprocess || {}
    this.opts.format = this.opts.format || 'cjs'

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

  compile({ data }) {
    return svelte.preprocess(data, this.opts.preprocess).then(() => {
      return svelte.compile(data, this.opts).code
    })
  }
}

SvelteCompiler.prototype.brunchPlugin = true
SvelteCompiler.prototype.type = 'javascript'
SvelteCompiler.prototype.pattern = /\.(svelte|svelte\.html)$/

module.exports = SvelteCompiler
