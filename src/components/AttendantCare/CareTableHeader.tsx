import React from 'react';
import { TableHead, TableRow } from '@/components/ui/table';

export const CareTableHeader = () => {
    return (
        <TableRow className="bg-muted/50">
            <TableHead className="w-[300px] px-8">Activity</TableHead>
            <TableHead className="w-[120px] text-center">Number of Minutes</TableHead>
            <TableHead className="w-[120px] text-center">Times per week</TableHead>
            <TableHead className="w-[120px] text-right">Total minutes per week</TableHead>
            <TableHead className="min-w-[250px] pl-4">Clinical Justification</TableHead>
        </TableRow>
    );
};

export default CareTableHeader;