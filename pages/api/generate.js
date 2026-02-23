// pages/api/generate.js
// This API route simulates generation of an interview prep brief. It returns
// a static result regardless of the input. Feel free to customise the
// returned fields for your testing. In a real application this endpoint
// would call a backend service or AI model.

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { eventId, linkedinUrl } = req.body || {};
  if (!eventId) {
    return res.status(400).json({ error: 'eventId is required' });
  }
  // Basic validation for the LinkedIn URL. We ignore invalid values in this
  // dummy implementation but include the URL in the output if present.
  const result = {
    subject: `Interview prep for event ${eventId}`,
    companyInfo:
      'Acme Corp is a global leader in widget technology, founded in 2005 and now serving millions of customers worldwide.',
    candidateSummary:
      'Sam Candidate has five years of experience in software engineering, specialising in cloud-native applications and microservices. Past roles include developing scalable APIs and mentoring junior developers.',
    emailBody:
      `Hi Team,\n\nHere is the prep brief for our upcoming interview:\n\n• Event ID: ${eventId}\n• LinkedIn URL: ${linkedinUrl || 'N/A'}\n\nCompany Info:\nAcme Corp is a global leader in widget technology, founded in 2005 and now serving millions of customers worldwide.\n\nCandidate Summary:\nSam Candidate has five years of experience in software engineering, specialising in cloud-native applications and microservices. Past roles include developing scalable APIs and mentoring junior developers.\n\nLet’s ensure we cover both technical depth and cultural fit during the conversation.\n\nBest regards,\nInterview Prep Bot`,
  };
  return res.status(200).json(result);
}