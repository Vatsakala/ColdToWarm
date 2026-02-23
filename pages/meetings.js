// pages/meetings.js
// This page lists upcoming meetings from the dummy API. Users can
// search by title or attendee, and click to generate a prep brief.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Meetings() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/events/upcoming');
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to load events');
        }
        setEvents(Array.isArray(data.events) ? data.events : []);
      } catch (err) {
        setError(err.message || 'Error fetching events');
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // Filter events based on search query.
  const filtered = events.filter((ev) => {
    const title = (ev.summary || ev.title || '').toLowerCase();
    const attendees = Array.isArray(ev.attendees) ? ev.attendees : [];
    const attendeeText = attendees
      .map((a) => (typeof a === 'string' ? a : a.email || a.name || ''))
      .join(' ')
      .toLowerCase();
    const haystack = `${title} ${attendeeText}`;
    return haystack.includes(query.toLowerCase());
  });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link href="/" style={styles.backLink}>← Home</Link>
        <h1 style={styles.title}>Upcoming Meetings</h1>
      </div>
      <input
        type="text"
        placeholder="Search by title or attendee…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={styles.searchInput}
      />
      {loading && <div style={styles.status}>Loading…</div>}
      {error && <div style={{ ...styles.status, color: '#dc2626' }}>{error}</div>}
      {!loading && !error && filtered.length === 0 && (
        <div style={styles.status}>No meetings match your search.</div>
      )}
      <div style={styles.grid}>
        {filtered.map((ev) => {
          const id = ev.id || ev.eventId;
          const title = ev.summary || ev.title || '(No title)';
          const start = ev.start?.dateTime || ev.start?.date || '';
          const end = ev.end?.dateTime || ev.end?.date || '';
          const attendees = Array.isArray(ev.attendees) ? ev.attendees : [];
          return (
            <div key={id} style={styles.card} onClick={() => router.push(`/generate?eventId=${encodeURIComponent(id)}`)}>
              <div style={styles.cardHeader}>
                <div style={styles.cardTitle}>{title}</div>
                <div style={styles.cardTime}>{formatDateRange(start, end)}</div>
              </div>
              <div style={styles.cardBody}>
                <div style={styles.cardDescription}>{ev.description || 'No description provided.'}</div>
                {attendees.length > 0 && (
                  <div style={styles.attendeesWrap}>
                    {attendees.slice(0, 3).map((a, idx) => {
                      const email = typeof a === 'string' ? a : a.email;
                      const name = typeof a === 'string' ? '' : a.name;
                      return (
                        <span key={idx} style={styles.attendeePill} title={email}>
                          {name || email}
                        </span>
                      );
                    })}
                    {attendees.length > 3 && (
                      <span style={styles.attendeePill}>+{attendees.length - 3} more</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Format the date/time range for display. This helper handles missing values
// gracefully. We use the browser’s locale for formatting.
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
    background: 'linear-gradient(135deg, #faf5ff 0%, #e5e7eb 100%)',
    fontFamily: 'system-ui, sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  backLink: {
    color: '#7c3aed',
    textDecoration: 'none',
    marginRight: '8px',
    fontWeight: 'bold',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: 0,
  },
  searchInput: {
    width: '100%',
    maxWidth: '400px',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #c7d2fe',
    marginBottom: '16px',
    fontSize: '14px',
  },
  status: {
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#fef3c7',
    marginBottom: '12px',
    textAlign: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.1s ease, box-shadow 0.1s ease',
  },
  cardHeader: {
    padding: '14px',
    borderBottom: '1px solid #f3f4f6',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#3730a3',
    marginBottom: '4px',
  },
  cardTime: {
    fontSize: '12px',
    color: '#6b7280',
  },
  cardBody: {
    padding: '14px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardDescription: {
    fontSize: '14px',
    color: '#475569',
    marginBottom: '8px',
  },
  attendeesWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  attendeePill: {
    backgroundColor: '#ede9fe',
    color: '#5b21b6',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    whiteSpace: 'nowrap',
  },
};