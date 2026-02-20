import cookie from "cookie";
import { exchangeCodeForTokens } from "../../../../lib/google";

export default async function handler(req, res) {
  try {
    const code = req.query.code;
    if (!code) return res.status(400).send("Missing code");

    const tokens = await exchangeCodeForTokens(code);

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("google_tokens", JSON.stringify(tokens), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
    );

    return res.redirect("/meetings");
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}