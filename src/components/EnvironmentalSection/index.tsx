import React from 'react';
import { Control } from 'react-hook-form';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Home, Building2, Activity, AlertCircle, TreePine } from 'lucide-react';
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
    icon: TreePine,
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
] as const;

export function EnvironmentalSectionConsolidated({ control }: EnvironmentalSectionProps) {
  return (
    <Card className="p-6 bg-slate-50">
      <h2 className="text-2xl font-semibold mb-2 text-slate-800">Environmental Assessment</h2>
      <p className="text-sm text-slate-600 mb-6">Comprehensive evaluation of home environment and accessibility</p>

      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <AlertDescription className="text-slate-700">
          Document environmental assessment details including:
          - Property type and layout
          - External access and features
          - Outdoor spaces and maintenance
          - Accessibility considerations
          - Safety hazards and recommendations
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="dwelling" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          {ENVIRONMENTAL_CATEGORIES.map((category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="bg-white/50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50"
            >
              <div className="flex flex-col items-center gap-1">
                <category.icon className="h-4 w-4" />
                <span className="text-sm">{category.category}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="dwelling">
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <PropertyOverview control={control} />
          </div>
        </TabsContent>

        <TabsContent value="exterior">
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <ExteriorFeatures control={control} />
          </div>
        </TabsContent>

        <TabsContent value="outdoor">
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <OutdoorSpaces control={control} />
          </div>
        </TabsContent>

        <TabsContent value="access">
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <AccessibilityAssessment control={control} />
          </div>
        </TabsContent>

        <TabsContent value="safety">
          <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
            <SafetyAssessment control={control} />
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}