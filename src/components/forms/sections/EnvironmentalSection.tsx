import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyOverview } from '@/components/EnvironmentalSection/property-overview';
import { RoomInventory } from '@/components/EnvironmentalSection/RoomInventory';
import { OutdoorAreas } from '@/components/EnvironmentalSection/OutdoorAreas';
import { AdditionalNotes } from '@/components/EnvironmentalSection/AdditionalNotes';
import { 
  FaHome,
  FaDoorOpen,
  FaTree,
  FaStickyNote
} from 'react-icons/fa';

export function EnvironmentalSection() {
  const { control } = useFormContext();

  return (
    <div className="p-6">
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
    </div>
  );
}