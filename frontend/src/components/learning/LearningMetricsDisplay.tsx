import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AlertCircle, TrendingUp, Brain, Clock } from 'lucide-react';

interface MetricData {
  timestamp: string;
  value: number;
  agent_id: string;
  metric_type: string;
}

interface PatternData {
  pattern_id: string;
  agent_id: string;
  confidence: number;
  usage_count: number;
  success_rate: number;
  timestamp: string;
  metadata: Record<string, any>;
}

interface AgentPerformance {
  agent_id: string;
  metrics: MetricData[];
  patterns: PatternData[];
}

const LearningMetricsDisplay: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('24h');
  const [performanceData, setPerformanceData] = useState<AgentPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformanceData();
  }, [selectedAgent, timeRange]);

  const fetchPerformanceData = async () => {
    try {
      const response = await fetch(
        `/api/monitoring/learning/metrics?agent=${selectedAgent}&timeRange=${timeRange}`
      );
      const data = await response.json();
      setPerformanceData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching performance data:', error);
      setLoading(false);
    }
  };

  const aggregateMetrics = (data: AgentPerformance[]) => {
    return data.reduce((acc, agent) => {
      agent.metrics.forEach(metric => {
        const hour = new Date(metric.timestamp).getHours();
        if (!acc[hour]) {
          acc[hour] = { hour, value: 0, count: 0 };
        }
        acc[hour].value += metric.value;
        acc[hour].count += 1;
      });
      return acc;
    }, {} as Record<number, { hour: number; value: number; count: number }>);
  };

  const aggregatePatterns = (data: AgentPerformance[]) => {
    return data.reduce((acc, agent) => {
      agent.patterns.forEach(pattern => {
        if (!acc[pattern.pattern_id]) {
          acc[pattern.pattern_id] = {
            pattern_id: pattern.pattern_id,
            confidence: pattern.confidence,
            usage_count: 0,
            success_rate: 0,
            total: 0
          };
        }
        acc[pattern.pattern_id].usage_count += pattern.usage_count;
        acc[pattern.pattern_id].success_rate += pattern.success_rate;
        acc[pattern.pattern_id].total += 1;
      });
      return acc;
    }, {} as Record<string, any>);
  };

  return (
    <div className="grid gap-4">
      <div className="flex justify-between items-center mb-4">
        <Select
          value={selectedAgent}
          onValueChange={setSelectedAgent}
          className="w-48"
        >
          <option value="all">All Agents</option>
          {performanceData.map(agent => (
            <option key={agent.agent_id} value={agent.agent_id}>
              {agent.agent_id}
            </option>
          ))}
        </Select>

        <div className="flex gap-2">
          <Button
            variant={timeRange === '24h' ? 'default' : 'outline'}
            onClick={() => setTimeRange('24h')}
          >
            24h
          </Button>
          <Button
            variant={timeRange === '7d' ? 'default' : 'outline'}
            onClick={() => setTimeRange('7d')}
          >
            7d
          </Button>
          <Button
            variant={timeRange === '30d' ? 'default' : 'outline'}
            onClick={() => setTimeRange('30d')}
          >
            30d
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={Object.values(aggregateMetrics(performanceData))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    name="Performance Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Learning Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.values(aggregatePatterns(performanceData))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="pattern_id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="confidence"
                    fill="#8884d8"
                    name="Pattern Confidence"
                  />
                  <Bar
                    dataKey="success_rate"
                    fill="#82ca9d"
                    name="Success Rate"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Optimization Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={performanceData.flatMap(agent =>
                    agent.metrics
                      .filter(m => m.metric_type === 'optimization_impact')
                      .map(m => ({
                        timestamp: m.timestamp,
                        impact: m.value,
                        agent: agent.agent_id
                      }))
                  )}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="impact"
                    stroke="#82ca9d"
                    name="Optimization Impact"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {performanceData.reduce(
                    (acc, agent) => acc + agent.patterns.length,
                    0
                  )}
                </div>
                <div className="text-sm text-gray-500">Active Patterns</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {(performanceData.reduce(
                    (acc, agent) =>
                      acc +
                      agent.patterns.reduce(
                        (sum, p) => sum + p.success_rate,
                        0
                      ),
                    0
                  ) /
                    Math.max(
                      1,
                      performanceData.reduce(
                        (acc, agent) => acc + agent.patterns.length,
                        0
                      )
                    )).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">Average Success Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LearningMetricsDisplay;