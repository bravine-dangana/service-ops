/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/checkout-customer-xxxx',
        destination: '/payment-flows/checkout-customer-xxxx',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
