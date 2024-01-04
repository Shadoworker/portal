/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['strapi-test-1-staging.eu-central-1.elasticbeanstalk.com', "https://country-code-au6g.vercel.app"],
    },
    async headers() {
        return [
            {
                // matching all API routes
                source: "/mobilemoney/v1/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
                    { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
                    { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
                ]
            }
        ]
    }
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