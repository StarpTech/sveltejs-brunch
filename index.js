'use strict'
const svelte = require('svelte/compiler')
const fs = require('fs')
const path = require('path')
const combine = require('combine-source-map')

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
    // svelte 3 throws error if unknown key exists in compile options
    this.preProcessOpts = this.opts.preprocess || {}
    delete this.opts.preprocess
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

    return svelte.preprocess(args.data, this.preProcessOpts).then(result => {
      let {js, css, ast} = svelte.compile(
        result.toString(),
        Object.assign({ filename: args.path }, this.opts)
      )

      if (this.opts.extractCSS && css) {
        this.cssLookup.set(args.path, {
          code: css,
          map: cssMap,
          path: args.path
        })
      }

      return {
        data: js.code,
        map: js.map
      }
    })
  }

  extractCSS() {
    const outPath = this.opts.out || this.opts.o || 'bundle.css'
    let css = ''
    let sourceMapCombiner = combine.create(path.basename(outPath))
    let offset = 0
    
    for (let chunk of this.cssLookup.values()) {
      if (!chunk.code) continue
      css += chunk.code + '\n'

      if (this.opts.combineSourceMapCSS) {
        sourceMapCombiner.addFile(
          {
            source:
              chunk.code + '\n/*# sourceMappingURL=' + chunk.map.toUrl() + '*/',
            sourceFile: chunk.path
          },
          {
            line: offset
          }
        )
        offset += 1
      }
    }

    if (this.opts.combineSourceMapCSS) {
      css +=
        '\n/*# sourceMappingURL=data:application/json;base64,' +
        sourceMapCombiner.base64() +
        '*/'
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
