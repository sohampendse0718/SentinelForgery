/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/supabase-proxy/:path*',
        // We are hardcoding this temporarily to bypass the 'undefined' error
        destination: 'https://cbpaqkhntdpmwlzlemgp.supabase.co/:path*',
      },
    ];
  },
}

export default nextConfig;