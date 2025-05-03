export async function GET() {
    try {
        // Fetch all projects first
        const projectsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects?code=${process.env.NEXT_PUBLIC_API_KEY}`);
        const projects = await projectsRes.json();

        // Fetch all approvals
        const approvalsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/approvals?code=${process.env.NEXT_PUBLIC_API_KEY}`);
        const approvals = await approvalsRes.json();

        // Filter projects that have at least one approval with 'approved' status
        const approvedProjects = projects.filter(project => {
            const projectApprovals = approvals.filter(a => a.project_id === project.project_id);
            return projectApprovals.some(a => a.status === 'approved');
        });

        return Response.json({ projects: approvedProjects });
    } catch (err) {
        console.error("API fetch error:", err);
        return new Response(JSON.stringify({ error: "Failed to load projects" }), { status: 500 });
    }
}