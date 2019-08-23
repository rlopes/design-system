import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import nodeResolve from 'rollup-plugin-node-resolve';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import replace from 'rollup-plugin-replace';

const extensions = ['.stories.js'];

export default {
  input: 'src/index.stories.js',
  output: { file: 'dist/stories/index.js', format: 'esm' },
  plugins: [
    /*
     * Instead of declaring a hard-coded list of external libraries (`react`, `react-dom`, etc.),
     * this library automatically externalizes dependencies declared as peerDependencies
     * in package.json
     */
    peerDepsExternal(),

    /*
     * Defines dependency entry points dynamically (prefer ESM).
     * Adhere to `package.json/browser when present.
     */
    nodeResolve({
      extensions,
      mainFields: ['module', 'main', 'browser'],
    }),

    /*
     * Convert CJS module dependencies to ES6 modules.
     */
    commonjs({
      include: '**/node_modules/**',
      extensions,
    }),

    /*
     * Convert .json files to ES6 modules.
     */
    json(),

    /*
     * Transpile modern ECMAScript down to target JavaScript.
     * Transpilation process takes into consideration `babel.config.js` and `.browserslistrc`
     */
    babel({
      exclude: '**/node_modules/**',
      babelrc: false,
      configFile: './babel.config.js',
    }),

    /*
     * Inline stringification of specific environment variables.
     */
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.BUILD),
    }),
  ],
};
