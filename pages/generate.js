import { callLambda } from "../../lib/lambda";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { eventId, linkedinUrl } = req.body || {};
    if (!eventId) return res.status(400).json({ error: "Missing eventId" });

    const data = await callLambda("/generate", {
      method: "POST",
      body: { eventId, linkedinUrl },
    });

    // expected: { emailBody, subject, companyInfo, candidateSummary, ... }
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}