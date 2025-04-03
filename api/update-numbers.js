import { kv } from "@vercel/kv";

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { numbers } = req.body;
            await kv.set("soldNumbers", numbers);
            res.status(200).json({ message: "Numbers updated", numbers });
        } catch (error) {
            console.error("Error updating numbers:", error);
            res.status(500).json({ error: "Error updating numbers" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
