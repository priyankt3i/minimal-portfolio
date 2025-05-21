// minimal-portfolio/api/gemini-proxy.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const geminiApiKey = process.env.GEMINI_API_KEY; // Securely accessed from Vercel env vars

    if (!geminiApiKey) {
        return res.status(500).json({ error: "API key not configured on the server." });
    }

    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;

    try {
        const geminiResponse = await fetch(geminiApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // req.body already contains the { contents: chatHistory } payload from the client
            body: JSON.stringify(req.body) 
        });

        const data = await geminiResponse.json();

        if (!geminiResponse.ok) {
            console.error("Error from Gemini API:", data);
            return res.status(geminiResponse.status).json(data);
        }

        res.status(200).json(data);
    } catch (error) {
        console.error("Error in proxying to Gemini API:", error);
        res.status(500).json({ error: "Failed to connect to the Gemini API." });
    }
}
