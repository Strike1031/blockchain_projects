/** @type {import('next').NextConfig} */

const { withSentryConfig } = require("@sentry/nextjs");

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  env: {
    MORALIS_APPLICATION_ID: process.env.MORALIS_APPLICATION_ID,
    MORALIS_SERVER_URL: process.env.MORALIS_SERVER_URL,
    ENVIRONMENT: process.env.ENVIRONMENT,
    WALLETCONNECT: process.env.WALLETCONNECT,
  },
  images: {
    loader: "imgix",
    path: "https://pozzlenauts.pozzleplanet.com/",
  },
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);;
