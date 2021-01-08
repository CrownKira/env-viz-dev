const cracoConfig = (module.exports = {
  webpack: {
    configure: webpackConfig => {
      // workaround .mjs files by Acorn
      webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      });

      return webpackConfig;
    }
  }
});
