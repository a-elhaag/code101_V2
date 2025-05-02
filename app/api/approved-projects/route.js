export async function GET() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects?code=${process.env.NEXT_PUBLIC_API_KEY}`);
        const data = await res.json();
        const approvedProjects = data.filter(p => p.approval === "approved");

        return Response.json({ projects: approvedProjects });
    } catch (err) {
        console.error("API fetch error:", err);
        return new Response(JSON.stringify({ error: "Failed to load projects" }), { status: 500 });
    }
}