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
  Sankey,
  Scatter,
  ScatterChart
} from 'recharts';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Network, Link, ArrowRightLeft, Share2 } from 'lucide-react';

interface CrossPatternData {
  pattern_id: string;
  source_agent: string;
  target_agent: string;
  correlation_strength: number;
  pattern_signature: string;
  discovered_at: string;
  metadata: {
    source_metadata: Record<string, any>;
    target_metadata: Record<string, any>;
    correlation_factors: Record<string, any>;
  };
}

interface CrossAgentMetrics {
  total_patterns: number;
  avg_correlation: number;
  strongest_correlations: CrossPatternData[];
  pattern_evolution: Array<{
    timestamp: string;
    pattern_count: number;
    avg_strength: number;
  }>;
  agent_relationships: Array<{
    source: string;
    target: string;
    value: number;
    patterns: number;
  }>;
}

interface Props {
  timeRange: string;
  selectedAgent?: string;
}

const CrossAgentPatternsDisplay: React.FC<Props> = ({ timeRange, selectedAgent }) => {
  const [crossPatternData, setCrossPatternData] = useState<CrossAgentMetrics | null>(null);
  const [view, setView] = useState<'relationships' | 'evolution' | 'correlations'>('relationships');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCrossPatternData();
  }, [timeRange, selectedAgent]);

  const fetchCrossPatternData = async () => {
    try {
      const response = await fetch(
        `/api/monitoring/learning/cross-patterns?timeRange=${timeRange}${selectedAgent ? `&agent=${selectedAgent}` : ''}`
      );
      const data = await response.json();
      setCrossPatternData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cross-pattern data:', error);
      setLoading(false);
    }
  };

  const renderRelationshipGraph = () => {
    if (!crossPatternData?.agent_relationships) return null;

    return (
      <ResponsiveContainer width="100%" height={400}>
        <Sankey
          data={{
            nodes: crossPatternData.agent_relationships.flatMap(rel => [
              { name: rel.source },
              { name: rel.target }
            ]),
            links: crossPatternData.agent_relationships.map(rel => ({
              source: rel.source,
              target: rel.target,
              value: rel.value
            }))
          }}
          nodePadding={50}
          link={{ stroke: '#999' }}
          node={{
            fill: '#8884d8',
            opacity: 0.8
          }}
        />
      </ResponsiveContainer>
    );
  };

  const renderEvolutionGraph = () => {
    if (!crossPatternData?.pattern_evolution) return null;

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={crossPatternData.pattern_evolution}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="pattern_count"
            stroke="#8884d8"
            name="Pattern Count"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avg_strength"
            stroke="#82ca9d"
            name="Avg Strength"
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderCorrelationScatter = () => {
    if (!crossPatternData?.strongest_correlations) return null;

    return (
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid />
          <XAxis
            type="category"
            dataKey="source_agent"
            name="Source Agent"
          />
          <YAxis dataKey="correlation_strength" name="Correlation" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter
            data={crossPatternData.strongest_correlations}
            fill="#8884d8"
          />
        </ScatterChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="grid gap-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-bold">Cross-Agent Learning Patterns</div>
        <div className="flex gap-2">
          <Button
            variant={view === 'relationships' ? 'default' : 'outline'}
            onClick={() => setView('relationships')}
          >
            <Network className="h-4 w-4 mr-2" />
            Relationships
          </Button>
          <Button
            variant={view === 'evolution' ? 'default' : 'outline'}
            onClick={() => setView('evolution')}
          >
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Evolution
          </Button>
          <Button
            variant={view === 'correlations' ? 'default' : 'outline'}
            onClick={() => setView('correlations')}
          >
            <Link className="h-4 w-4 mr-2" />
            Correlations
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardContent className="pt-6">
            {view === 'relationships' && renderRelationshipGraph()}
            {view === 'evolution' && renderEvolutionGraph()}
            {view === 'correlations' && renderCorrelationScatter()}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Pattern Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {crossPatternData?.total_patterns || 0}
                  </div>
                  <div className="text-sm text-gray-500">Total Cross-Patterns</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {((crossPatternData?.avg_correlation || 0) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-500">Average Correlation</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Strongest Correlations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {crossPatternData?.strongest_correlations
                  ?.slice(0, 3)
                  .map(pattern => (
                    <div
                      key={pattern.pattern_id}
                      className="flex justify-between items-center"
                    >
                      <div className="text-sm">
                        {pattern.source_agent} → {pattern.target_agent}
                      </div>
                      <div className="text-sm font-bold">
                        {(pattern.correlation_strength * 100).toFixed(1)}%
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CrossAgentPatternsDisplay;