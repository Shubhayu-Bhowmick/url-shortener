import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ShortUrlPage({ params }) {
    const { shortUrl } = params;
    console.log("Fetching short URL:", shortUrl);

    try {

        // Fetch the original URL from the API
        const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/shortener/${shortUrl}`, { cache: 'no-store', next: { revalidate: 0 } });

        if (!res.ok) {
            console.error('API error:', res.statusText);
            notFound();
            return;
        }

        const data = await res.json();
        
        if (data.originalUrl) {
            // Perform the redirect on the client side
            return (
              <html>
              <head>
                  <meta httpEquiv="refresh" content={`2;url=${data.originalUrl}`} />
                  <title>Redirecting...</title>
                  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
              </head>
              <body className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 min-h-screen flex flex-col items-center justify-center text-white">
                  <div className="text-center">
                      <svg className="animate-spin h-16 w-16 mb-4 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Redirecting you shortly</h1>
                      <p className="text-lg sm:text-xl md:text-2xl mb-2">Please wait while we take you to your destination</p>
                      <p className="text-sm sm:text-base md:text-lg break-all">
                          Destination: <span className="font-semibold">{data.originalUrl}</span>
                      </p>
                  </div>
              </body>
          </html>
            );
        } else {
            notFound();
        }
    } catch (error) {
        console.error('Fetch error:', error);
        notFound();
    }
}