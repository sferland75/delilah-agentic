import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from 'lucide-react';
import { CARE_RATES } from "../constants";
import { calculateForm1Part4 } from "../utils/calculations";

interface CostSummaryProps {
  form: UseFormReturn<any>;
}

export function CostSummary({ form }: CostSummaryProps) {
  // State to hold the calculations
  const [calculations, setCalculations] = React.useState(() => 
    calculateForm1Part4(form.getValues())
  );

  // Update calculations whenever form data changes
  React.useEffect(() => {
    const subscription = form.watch(() => {
      const currentValues = form.getValues();
      const newCalculations = calculateForm1Part4(currentValues);
      setCalculations(newCalculations);
      
      // Update part4 in form state
      form.setValue('part4', newCalculations, { 
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true
      });
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const formatNumber = (num: number = 0) => {
    return new Intl.NumberFormat('en-CA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const formatHours = (num: number = 0) => {
    return new Intl.NumberFormat('en-CA', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(num);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Part 4: Calculation of Attendant Care Costs</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">
          This part must be completed by the Assessor. Calculate the monthly attendant care allowance for Parts 1, 2, and 3. 
          The sum of all three parts will be the Total Assessed Monthly Attendant Care Benefit.
        </p>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Level</TableHead>
              <TableHead className="text-right">Total Minutes per Week</TableHead>
              <TableHead className="text-right">÷ 60 =</TableHead>
              <TableHead className="text-right">× 4.3 =</TableHead>
              <TableHead className="text-right">×</TableHead>
              <TableHead className="text-right">Monthly Care Benefit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Part 1</TableCell>
              <TableCell className="text-right">{formatNumber(calculations.part1.totalMinutesPerWeek)}</TableCell>
              <TableCell className="text-right">{formatHours(calculations.part1.weeklyHours)}</TableCell>
              <TableCell className="text-right">{formatHours(calculations.part1.monthlyHours)}</TableCell>
              <TableCell className="text-right">${CARE_RATES.LEVEL_1}</TableCell>
              <TableCell className="text-right">${formatNumber(calculations.part1.monthlyCost)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Part 2</TableCell>
              <TableCell className="text-right">{formatNumber(calculations.part2.totalMinutesPerWeek)}</TableCell>
              <TableCell className="text-right">{formatHours(calculations.part2.weeklyHours)}</TableCell>
              <TableCell className="text-right">{formatHours(calculations.part2.monthlyHours)}</TableCell>
              <TableCell className="text-right">${CARE_RATES.LEVEL_2}</TableCell>
              <TableCell className="text-right">${formatNumber(calculations.part2.monthlyCost)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Part 3</TableCell>
              <TableCell className="text-right">{formatNumber(calculations.part3.totalMinutesPerWeek)}</TableCell>
              <TableCell className="text-right">{formatHours(calculations.part3.weeklyHours)}</TableCell>
              <TableCell className="text-right">{formatHours(calculations.part3.monthlyHours)}</TableCell>
              <TableCell className="text-right">${CARE_RATES.LEVEL_3}</TableCell>
              <TableCell className="text-right">${formatNumber(calculations.part3.monthlyCost)}</TableCell>
            </TableRow>
            <TableRow className="font-bold">
              <TableCell colSpan={5} className="text-right">
                Total Assessed Monthly Attendant Care Benefit
              </TableCell>
              <TableCell className="text-right">
                ${formatNumber(calculations.totalAssessedMonthlyCost)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Alert className="mt-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Important Note</AlertTitle>
          <AlertDescription>
            This amount is subject to the limits allowed under the Statutory Accident Benefits Schedule.
            <div className="mt-2 space-y-1">
              <div>Calculations:</div>
              <ul className="list-disc list-inside ml-4 text-sm">
                <li>Total minutes per week from each part</li>
                <li>Divided by 60 to get weekly hours</li>
                <li>Multiplied by 4.3 to get monthly hours</li>
                <li>Multiplied by each level's rate:
                  <ul className="list-disc list-inside ml-4">
                    <li>Level 1: ${CARE_RATES.LEVEL_1}/hr</li>
                    <li>Level 2: ${CARE_RATES.LEVEL_2}/hr</li>
                    <li>Level 3: ${CARE_RATES.LEVEL_3}/hr</li>
                  </ul>
                </li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
<<<<<<< HEAD
}
=======
};
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
