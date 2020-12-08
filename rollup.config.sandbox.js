import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

export default {
  input: 'dist/client/sandbox.js',
  output: {
    file: 'static/sandbox.js',
    format: 'iife'
  },
  plugins: [resolve(),commonjs()]
}
