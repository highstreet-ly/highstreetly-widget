const sveltePreprocess = require('svelte-preprocess')
const DisableWarnings = require('./disable-warnings')
const { sep } = require('path')



module.exports = {
  stories: ['../src/**/*.stories.[tj]s', '../src/**/*.story.[tj]s'],
  addons: [
    '@storybook/addon-actions/register',
    '@storybook/addon-viewport/register',
    '@storybook/addon-storysource',
    // '@storybook/addon-console'
  ],
  webpackFinal: async (config, { configType }) => {
    let j
    // Find svelteloader from the webpack config
    const svelteloader = config.module.rules.find((r, i) => {
      if (r.loader && r.loader.includes('svelte-loader')) {
        j = i
        return true
      }
    })

    // config.entry = config.entry.filter(singleEntry => !singleEntry.includes(`${sep}webpack-hot-middleware${sep}`))

    config.plugins.push(new DisableWarnings())

    // safely inject preprocess into the config
    config.module.rules[j] = {
      ...svelteloader,
      options: {
        ...svelteloader.options,
        preprocess: sveltePreprocess({
            postcss: {
                plugins: [
                    require("tailwindcss"),
                    require("autoprefixer"),
                ],
            },
        }),
      },
    }

    // return the overridden config
    return config
  },
}
