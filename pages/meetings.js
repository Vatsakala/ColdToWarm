import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Meetings() {
  const router = useRouter();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        // Your existing route that returns { events: [...] }
        const res = await fetch("/events/upcoming");
        const data = await res.json().catch(() => ({}));

        // If not authenticated, backend returns { authUrl: "/api/auth/google/start" }
        if (res.status === 401 && data?.authUrl) {
          window.location.href = data.authUrl;
          return;
        }

        if (!res.ok) {
          throw new Error(data?.error || `Failed to load events (${res.status})`);
        }

        if (!alive) return;
        setEvents(Array.isArray(data.events) ? data.events : []);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Something went wrong");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.left}>
          <Link href="/" style={styles.backLink}>
            ← Home
          </Link>
          <h1 style={styles.h1}>Upcoming Meetings</h1>
        </div>

        <div style={styles.right}>
          <button
            style={styles.secondaryBtn}
            onClick={() => window.location.reload()}
            disabled={loading}
            title="Reload meetings"
          >
            Refresh
          </button>
        </div>
      </header>

      {loading && <div style={styles.status}>Loading…</div>}

      {!!err && (
        <div style={{ ...styles.status, color: "#b91c1c", background: "#fee2e2", borderColor: "#fecaca" }}>
          {err}
          <div style={{ marginTop: 10 }}>
            <a href="/api/auth/google/start" style={styles.link}>
              Reconnect Google
            </a>
          </div>
        </div>
      )}

      {!loading && !err && events.length === 0 && (
        <div style={styles.status}>No upcoming meetings found.</div>
      )}

      <div style={styles.grid}>
        {events.map((ev) => (
          <MeetingCard
            key={ev.id}
            ev={ev}
            onGenerate={() => router.push(`/generate?eventId=${encodeURIComponent(ev.id)}`)}
          />
        ))}
      </div>
    </div>
  );
}

function MeetingCard({ ev, onGenerate }) {
  const title = ev.summary || ev.title || "(No title)";
  const startRaw = ev.start?.dateTime || ev.start?.date || ev.start || "";
  const endRaw = ev.end?.dateTime || ev.end?.date || ev.end || "";

  const start = formatDate(startRaw);
  const end = formatDate(endRaw);

  const attendees = Array.isArray(ev.attendees) ? ev.attendees : [];

  return (
    <div style={styles.card}>
      <div style={styles.cardTitle}>{title}</div>

      <div style={styles.meta}>
        <div>
          <span style={styles.metaLabel}>When:</span>{" "}
          <span style={styles.metaValue}>
            {start || "—"} {end ? `– ${end}` : ""}
          </span>
        </div>

        {(ev.hangoutLink || ev.meetLink) && (
          <div>
            <span style={styles.metaLabel}>Meet:</span>{" "}
            <a
              style={styles.link}
              href={ev.hangoutLink || ev.meetLink}
              target="_blank"
              rel="noreferrer"
            >
              Open link
            </a>
          </div>
        )}
      </div>

      {!!attendees.length && (
        <div style={{ marginTop: 10 }}>
          <div style={styles.sectionLabel}>Attendees</div>
          <div style={styles.pillsWrap}>
            {attendees.slice(0, 8).map((a, idx) => {
              const email = typeof a === "string" ? a : a.email;
              const name = typeof a === "string" ? "" : a.name || a.displayName;
              return (
                <span key={idx} style={styles.pill} title={email}>
                  {name ? `${name} ` : ""}
                  <span style={{ opacity: 0.85 }}>{email}</span>
                </span>
              );
            })}
            {attendees.length > 8 && (
              <span style={styles.pill}>+{attendees.length - 8} more</span>
            )}
          </div>
        </div>
      )}

      <div style={styles.cardActions}>
        <button style={styles.primaryBtn} onClick={onGenerate}>
          Generate Prep
        </button>

        {ev.htmlLink && (
          <a style={styles.secondaryBtnLink} href={ev.htmlLink} target="_blank" rel="noreferrer">
            Open in Google Calendar
          </a>
        )}
      </div>
    </div>
  );
}

function formatDate(v) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: 24,
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
    background: "#0b1220",
    color: "#eaf0ff",
  },
  header: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
  },
  left: { display: "flex", flexDirection: "column", gap: 8 },
  right: { display: "flex", alignItems: "center", gap: 10 },
  backLink: {
    color: "#c7d2fe",
    textDecoration: "none",
    fontWeight: 700,
    width: "fit-content",
  },
  h1: { margin: 0, fontSize: 28, letterSpacing: -0.4 },
  status: {
    marginTop: 12,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 12,
    marginTop: 10,
  },
  card: {
    borderRadius: 16,
    padding: 14,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 18px 50px rgba(0,0,0,0.28)",
  },
  cardTitle: { fontWeight: 800, fontSize: 16, lineHeight: 1.3 },
  meta: { marginTop: 8, display: "grid", gap: 6, opacity: 0.95 },
  metaLabel: { fontWeight: 700, opacity: 0.85 },
  metaValue: { opacity: 0.95 },
  sectionLabel: { fontWeight: 800, fontSize: 12, opacity: 0.85, marginBottom: 6 },
  pillsWrap: { display: "flex", flexWrap: "wrap", gap: 6 },
  pill: {
    fontSize: 12,
    padding: "6px 8px",
    borderRadius: 999,
    background: "rgba(0,0,0,0.25)",
    border: "1px solid rgba(255,255,255,0.12)",
  },
  cardActions: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 },
  primaryBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "none",
    background: "#3b82f6",
    color: "white",
    cursor: "pointer",
    fontWeight: 800,
  },
  secondaryBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.08)",
    color: "#eaf0ff",
    cursor: "pointer",
    fontWeight: 800,
  },
  secondaryBtnLink: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.08)",
    color: "#eaf0ff",
    cursor: "pointer",
    fontWeight: 800,
    textDecoration: "none",
    display: "inline-block",
  },
  link: {
    color: "#93c5fd",
    textDecoration: "underline",
    fontWeight: 700,
  },
};