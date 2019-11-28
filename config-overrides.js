// const path = require('path');
// const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
// const CACHE_ID = 'nem2-dev-ui';

module.exports = function override(config, env) {
  console.debug({ config, env });

  // console.debug(config.module);
  // console.debug(config.resolveLoader);
  // config.module.rules = [...config.module.rules,
  /// ]
  // const isEnvDevelopment = env === 'development';
  // const isEnvProduction  = env === 'production';

  // config.resolve = {
  //   ...config.resolve,
  //   alias: { '@': path.resolve(__dirname, 'src') },
  // };

  // if(isEnvProduction) {
  //   const publicUrl = isEnvProduction
  //     ? config.output.publicPath.slice(0, -1)
  //     : isEnvDevelopment && '';
  //   const alterWorkboxWebpackPlugin = new WorkboxWebpackPlugin.GenerateSW({
  //     cacheId: CACHE_ID,
  //     globDirectory: 'build',
  //     globPatterns: [
  //       "assets/**/*.{html,json,js,css,jpg,png,gif,webp,svg,ttf,woff,ico}"
  //     ],
  //     // include: [/.+\.(html|json|js|css|jpg|png|gif|svg|woff)$/],
  //     clientsClaim: true,
  //     skipWaiting: true,
  //     exclude: [/\.map$/, /asset-manifest\.json$/],
  //     importWorkboxFrom: 'cdn',
  //     navigateFallback: publicUrl + '/index.html',
  //     navigateFallbackBlacklist: [new RegExp('^/_'), new RegExp('/[^/]+\\.[^/]+$')],
  //     runtimeCaching: [
  //       { urlPattern: /.+(\/|.html|.json)$/,
  //         handler: "NetworkFirst",
  //         options: {
  //           cacheName: CACHE_ID + "-html-cache",
  //           expiration: { maxAgeSeconds: 30 * 60 * 60 * 24 }
  //         },
  //       },
  //       { urlPattern: /.+\.(js|css|woff)$/,
  //         handler: "CacheFirst",
  //         options: {
  //           cacheName: CACHE_ID + "-dependent-cache",
  //           expiration: { maxAgeSeconds: 90 * 60 * 60 * 24 }
  //         },
  //       },
  //       { urlPattern: /.+\.(png|gif|jpg|jpeg|svg|ico)$/,
  //         handler: "CacheFirst",
  //         options: {
  //           cacheName: CACHE_ID + "-image-cache",
  //           expiration: { maxAgeSeconds: 30 * 60 * 60 * 24, purgeOnQuotaError: true }
  //         },
  //       },
  //     ]
  //   });
  //   const assignedIndex = config.plugins.findIndex(p => p instanceof WorkboxWebpackPlugin.GenerateSW);
  //   console.debug('Replace WorkboxWebpackPlugin.GenerateSW instance.');
  //   config.plugins[assignedIndex] = alterWorkboxWebpackPlugin;
  // }
  console.debug('Rewired!');
  return config;
};
