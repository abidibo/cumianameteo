const CracoAlias = require('craco-alias')
const CracoEnvPlugin = require('craco-plugin-env')

module.exports = {
  // if you want to track react-redux selectors
  webpack: {
    alias: {
      'react-redux': process.env.NODE_ENV === 'development' ? 'react-redux/lib' : 'react-redux',
    },
  },
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'jsconfig',
        // baseUrl SHOULD be specified
        // plugin does not take it from jsconfig
        baseUrl: './src',
      },
    },
    {
      plugin: CracoEnvPlugin,
      options: {
        variables: {}
      }
    }
  ],
}
