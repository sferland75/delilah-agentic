import React from 'react';
import { Control } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Building2, Activity, AlertCircle } from 'lucide-react';
import { type Assessment } from '../../types';
import { PropertyOverview } from './property-overview';
import { ExteriorFeatures } from './exterior-features';
import { OutdoorSpaces } from './outdoor-spaces';
import { AccessibilityAssessment } from './accessibility-assessment';
import { SafetyAssessment } from './safety-assessment';

interface EnvironmentalSectionProps {
  control: Control<Assessment>;
}

const ENVIRONMENTAL_CATEGORIES = [
  {
    id: 'dwelling',
    category: 'Property Overview',
    icon: Home,
    description: 'Document dwelling type and room configuration',
  },
  {
    id: 'exterior',
    category: 'Exterior Features',
    icon: Building2,
    description: 'Property access and outdoor environment',
  },
  {
    id: 'outdoor',
    category: 'Outdoor Spaces',
    icon: Home,
    description: 'Document outdoor areas and maintenance',
  },
  {
    id: 'access',
    category: 'Accessibility',
    icon: Activity,
    description: 'Accessibility features and barriers',
  },
  {
    id: 'safety',
    category: 'Safety Assessment',
    icon: AlertCircle,
    description: 'Safety features, hazards, and recommendations',
  }
];

export function EnvironmentalSectionConsolidated({ control }: EnvironmentalSectionProps) {
  console.log('Rendering Environmental Section Component'); // Debug log
  
  return (
    <div className="w-full space-y-4">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            <CardTitle>Environmental Assessment</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="dwelling" className="space-y-4">
            <TabsList className="grid grid-cols-2 lg:grid-cols-5 w-full">
              {ENVIRONMENTAL_CATEGORIES.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-sm">
                  {category.category}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="dwelling">
              <PropertyOverview control={control} />
            </TabsContent>

            <TabsContent value="exterior">
              <ExteriorFeatures control={control} />
            </TabsContent>

            <TabsContent value="outdoor">
              <OutdoorSpaces control={control} />
            </TabsContent>

            <TabsContent value="access">
              <AccessibilityAssessment control={control} />
            </TabsContent>

            <TabsContent value="safety">
              <SafetyAssessment control={control} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}