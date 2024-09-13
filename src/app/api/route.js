import { NextRequest, NextResponse } from "next/server";

export async function GET(req) {
    console.log(req)
    return NextResponse.json({message: 'This is a get request'})

}

export async function POST(req) {
    try {
       // const data = await req.json(); // Await the JSON parsing 
        return NextResponse("hello world"); // Respond with the same data
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return NextResponse.json({ error: 'Failed to parse JSON' }, { status: 400 });
    }
}