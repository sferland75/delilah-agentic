import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AssessmentForm } from '@/types/form';

interface AccessibilityStats {
  total: number;
  accessible: number;
  partiallyAccessible: number;
  needsModification: number;
}

const calculateStats = (data: AssessmentForm[]): AccessibilityStats => {
  const stats: AccessibilityStats = {
    total: data.length,
    accessible: 0,
    partiallyAccessible: 0,
    needsModification: 0
  };

  data.forEach(assessment => {
    const rooms = assessment.environmentalAssessment?.rooms || [];
    let accessibleCount = 0;
    let partialCount = 0;
    let needsModCount = 0;

    rooms.forEach(room => {
      switch (room.accessibility.toLowerCase()) {
        case 'no_barriers':
          accessibleCount++;
          break;
        case 'minor_barriers':
          partialCount++;
          break;
        case 'major_barriers':
        case 'not_accessible':
          needsModCount++;
          break;
      }
    });

    // Determine overall accessibility based on room counts
    if (accessibleCount > needsModCount && accessibleCount > partialCount) {
      stats.accessible++;
    } else if (partialCount > needsModCount) {
      stats.partiallyAccessible++;
    } else {
      stats.needsModification++;
    }
  });

  return stats;
};

export function AccessibilityDashboard() {
  const [stats, setStats] = useState<AccessibilityStats>({
    total: 0,
    accessible: 0,
    partiallyAccessible: 0,
    needsModification: 0
  });

  useEffect(() => {
    // TODO: Implement data fetching
    const mockData: AssessmentForm[] = [];
    setStats(calculateStats(mockData));
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            Total number of assessments
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fully Accessible</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.accessible}</div>
          <p className="text-xs text-muted-foreground">
            Properties with no significant barriers
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Partially Accessible</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{stats.partiallyAccessible}</div>
          <p className="text-xs text-muted-foreground">
            Properties with minor modifications needed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Needs Modification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.needsModification}</div>
          <p className="text-xs text-muted-foreground">
            Properties requiring significant modifications
          </p>
        </CardContent>
      </Card>
    </div>
  );
}