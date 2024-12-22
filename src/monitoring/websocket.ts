import WebSocket from 'ws';
import { EventEmitter } from 'events';
import { MonitoringService } from './service';
import { NotificationService } from './notifications';

interface WebSocketMessage {
  type: 'metric' | 'alert' | 'health' | 'notification';
  payload: any;
  timestamp: number;
}

export class MonitoringWebSocket {
  private wss: WebSocket.Server;
  private clients: Set<WebSocket>;
  private monitoringService: MonitoringService;
  private notificationService: NotificationService;
  private eventEmitter: EventEmitter;

  constructor(
    server: any,
    monitoringService: MonitoringService,
    notificationService: NotificationService
  ) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Set();
    this.monitoringService = monitoringService;
    this.notificationService = notificationService;
    this.eventEmitter = new EventEmitter();

    this.setupWebSocketServer();
    this.setupMonitoringListeners();
  }

  private setupWebSocketServer(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      this.handleNewConnection(ws);
    });
  }

  private handleNewConnection(ws: WebSocket): void {
    this.clients.add(ws);

    // Send initial state
    this.sendInitialState(ws);

    ws.on('message', (message: string) => {
      this.handleIncomingMessage(ws, message);
    });

    ws.on('close', () => {
      this.clients.delete(ws);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      this.clients.delete(ws);
    });
  }

  private async sendInitialState(ws: WebSocket): Promise<void> {
    try {
      // Send recent metrics
      const recentMetrics = this.monitoringService.getRecentMetrics('all');
      this.sendMessage(ws, {
        type: 'metric',
        payload: recentMetrics,
        timestamp: Date.now()
      });

      // Send current alerts
      const currentAlerts = this.monitoringService.getRecentAlerts();
      this.sendMessage(ws, {
        type: 'alert',
        payload: currentAlerts,
        timestamp: Date.now()
      });

      // Send health status
      const healthChecks = this.monitoringService.getHealthChecks();
      this.sendMessage(ws, {
        type: 'health',
        payload: Array.from(healthChecks.values()),
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error sending initial state:', error);
    }
  }

  private setupMonitoringListeners(): void {
    // Listen for new metrics
    this.monitoringService.subscribe('newMetric', (metric) => {
      this.broadcast({
        type: 'metric',
        payload: metric,
        timestamp: Date.now()
      });
    });

    // Listen for new alerts
    this.monitoringService.subscribe('newAlert', (alert) => {
      this.broadcast({
        type: 'alert',
        payload: alert,
        timestamp: Date.now()
      });
    });

    // Listen for health updates
    this.monitoringService.subscribe('healthCheckUpdate', (health) => {
      this.broadcast({
        type: 'health',
        payload: health,
        timestamp: Date.now()
      });
    });
  }

  private handleIncomingMessage(ws: WebSocket, message: string): void {
    try {
      const data = JSON.parse(message);

      // Handle different message types
      switch (data.type) {
        case 'subscribe':
          this.handleSubscription(ws, data.payload);
          break;
        case 'acknowledge':
          this.handleAcknowledgement(data.payload);
          break;
        default:
          console.warn('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  private handleSubscription(ws: WebSocket, payload: any): void {
    // Handle metric subscriptions
    if (payload.metrics) {
      // Subscribe to specific metrics
    }
  }

  private handleAcknowledgement(payload: any): void {
    // Handle alert acknowledgements
    if (payload.alertId) {
      // Update alert status
    }
  }

  private sendMessage(ws: WebSocket, message: WebSocketMessage): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  private broadcast(message: WebSocketMessage): void {
    this.clients.forEach(client => {
      this.sendMessage(client, message);
    });
  }

  // Method to close the WebSocket server
  public close(): void {
    this.wss.close();
  }

  // Method to get current connection stats
  public getStats(): object {
    return {
      totalConnections: this.clients.size,
      isListening: this.wss.listening
    };
  }
}
