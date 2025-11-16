"use client";

import { useState } from "react";

export default function HomePage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bullets, setBullets] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBullets([]);

    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    const form = new FormData();
    form.append("file", file);

    setLoading(true);
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to process PDF.");
      }
      const data = await res.json();
      setBullets(data.bullets || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{
      maxWidth: 960,
      margin: "0 auto",
      padding: "32px 16px",
    }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>PDF ? Point-wise Notes</h1>
      <p style={{ color: "#555", marginBottom: 24 }}>
        Upload a PDF to generate concise study notes as bullet points.
      </p>

      <form onSubmit={handleSubmit} style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: 16,
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        background: "#fafafa",
      }}>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          style={{ padding: 10, border: "1px solid #e5e7eb", borderRadius: 6, background: "white" }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 14px",
            borderRadius: 6,
            background: loading ? "#9ca3af" : "#111827",
            color: "white",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Processing..." : "Generate Notes"}
        </button>
      </form>

      {error && (
        <div style={{ color: "#b91c1c", marginTop: 16 }}>{error}</div>
      )}

      {bullets.length > 0 && (
        <section style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Notes</h2>
          <ul style={{
            listStyle: "disc",
            paddingLeft: 24,
            lineHeight: 1.6,
          }}>
            {bullets.map((b, i) => (
              <li key={i} style={{ marginBottom: 6 }}>{b}</li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
