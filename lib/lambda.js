export async function callLambda(path, { method = "GET", body } = {}) {
  const base = process.env.LAMBDA_URL;
  if (!base) throw new Error("Missing LAMBDA_URL in .env.local");

  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || data?.message || `Lambda error (${res.status})`);
  }

  return data;
}