// The following code comes from the official documentation of imagekit.io: https://imagekit.io/docs/server-side-authentication/nextjs
import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
    const { token, expire, signature } = getUploadAuthParams({
        privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY as string,
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
    });

    return Response.json({
        token,
        expire,
        signature,
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    });
}
