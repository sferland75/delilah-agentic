const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { MonitoringService } = require('./monitoring/service');
const { AdaptiveOptimizer } = require('./core/agent/adaptive');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Initialize services
const monitoringService = new MonitoringService();
const optimizer = new AdaptiveOptimizer([]);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
