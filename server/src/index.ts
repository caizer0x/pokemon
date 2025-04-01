import express from "express";
import cors from "cors";
import path from "path";
import http from "http";
import { setupWebSocket } from "./wsServer";

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Optional: Provide a quick health endpoint to test server:
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Serve static files if needed (production build):
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

// Initialize WebSocket
setupWebSocket(server);

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log("Server (HTTP + WebSocket) listening on port " + PORT);
});