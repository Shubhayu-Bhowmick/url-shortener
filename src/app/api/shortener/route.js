import { NextRequest, NextResponse } from "next/server";
//import { urlData } from '@/lib/urlData';
import { db } from '@/lib/db';
import { urls } from '@/lib/schema';
const { eq } = require('drizzle-orm');

// The URL shortener logic
function idToShortURL(id) {
    const map = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let shorturl = [];
    while (id) {
        shorturl.push(map[id % 62]);
        id = Math.floor(id / 62);
    }
    shorturl.reverse();
    return shorturl.join("");
}



// Store URL logic
async function storeUrl(originalUrl, shortUrl) {

    const formattedDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });

    const newEntry = {
        shortUrl: `${process.env.NEXT_PUBLIC_DOMAIN}/${shortUrl}`, // Form the full short URL
        originalUrl: originalUrl,
        clicks: 0,          // Initial number of clicks
        status: "active",
        createdAt: formattedDate,
    };

    await db.insert(urls).values(newEntry);
    return newEntry;  // Return the new entry to be used in the response
}



export async function GET() {
    const allUrls = await db.select().from(urls);
    return NextResponse.json(allUrls);
}


export async function POST(request) {
    const { original_url } = await request.json();
    const shortURL = idToShortURL((await db.select().from(urls)).length + 1);
    const newUrl = await storeUrl(original_url, shortURL);
    return NextResponse.json({ message: "URL shortened successfully!", newUrl });
}


export async function PATCH(request) {
    const { id, status } = await request.json();

    if (!id || (status !== 'active' && status !== 'inactive')) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    try {
        const updatedUrl = await db.update(urls)
            .set({ status: status })
            .where(eq(urls.id, id))
            .returning();

        if (updatedUrl.length === 0) {
            return NextResponse.json({ error: "URL not found" }, { status: 404 });
        }

        return NextResponse.json({ 
            message: "URL status updated successfully", 
            updatedUrl: updatedUrl[0] 
        });
    } catch (error) {
        console.error('Error updating URL status:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    try {
        const deletedUrl = await db.delete(urls)
            .where(eq(urls.id, parseInt(id)))
            .returning();

        if (deletedUrl.length === 0) {
            return NextResponse.json({ error: "URL not found" }, { status: 404 });
        }

        return NextResponse.json({ 
            message: "URL deleted successfully", 
            deletedUrl: deletedUrl[0] 
        });
    } catch (error) {
        console.error('Error deleting URL:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}