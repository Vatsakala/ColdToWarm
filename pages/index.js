// pages/index.js
// The landing page welcomes the user and provides navigation to the
// meetings and generate pages. Styling is kept inlined for simplicity.
import Link from 'next/link';

export default function Home() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Interview Prep Assistant</h1>
      <p style={styles.subtitle}>
        Prepare for your upcoming interviews with ease. Browse your meetings,
        generate a personalised prep brief and get ready to shine.
      </p>
      <div style={styles.buttonRow}>
        <Link href="/meetings" style={styles.primaryButton}>
          View Meetings
        </Link>
        <Link href="/generate" style={styles.secondaryButton}>
          Generate Manually
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 20px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 50%, #d1d5db 100%)',
    fontFamily: 'system-ui, sans-serif',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: '18px',
    maxWidth: '500px',
    color: '#4b5563',
    marginBottom: '32px',
    lineHeight: 1.5,
  },
  buttonRow: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  primaryButton: {
    padding: '14px 28px',
    borderRadius: '8px',
    background: 'linear-gradient(90deg, #6366f1 0%, #7c3aed 100%)',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
    transition: 'transform 0.2s ease',
  },
  secondaryButton: {
    padding: '14px 28px',
    borderRadius: '8px',
    background: 'linear-gradient(90deg, #d1d5db 0%, #a5b4fc 100%)',
    color: '#1e293b',
    textDecoration: 'none',
    fontWeight: 'bold',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
    transition: 'transform 0.2s ease',
  },
};