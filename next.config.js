/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|svg)$/,
      loader: 'file-loader',
      options: {
        limit: 1024,
        name: '[name].[ext]',
        publicPath: 'dist/assets/',
        outputPath: 'dist/assets/'
      }
    })
    return config
  },
}

module.exports = nextConfig