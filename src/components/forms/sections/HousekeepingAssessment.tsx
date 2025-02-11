import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReplacementServicesSummary } from './housekeeping/ReplacementServicesSummary';
import { RegularTasks } from './housekeeping/RegularTasks';
import { IndoorTasks } from './housekeeping/IndoorTasks';
import { OutdoorTasks } from './housekeeping/OutdoorTasks';
import {
    FaBroom,
    FaHome,
    FaLeaf,
    FaChartBar,
} from 'react-icons/fa';

export function HousekeepingAssessment() {
  const { register, watch, setValue } = useFormContext();
  
  return (
    <div className="p-6">
      <Tabs defaultValue="regular" className="w-full">
        <div className="bg-slate-100/80 p-1 rounded-md mb-6">
          <TabsList className="grid w-full grid-cols-4 gap-1">
            <TabsTrigger 
              value="regular"
              className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-600 hover:bg-slate-200"
            >
              <div className="flex items-center gap-2">
                <FaBroom className="h-4 w-4" />
                <span>Regular Tasks</span>
              </div>
            </TabsTrigger>

            <TabsTrigger 
              value="indoor"
              className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-600 hover:bg-slate-200"
            >
              <div className="flex items-center gap-2">
                <FaHome className="h-4 w-4" />
                <span>Indoor</span>
              </div>
            </TabsTrigger>

            <TabsTrigger 
              value="outdoor"
              className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-600 hover:bg-slate-200"
            >
              <div className="flex items-center gap-2">
                <FaLeaf className="h-4 w-4" />
                <span>Outdoor</span>
              </div>
            </TabsTrigger>

            <TabsTrigger 
              value="summary"
              className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-600 hover:bg-slate-200"
            >
              <div className="flex items-center gap-2">
                <FaChartBar className="h-4 w-4" />
                <span>Summary</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="regular">
          <div className="space-y-4">
            <RegularTasks />
          </div>
        </TabsContent>

        <TabsContent value="indoor">
          <div className="space-y-4">
            <IndoorTasks />
          </div>
        </TabsContent>

        <TabsContent value="outdoor">
          <div className="space-y-4">
            <OutdoorTasks />
          </div>
        </TabsContent>

        <TabsContent value="summary">
          <div className="space-y-4">
            <ReplacementServicesSummary />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default HousekeepingAssessment;