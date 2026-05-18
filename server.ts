import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // AI EOD Generation Endpoint
  app.post("/api/generate-eod", async (req, res) => {
    try {
      const { tasks, projects, users, date } = req.body;

      const prompt = `
        You are an elite project management AI. Generate a concise, professional End of Day (EOD) report for the Admin of TaskOrbit.
        
        Current Date: ${date}
        
        Team Intelligence Data:
        - Tasks: ${JSON.stringify(tasks)}
        - Projects: ${JSON.stringify(projects)}
        - Team Members: ${JSON.stringify(users.map((u: any) => ({ name: u.name, status: u.status, workload: u.workload })))}

        The report should include:
        1. **Daily Operational Summary**: High-level overview of progress.
        2. **Milestone Achievements**: Specific tasks completed or significant progress made.
        3. **Critical Path & Blockers**: High priority items and potential issues.
        4. **Resource Dynamics**: Quick note on team workload.
        5. **Next Horizons**: Objectives for tomorrow.

        Keep the tone futuristic, professional, and data-driven. Use Markdown formatting.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      res.json({ report: response.text });
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      res.status(500).json({ error: "Failed to generate report" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
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
