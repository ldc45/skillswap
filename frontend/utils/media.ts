// The following code comes from the official documentation of imagekit.io: https://imagekit.io/docs/integration/nextjs#uploading-files
/**
 * Authenticates and retrieves the necessary upload credentials from the server.
 *
 * This function calls the authentication API endpoint to receive upload parameters like signature,
 * expire time, token, and publicKey.
 *
 * @returns {Promise<{signature: string, expire: string, token: string, publicKey: string}>} The authentication parameters.
 * @throws {Error} Throws an error if the authentication request fails.
 */
export const authenticator = async () => {
    try {
        // Perform the request to the upload authentication endpoint.
        const response = await fetch("/api/upload-auth");
        if (!response.ok) {
            // If the server response is not successful, extract the error text for debugging.
            const errorText = await response.text();
            throw new Error(
                `Request failed with status ${response.status}: ${errorText}`
            );
        }

        // Parse and destructure the response JSON for upload credentials.
        const data = await response.json();
        const { signature, expire, token, publicKey } = data;
        return { signature, expire, token, publicKey };
    } catch (error) {
        // Log the original error for debugging before rethrowing a new error.
        console.error("Authentication error:", error);
        throw new Error("Authentication request failed");
    }
};
