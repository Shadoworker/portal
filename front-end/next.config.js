/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['strapi-test-1-staging.eu-central-1.elasticbeanstalk.com'],
    },
}

module.exports = nextConfig
// module.exports = {
//   async rewrites() {
//     return [
//       // Rewrite everything else to use `pages/index`
//       {
//         source: '/:path*',
//         destination: '/',
//       },
//     ];
//   },
// };