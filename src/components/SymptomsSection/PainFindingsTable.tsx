import React from 'react';
import { useFormContext } from "react-hook-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function PainFindingsTable() {
  const { watch } = useFormContext();
  const painData = watch('symptoms.pain');
  
  console.log('Raw pain data in table:', painData);

  // If painData is null or undefined, show empty state
  if (!painData) {
    return (
      <div className="text-sm text-slate-600 italic p-4">
        No pain findings recorded
      </div>
    );
  }

  // Convert pain data to array of findings
  const painFindings = Object.entries(painData)
    .filter(([_, data]: [string, any]) => {
      console.log('Checking data for filtering:', data);
      return data && typeof data.severity === 'number' && data.severity > 0;
    })
    .map(([region, data]: [string, any]) => {
      console.log('Processing region data:', region, data);
      
      // Get selected qualifiers
      const selectedQualifiers = data.qualifiers ? 
        Object.entries(data.qualifiers)
          .filter(([_, isSelected]) => isSelected)
          .map(([qualifier]) => qualifier) : [];

      // Format location name
      const locationName = region
        .replace(/_/g, ' ')
        .replace(/\b[lr]\b/i, match => 
          match.toLowerCase() === 'l' ? 'Left' : 'Right'
        )
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

      return {
        location: locationName,
        severity: data.severity,
        qualifiers: selectedQualifiers.join(', '),
        comments: data.comments || ''
      };
    });

  console.log('Processed findings:', painFindings);

  if (painFindings.length === 0) {
    return (
      <div className="text-sm text-slate-600 italic p-4">
        No pain findings recorded
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Location</TableHead>
            <TableHead>Severity (0-10)</TableHead>
            <TableHead className="min-w-[200px]">Qualifiers</TableHead>
            <TableHead className="min-w-[200px]">Comments</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {painFindings.map((finding, index) => (
            <TableRow key={index}>
              <TableCell>{finding.location}</TableCell>
              <TableCell>{finding.severity}</TableCell>
              <TableCell>{finding.qualifiers}</TableCell>
              <TableCell className="text-sm text-slate-600">{finding.comments}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}