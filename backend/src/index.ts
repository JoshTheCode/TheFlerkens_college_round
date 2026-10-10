import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import { apiRouter } from "./routes/api.ts";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "healthy",
    service: "AgentBreak-Backend",
    environment: process.env.NODE_ENV || "development",
  });
});

// API Routes
app.use("/api/v1", apiRouter);

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[ServerError]:", err.message);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

// 404 Fallback
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server only if executed directly as entrypoint
if (process.argv[1]?.includes("index.ts") && !process.argv[1]?.includes("test")) {
  app.listen(PORT, () => {
    console.log(`[AgentBreak Backend] Listening on port ${PORT}`);
  });
}

export { app };
