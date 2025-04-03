import { kv } from "@vercel/kv";

export default async function handler(req, res) {
    try {
        const soldNumbers = (await kv.get("soldNumbers")) || [];
        res.status(200).json(soldNumbers);
    } catch (error) {
        console.error("Error fetching numbers:", error);
        res.status(500).json({ error: "Error fetching numbers" });
    }
}
