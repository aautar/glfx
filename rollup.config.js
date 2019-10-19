import babel from 'rollup-plugin-babel';
import nodeResolve from "rollup-plugin-node-resolve";

// rollup.config.js
export default [
  {
    input: 'lib/glfx.js',
    output: {
      format: 'esm',
      file: 'dist/glfx.js',
      name: 'glfx'
    },
    plugins:[
        nodeResolve({
            jsnext: true,
            main: true,
            browser: true
        })
    ]
  },
  {
    input: 'dist/glfx.js',
    output: {
      format: 'iife',
      file: 'dist/glfx.min.js',
      name: 'glfx',
      sourcemap: true  
    },
    plugins: [
        babel({
            babelrc: false,
            presets: [
                [
                    '@babel/env', 
                    {
                        targets: {
                        "chrome": "41"
                        },       
                        "corejs": "2",
                        useBuiltIns: "usage"     
                    }
                ],          
                [
                    'minify', {
                        builtIns: false,
                        deadcode: false,
                    }
                ], 
            ],
            comments: false,
            exclude: 'node_modules/**',
        }),
    ],
  }
];
