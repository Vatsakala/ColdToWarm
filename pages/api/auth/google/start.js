import { getAuthUrl } from "../../../../lib/google";

export default function handler(req, res) {
  try {
    const url = getAuthUrl();
    return res.redirect(url);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}