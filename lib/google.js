import { google } from "googleapis";

export function getOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("Missing Google OAuth env vars (GOOGLE_CLIENT_ID/SECRET/REDIRECT_URI)");
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export function getAuthUrl() {
  const oauth2 = getOAuthClient();
  return oauth2.generateAuthUrl({
    access_type: "offline", // so we can get refresh_token
    prompt: "consent",      // forces refresh_token on first time
    scope: [
      "https://www.googleapis.com/auth/calendar.readonly",
      "openid",
      "email",
      "profile",
    ],
  });
}

export async function exchangeCodeForTokens(code) {
  const oauth2 = getOAuthClient();
  const { tokens } = await oauth2.getToken(code);
  return tokens; // { access_token, refresh_token, expiry_date, ... }
}

export async function listUpcomingEvents(tokens) {
  const oauth2 = getOAuthClient();
  oauth2.setCredentials(tokens);

  const calendar = google.calendar({ version: "v3", auth: oauth2 });

  const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

  const resp = await calendar.events.list({
    calendarId,
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });

  const items = resp.data.items || [];

  // Normalize fields for your UI
  const events = items.map((e) => ({
    id: e.id,
    summary: e.summary,
    description: e.description,
    start: e.start,
    end: e.end,
    attendees: (e.attendees || []).map((a) => ({
      email: a.email,
      name: a.displayName,
    })),
    hangoutLink: e.hangoutLink,
    htmlLink: e.htmlLink,
  }));

  return events;
}