import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

export default {
  input: 'dist/client/index.js',
  output: {
    file: 'static/app.js',
    format: 'iife'
  },
  plugins: [resolve(),commonjs()]
}
