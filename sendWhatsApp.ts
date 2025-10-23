import express, { Request, Response } from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const PAGE_ACCESS_TOKEN = "EAAQXHrY5c9cBP2wYkpGv6DpwoPNbvXdEFNUBMKtO4wVoun4hwcbQVEBMf6HifUj40gFTRngG2ChUOYuZAHfo9ZBs2fhiJUM64nwRzDxHKDoEo27yq3LjsW4yvsNK7ZCS7jEZBN2ecPNJjZBvDv40n1P7ktaqaKjEXPTgMaZByTAQteMmqcl3rk4ZA6GhqKp7khzbvmctozWmsRP62YI9ph5XevnBKg9whsNHjwPlNyiksnFW7xeYFIKPqNqRZCFZAkOXZCurKgLihFZABTenEbZBzyeUugZDZD";
const PHONE_NUMBER_ID = "880740341781735";

app.post("/api/sendWhatsApp", async (req: Request, res: Response) => {
  try {
    const { to, message } = req.body;

    const response = await fetch(`https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PAGE_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message },
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

app.listen(3000, () => console.log("✅ WhatsApp API running on port 3000"));
