import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  FaNotesMedical,
  FaClipboardCheck,
  FaCalendarCheck
} from 'react-icons/fa';

export function AdditionalNotes() {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FaNotesMedical className="h-4 w-4 text-blue-600" />
            <Label className="text-sm text-slate-600 font-medium">General Environmental Notes</Label>
          </div>
          <Textarea
            {...register('environmental.notes.general')}
            placeholder="Additional observations or notes about the property"
            className="mt-2 resize-none bg-white border-slate-200 focus:border-blue-300"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <FaClipboardCheck className="h-4 w-4 text-blue-600" />
            <Label className="text-sm text-slate-600 font-medium">Recommendations</Label>
          </div>
          <Textarea
            {...register('environmental.notes.recommendations')}
            placeholder="Overall recommendations for environmental modifications"
            className="mt-2 resize-none bg-white border-slate-200 focus:border-blue-300"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <FaCalendarCheck className="h-4 w-4 text-blue-600" />
            <Label className="text-sm text-slate-600 font-medium">Follow-up Items</Label>
          </div>
          <Textarea
            {...register('environmental.notes.followUp')}
            placeholder="Items requiring follow-up or additional assessment"
            className="mt-2 resize-none bg-white border-slate-200 focus:border-blue-300"
          />
        </div>
      </div>
    </div>
  );
}