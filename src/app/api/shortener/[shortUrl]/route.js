import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { urls } from "@/lib/schema";
const { eq } = require('drizzle-orm');

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
    const { shortUrl } = params;
    console.log('Received shortUrl:', shortUrl);
    try {
        const urlEntry = await db.select()
            .from(urls)
            .where(eq(urls.shortUrl, `${process.env.NEXT_PUBLIC_DOMAIN}/${shortUrl}`))
            .limit(1);

        if (urlEntry.length > 0) {
            const foundUrl = urlEntry[0];

            if (foundUrl.status === "active") {
                // Increment the click count
                await db.update(urls)
                    .set({ clicks: foundUrl.clicks + 1 })
                    .where(eq(urls.id, foundUrl.id));

                // Return the original URL as a JSON response
                return NextResponse.json({ originalUrl: foundUrl.originalUrl });
            } else {
                // If the URL is inactive, return a 403 response
                return NextResponse.json({ error: "URL is inactive" }, { status: 403 });
            }
        } else {
            // If no matching URL is found, return a 404 response
            return NextResponse.json({ error: "URL not found" }, { status: 404 });
        }
    } catch (error) {
        // Handle any errors that occur during the request
        console.error('Database query error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}