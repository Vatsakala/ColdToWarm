// pages/generate.js
// This page allows the user to generate a prep brief for a selected event.
// It fetches events from the dummy API, displays the details for the chosen
// event and calls another API to return a static prep brief. The layout
// uses colourful accents and cards to clearly separate information.
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Generate() {
  const router = useRouter();
  const { eventId } = router.query;
  const [event, setEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [eventError, setEventError] = useState(null);

  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [draft, setDraft] = useState(null);

  // Fetch the event details whenever eventId changes. We retrieve all events
  // and search for the matching id locally. This avoids having to create an
  // additional endpoint for event lookup. The dummy API returns a small list,
  // so this approach is efficient.
  useEffect(() => {
    if (!eventId) return;
    async function fetchEvent() {
      setLoadingEvent(true);
      setEventError(null);
      try {
        const res = await fetch('/api/events/upcoming');
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch events');
        }
        const events = Array.isArray(data.events) ? data.events : [];
        const found = events.find((ev) => (ev.id || ev.eventId) === eventId);
        setEvent(found || null);
      } catch (err) {
        setEventError(err.message || 'Error fetching event');
      } finally {
        setLoadingEvent(false);
      }
    }
    fetchEvent();
  }, [eventId]);

  async function handleGenerate() {
    if (!eventId) {
      setError('Missing eventId');
      return;
    }
    setLoading(true);
    setError(null);
    setDraft(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, linkedinUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate');
      }
      setDraft(data);
    } catch (err) {
      setError(err.message || 'Error generating');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link href="/meetings" style={styles.backLink}>← Back to meetings</Link>
        <h1 style={styles.title}>Generate Prep</h1>
      </div>
      {/* Show event details */}
      {eventId && (
        <div style={styles.eventCard}>
          {loadingEvent && <p>Loading event…</p>}
          {eventError && <p style={{ color: '#dc2626' }}>{eventError}</p>}
          {event && (
            <>
              <div style={styles.eventTitle}>{event.summary || event.title || '(No title)'}</div>
              <div style={styles.eventTime}>{formatDateRange(event.start?.dateTime || event.start?.date, event.end?.dateTime || event.end?.date)}</div>
              <div style={styles.eventDescription}>{event.description || 'No description provided.'}</div>
            </>
          )}
        </div>
      )}
      <div style={styles.inputGroup}>
        <label htmlFor="linkedin" style={styles.label}>Candidate LinkedIn URL (optional)</label>
        <input
          id="linkedin"
          type="url"
          placeholder="https://www.linkedin.com/in/username/"
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
          style={styles.input}
        />
      </div>
      <button style={styles.primaryButton} onClick={handleGenerate} disabled={!eventId || loading}>
        {loading ? 'Generating…' : 'Generate Prep'}
      </button>
      {error && <div style={{ ...styles.status, color: '#dc2626' }}>{error}</div>}
      {draft && (
        <div style={styles.draftCard}>
          <h2 style={styles.draftTitle}>Prep Brief</h2>
          {draft.subject && (
            <div style={styles.draftSection}>
              <strong>Subject:</strong> <span>{draft.subject}</span>
            </div>
          )}
          {draft.companyInfo && (
            <div style={styles.draftSection}>
              <strong>Company Info:</strong>
              <p style={styles.draftText}>{draft.companyInfo}</p>
            </div>
          )}
          {draft.candidateSummary && (
            <div style={styles.draftSection}>
              <strong>Candidate Summary:</strong>
              <p style={styles.draftText}>{draft.candidateSummary}</p>
            </div>
          )}
          {draft.emailBody && (
            <div style={styles.draftSection}>
              <strong>Email Body:</strong>
              <pre style={styles.draftPre}>{draft.emailBody}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function formatDateRange(startISO, endISO) {
  if (!startISO) return '';
  try {
    const start = new Date(startISO);
    const end = endISO ? new Date(endISO) : null;
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const startStr = start.toLocaleString(undefined, options);
    const endStr = end ? end.toLocaleString(undefined, options) : '';
    return endStr ? `${startStr} – ${endStr}` : startStr;
  } catch {
    return startISO;
  }
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '20px',
    background: 'linear-gradient(135deg, #fdf2f8 0%, #e0e7ff 100%)',
    fontFamily: 'system-ui, sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: '16px',
  },
  backLink: {
    color: '#be185d',
    textDecoration: 'none',
    fontWeight: 'bold',
    marginRight: '8px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: 0,
  },
  eventCard: {
    padding: '16px',
    borderRadius: '12px',
    backgroundColor: '#fff7ed',
    border: '1px solid #fed7aa',
    marginBottom: '20px',
  },
  eventTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '4px',
    color: '#92400e',
  },
  eventTime: {
    fontSize: '12px',
    color: '#b45309',
    marginBottom: '8px',
  },
  eventDescription: {
    fontSize: '14px',
    color: '#78350f',
  },
  inputGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '4px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
  },
  primaryButton: {
    padding: '12px 20px',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(90deg, #9333ea 0%, #6366f1 100%)',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  status: {
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    marginTop: '16px',
  },
  draftCard: {
    padding: '16px',
    borderRadius: '12px',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
  },
  draftTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '12px',
    color: '#064e3b',
  },
  draftSection: {
    marginBottom: '8px',
    fontSize: '14px',
    color: '#065f46',
  },
  draftText: {
    marginTop: '4px',
    marginBottom: '4px',
    lineHeight: 1.4,
  },
  draftPre: {
    whiteSpace: 'pre-wrap',
    backgroundColor: '#ecfdf5',
    padding: '10px',
    borderRadius: '8px',
    fontFamily: 'monospace',
    overflowX: 'auto',
  },
};