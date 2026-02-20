import cookie from "cookie";
import { listUpcomingEvents, getAuthUrl } from "../../../lib/google";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    const cookies = cookie.parse(req.headers.cookie || "");
    const raw = cookies.google_tokens;

    if (!raw) {
      // Not authenticated yet — tell frontend where to go
      return res.status(401).json({
        error: "Not authenticated with Google",
        authUrl: "/api/auth/google/start",
      });
    }

    let tokens;
    try {
      tokens = JSON.parse(raw);
    } catch {
      return res.status(401).json({
        error: "Invalid auth cookie",
        authUrl: "/api/auth/google/start",
      });
    }

    const events = await listUpcomingEvents(tokens);
    return res.status(200).json({ events });
  } catch (e) {
    // If token expired or revoked, push re-auth
    const msg = e?.message || "Failed to load events";
    const shouldReauth =
      msg.includes("invalid_grant") || msg.includes("Invalid Credentials") || msg.includes("401");

    return res.status(shouldReauth ? 401 : 500).json({
      error: msg,
      authUrl: "/api/auth/google/start",
    });
  }
}