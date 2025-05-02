import Link from "next/link";

export default function HomePage() {
  return (
    <main className="content-section">
      <h1 className="page-heading">Welcome to Code101</h1>
      <p style={{ textAlign: "center", fontSize: "1.2rem", color: "var(--text-gray)" }}>
        A space for developers to showcase, share, and explore open-source projects.
      </p>

      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "2rem",
        marginTop: "3rem",
        flexWrap: "wrap"
      }}>
        <Link href="/projects">
          <button style={{
            backgroundColor: "var(--color-blue)",
            color: "white",
            border: "none",
            padding: "1rem 2rem",
            fontSize: "1rem",
            boxShadow: "var(--shadow-md)"
          }}>
            Explore Projects
          </button>
        </Link>

        <Link href="/dashboard">
          <button style={{
            backgroundColor: "transparent",
            color: "var(--color-blue-light)",
            border: "2px solid var(--color-blue-light)",
            padding: "1rem 2rem",
            fontSize: "1rem",
            boxShadow: "var(--shadow-sm)"
          }}>
            Submit Yours
          </button>
        </Link>
      </div>
    </main>
  );
}