import dbConnect from '@/mongoDB/client';
import { NextResponse } from 'next/server';
import { getImage } from '@/mongoDB/actions/images';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const imageId = searchParams.get('id');

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 });
    }

    const result = await getImage(imageId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return new NextResponse(result?.image?.data, {
      headers: {
        'Content-Type': result?.image?.mimeType,
        'Content-Length': result?.image?.size.toString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}
