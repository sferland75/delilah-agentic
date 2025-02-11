import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from "@/components/ui/label";
import { 
  FaCalculator, 
  FaRegClock, 
  FaDollarSign, 
  FaChartBar 
} from 'react-icons/fa';

export function ReplacementServicesSummary() {
  const { watch } = useFormContext();
  const housekeeping = watch('housekeeping') || {};

  const totals = Object.values(housekeeping).reduce((acc: any, task: any) => {
    if (task?.replacementType === 'hours') {
      acc.totalHours += parseFloat(task.replacementHours || 0);
    } else if (task?.replacementType === 'contract') {
      // Convert contract amounts to weekly basis
      let weeklyAmount = parseFloat(task.contractAmount || 0);
      switch (task?.contractFrequency) {
        case 'monthly':
          weeklyAmount = weeklyAmount / 4;
          break;
        case 'seasonal':
          weeklyAmount = weeklyAmount / 13;
          break;
        case 'annual':
          weeklyAmount = weeklyAmount / 52;
          break;
      }
      acc.totalContractCost += weeklyAmount;
    }
    return acc;
  }, { totalHours: 0, totalContractCost: 0 });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <FaChartBar className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium">Service Summary</h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <FaRegClock className="h-4 w-4 text-blue-600" />
            <Label className="text-base font-medium">Total Weekly Hours</Label>
          </div>
          <div className="text-3xl font-bold text-blue-600">
            {totals.totalHours.toFixed(2)} hours
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <FaDollarSign className="h-4 w-4 text-blue-600" />
            <Label className="text-base font-medium">Weekly Contract Cost</Label>
          </div>
          <div className="text-3xl font-bold text-blue-600">
            ${totals.totalContractCost.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <FaCalculator className="h-4 w-4 text-blue-600" />
          <Label className="text-base font-medium">Annual Projections</Label>
        </div>
        <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-lg">
          <div>
            <Label className="text-sm text-slate-600">Annual Hours</Label>
            <div className="text-xl font-semibold text-slate-800">
              {(totals.totalHours * 52).toFixed(1)} hours
            </div>
          </div>
          <div>
            <Label className="text-sm text-slate-600">Annual Contract Cost</Label>
            <div className="text-xl font-semibold text-slate-800">
              ${(totals.totalContractCost * 52).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-slate-500">
        Note: Contract costs have been converted to weekly amounts for comparison purposes. 
        Annual projections are based on 52 weeks per year.
      </div>
    </div>
  );
}