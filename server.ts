import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // AI EOD Generation Endpoint (Placeholder Implementation)
  app.post("/api/generate-eod", async (req, res) => {
    try {
      const { tasks, projects, users, date } = req.body;

      const completedCount = tasks?.filter((t: any) => t.status === 'Completed').length || 0;
      const totalCount = tasks?.length || 0;
      const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      const report = `
# TaskOrbit Daily Operational Report - ${date}

## Daily Operational Summary
The team has achieved **${progressPercent}%** throughput today, with ${completedCount} out of ${totalCount} key objectives moved to completion.

## Milestone Achievements
- Successfully coordinated ${projects?.length || 0} active project streams.
- ${completedCount} complex task units synthesized and archived.

## Critical Path & Blockers
- No major system-wide blockers identified in current orbit.
- High priority vectors are maintaining expected velocity.

## Resource Dynamics
- Active Team Members: ${users?.filter((u: any) => u.status === 'Online').length || 0} online.
- Workload alignment remains within optimal operational parameters.

## Next Horizons
- Transitioning focus to high-priority stream alignment for tomorrow.
- Deep dive into upcoming project milestones scheduled.

*Note: This report is a generated placeholder summary.*
      `;

      res.json({ report });
    } catch (error: any) {
      console.error("Report Generation Error:", error);
      res.status(500).json({ error: "Failed to generate report" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : true
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
