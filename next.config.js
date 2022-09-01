/** @type {import('next').NextConfig} */

const api_url =
  process?.env?.NODE_ENV == "production"
    ? "https://bikes-ledro.herokuapp.com/api/v1"
    : "http://192.168.1.102:5000/api/v1";

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    API_URL: api_url,
  },
};

module.exports = nextConfig;
