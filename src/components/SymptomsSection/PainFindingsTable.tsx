import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PainFindingsTableProps {
  painData?: Record<string, any>;
}

export function PainFindingsTable({ painData = {} }: PainFindingsTableProps) {
  // Ensure painData is an object
  const data = painData || {};
  console.log('Pain data in table:', data);

  // Convert pain data to array of findings
  const painFindings = Object.entries(data)
    .map(([region, data]: [string, any]) => {
      console.log('Processing finding for region:', region, data);

      if (!data || !data.severity) {
        return null;
      }

      // Format location name
      const locationName = region
        .replace(/([A-Z])/g, ' $1') // Add spaces before capital letters
        .replace(/_/g, ' ')
        .replace(/Back$/, ' Back')
        .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
        .replace(/\s+/g, ' ') // Remove extra spaces
        .trim();

      return {
        location: locationName,
        severity: data.severity,
        symptoms: Array.isArray(data.symptoms) ? data.symptoms.join(', ') : '',
        notes: data.notes || ''
      };
    })
    .filter(Boolean);

  console.log('Processed findings:', painFindings);

  if (!painFindings.length) {
    return (
      <div className="text-sm text-slate-600 italic p-4">
        No pain findings recorded
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px]">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Location</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead className="min-w-[200px]">Symptoms</TableHead>
              <TableHead className="min-w-[200px]">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {painFindings.map((finding, index) => (
              <TableRow key={index}>
                <TableCell>{finding.location}</TableCell>
                <TableCell>{finding.severity}/10</TableCell>
                <TableCell>{finding.symptoms || 'None recorded'}</TableCell>
                <TableCell className="text-sm text-slate-600">
                  {finding.notes || 'No notes'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  );
}