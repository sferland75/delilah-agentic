import React from 'react';
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  FaBookMedical, 
  FaCalendarAlt, 
  FaFileAlt 
} from 'react-icons/fa';

export function AMAOverview() {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <FaBookMedical className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium">AMA Guides Overview</h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1.5">
            <FaBookMedical className="h-4 w-4 text-blue-600" />
            <Label className="font-medium">AMA Guides Edition</Label>
          </div>
          <Input 
            {...register('ama.edition')} 
            placeholder="e.g., 6th Edition"
            className="bg-white border-slate-200 focus:border-blue-300"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1.5">
            <FaCalendarAlt className="h-4 w-4 text-blue-600" />
            <Label className="font-medium">Assessment Date</Label>
          </div>
          <Input 
            type="date" 
            {...register('ama.assessmentDate')}
            className="bg-white border-slate-200 focus:border-blue-300"
          />
        </div>

        <div className="col-span-2 space-y-2">
          <div className="flex items-center gap-2 mb-1.5">
            <FaFileAlt className="h-4 w-4 text-blue-600" />
            <Label className="font-medium">General Notes</Label>
          </div>
          <Textarea
            {...register('ama.generalNotes')}
            placeholder="Enter any general notes about the AMA assessment..."
            className="min-h-[120px] bg-white border-slate-200 focus:border-blue-300"
          />
        </div>
      </div>
    </div>
  );
}