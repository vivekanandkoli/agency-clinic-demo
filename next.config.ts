import type { NextConfig } from 'next'
import { isLoopbackSupabaseUrl, SUPABASE_AUTH_PROXY_PATH } from './lib/supabase/env'

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Local Supabase only: pass the browser's auth calls (admin sign-in/out) through to it, so admin
  // login also works when the site is shared from this machine through a tunnel. Auth API only.
  async rewrites() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!url || !isLoopbackSupabaseUrl(url)) return []
    return [
      {
        source: `${SUPABASE_AUTH_PROXY_PATH}/auth/v1/:path*`,
        destination: `${url.replace(/\/$/, '')}/auth/v1/:path*`,
      },
    ]
  },
  // Image domains for Supabase storage
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/wikipedia/commons/**',
      },
    ],
  },
}

export default nextConfig
