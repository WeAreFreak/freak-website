// Pages left over from the old WordPress site, including spam that was injected into it, answer
// "410 Gone" so Google drops them for good. Only these addresses run this code; every other page
// is served straight from the static files.
export const config = {
  matcher: [
    '/cbto9su/:path*', '/wp-admin/:path*', '/wp-content/:path*', '/wp-includes/:path*', '/wp-json/:path*',
    '/xmlrpc.php', '/wp-login.php', '/feed/:path*', '/author/:path*', '/category/:path*', '/tag/:path*',
    '/2018/:path*', '/2019/:path*', '/2020/:path*', '/2021/:path*', '/2022/:path*',
    '/12k', '/20k', '/6k', '/8k', '/audio-2', '/3475-2', 
    '/12-touchdowns-follow-matthews-on-man-returned-limited-jatavis-brown-womens-jersey',
    '/another-lucky-his-fourth-start-home-sides-only-try-chad-williams-jersey',
  ],
};

export default function middleware() {
  return new Response('Gone', { status: 410, headers: { 'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex' } });
}
