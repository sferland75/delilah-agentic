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
import type { Assessment } from '@/lib/validation/assessment-schema';

export function AbnormalFindingsTable() {
  const { watch } = useFormContext<Assessment>();
  
  const romData = watch('assessment.rom') || {};
  const mmtData = watch('assessment.mmt') || {};

  const getAbnormalFindings = () => {
    const findings = [];

    // Process ROM data
    Object.entries(romData).forEach(([joint, movements]) => {
      if (typeof movements === 'object') {
        Object.entries(movements).forEach(([movement, data]) => {
          if (data?.status === 'abnormal' || data?.value !== 'normal') {
            findings.push({
              type: 'ROM',
              location: joint,
              movement,
              finding: data?.value || 'Abnormal',
              notes: data?.notes || ''
            });
          }
        });
      }
    });

    // Process MMT data
    Object.entries(mmtData).forEach(([muscle, data]) => {
      if (data?.grade && data.grade !== '5/5') {
        findings.push({
          type: 'MMT',
          location: muscle,
          movement: 'Strength',
          finding: data.grade,
          notes: data?.notes || ''
        });
      }
    });

    return findings;
  };

  const abnormalFindings = getAbnormalFindings();

  if (abnormalFindings.length === 0) {
    return (
      <div className="text-sm text-slate-600 italic p-4">
        No abnormal ROM/MMT findings recorded
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Movement</TableHead>
            <TableHead>Finding</TableHead>
            <TableHead className="min-w-[200px]">Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {abnormalFindings.map((finding, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{finding.type}</TableCell>
              <TableCell className="capitalize">
                {finding.location.replace(/([A-Z])/g, ' $1').trim()}
              </TableCell>
              <TableCell>{finding.movement}</TableCell>
              <TableCell>{finding.finding}</TableCell>
              <TableCell className="text-sm text-slate-600">{finding.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}