import express, { Request, Response } from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ----------------- Generate 6-Digit OTP -----------------
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 🔹 the sender ID you created in AuthKey

const AUTH_KEY = "d97a806b8dbbc4db"; // <--- your AuthKey API key
const SENDER_ID = "28256";
const COUNTRY_CODE = "91"; // India by default

// ----------------- Send OTP API -----------------
app.post("/api/send-otp", async (req: Request, res: Response) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ error: "Mobile number is required" });
    }

    const otp = generateOTP();
    const message = encodeURIComponent(`OTP for your complaint registration is ${otp}-GOVTAP`);

    const url = `https://console.authkey.io/request?authkey=${AUTH_KEY}&mobile=${mobile}&country_code=${COUNTRY_CODE}&sms=${message}&sender=${SENDER_ID}`;

    const response = await fetch(url);
    const data = await response.json();

    console.log("AuthKey response:", data);

    // Return OTP (for development only)
    res.json({ success: true, otp, apiResponse: data });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// ----------------- Verify OTP API -----------------
app.post("/api/verify-otp", (req: Request, res: Response) => {
  const { enteredOtp } = req.body;
  const storedOtp = req.headers["x-stored-otp"]; // example header (or store in DB/session)

  if (enteredOtp === storedOtp) {
    res.json({ success: true, message: "OTP verified successfully" });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP" });
  }
});

// ----------------- Start Server -----------------
app.listen(3000, () => console.log("✅ AuthKey OTP API running on port 3000"));
