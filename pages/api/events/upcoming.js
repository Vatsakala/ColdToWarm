// pages/api/events/upcoming.js
// This API route returns a list of dummy calendar events. It does not
// communicate with any external service. You can adjust the dates,
// descriptions and attendees to suit your testing needs.

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // A handful of dummy events for demonstration. Each event includes an
  // identifier, a title (summary), start and end times, a description and
  // a short attendee list. Times use ISO 8601 strings and are set in UTC.
  const events = [
    {
      id: 'evt-1',
      summary: 'Product Design Interview',
      description: 'Discuss product design process and past projects.',
      start: { dateTime: '2026-02-21T15:00:00Z' },
      end: { dateTime: '2026-02-21T16:00:00Z' },
      attendees: [
        { email: 'recruiter@acme.com', name: 'Alex Recruiter' },
        { email: 'candidate@example.com', name: 'Sam Candidate' },
      ],
      htmlLink: 'https://calendar.google.com/event?eid=evt-1',
    },
    {
      id: 'evt-2',
      summary: 'Engineering Deep Dive',
      description: 'Technical discussion about system architecture and coding standards.',
      start: { dateTime: '2026-02-22T17:30:00Z' },
      end: { dateTime: '2026-02-22T18:30:00Z' },
      attendees: [
        { email: 'techlead@acme.com', name: 'Taylor Techlead' },
        { email: 'candidate@example.com', name: 'Sam Candidate' },
      ],
      htmlLink: 'https://calendar.google.com/event?eid=evt-2',
    },
    {
      id: 'evt-3',
      summary: 'HR & Culture Fit Interview',
      description: 'Assess candidate alignment with company values and culture.',
      start: { dateTime: '2026-02-23T14:00:00Z' },
      end: { dateTime: '2026-02-23T14:45:00Z' },
      attendees: [
        { email: 'hr@acme.com', name: 'Harper HR' },
        { email: 'candidate@example.com', name: 'Sam Candidate' },
      ],
      htmlLink: 'https://calendar.google.com/event?eid=evt-3',
    },
  ];

  return res.status(200).json({ events });
}