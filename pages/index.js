import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: 32, fontFamily: "system-ui" }}>
      <h1>AI Interview Prep</h1>
      <p>Pick an upcoming meeting → generate brief → preview.</p>

      <div style={{ marginTop: 16 }}>
        <Link href="/meetings">
          <button style={btn}>View Upcoming Meetings</button>
        </Link>
      </div>
    </div>
  );
}

const btn = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #ccc",
  cursor: "pointer",
};