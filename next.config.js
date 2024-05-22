/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sacred-texts.com",
        port: "",
        pathname: "/tarot/pkt/img/**",
      },
    ],
  },
};

module.exports = nextConfig;
