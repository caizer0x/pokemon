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

// Serve static files if needed (e.g., production build of frontend)
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

// Setup the WebSocket server on top of our HTTP server
setupWebSocket(server);

// Example basic route or health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});