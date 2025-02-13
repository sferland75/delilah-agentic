import React from 'react';
<<<<<<< HEAD
import { useFormContext } from 'react-hook-form';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyOverview } from './property-overview';
import { RoomInventory } from './RoomInventory';
import { OutdoorAreas } from './OutdoorAreas';
import { AdditionalNotes } from './AdditionalNotes';
import { 
  FaHome,
  FaDoorOpen,
  FaTree,
  FaStickyNote
} from 'react-icons/fa';

export function EnvironmentalSection() {
  const { control } = useFormContext();

  return (
    <Card className="p-6">
      <Tabs defaultValue="property" className="w-full">
        <div className="bg-slate-100/80 p-1 rounded-md mb-6">
          <TabsList className="grid w-full grid-cols-4 gap-1">
            <TabsTrigger 
              value="property"
              className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-600 hover:bg-slate-200"
            >
              <div className="flex items-center gap-2">
                <FaHome className="h-4 w-4" />
                <span>Property</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="rooms"
              className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-600 hover:bg-slate-200"
            >
              <div className="flex items-center gap-2">
                <FaDoorOpen className="h-4 w-4" />
                <span>Rooms</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="outdoor"
              className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-600 hover:bg-slate-200"
            >
              <div className="flex items-center gap-2">
                <FaTree className="h-4 w-4" />
                <span>Outdoor</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="notes"
              className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-600 hover:bg-slate-200"
            >
              <div className="flex items-center gap-2">
                <FaStickyNote className="h-4 w-4" />
                <span>Notes</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="property">
          <div className="space-y-4">
            <PropertyOverview />
          </div>
        </TabsContent>

        <TabsContent value="rooms">
          <div className="space-y-4">
            <RoomInventory />
          </div>
        </TabsContent>

        <TabsContent value="outdoor">
          <div className="space-y-4">
            <OutdoorAreas />
          </div>
        </TabsContent>

        <TabsContent value="notes">
          <div className="space-y-4">
            <AdditionalNotes />
          </div>
        </TabsContent>
      </Tabs>
    </Card>
=======
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
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
  );
}