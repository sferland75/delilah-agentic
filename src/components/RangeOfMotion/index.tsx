import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_ROM_VALUES, type ROMValue } from './rom-values';
import { Button } from '@/components/ui/button';
import { 
  Info, 
  Brain, 
  ArrowUpDown, 
  ArrowRightLeft, 
  HandMetal, 
  ScissorsSquare, 
  Footprints 
} from 'lucide-react';

// Group ROM values by body region
const groupedROM = DEFAULT_ROM_VALUES.reduce((acc, rom) => {
  const joint = rom.joint;
  if (!acc[joint]) {
    acc[joint] = [];
  }
  acc[joint].push(rom);
  return acc;
}, {});

// Define icon mapping for each joint group
const jointIcons = {
  'Cervical Spine': Brain,
  'Thoracic/Lumbar Spine': ArrowUpDown,
  'Shoulder': ArrowRightLeft,
  'Elbow': ScissorsSquare,
  'Wrist': HandMetal,
  'Hip': ArrowRightLeft,
  'Knee': ArrowUpDown,
  'Ankle': Footprints,
};

export function RangeOfMotion() {
  const form = useFormContext();
  const { register, setValue, getValues, watch } = form;

  React.useEffect(() => {
    DEFAULT_ROM_VALUES.forEach((rom, index) => {
      const measurementValue = {
        joint: rom.joint,
        movement: rom.movement,
        normalROM: rom.normalROM,
        left: {
          active: rom.left.active,
          passive: rom.left.passive
        },
        right: {
          active: rom.right.active,
          passive: rom.right.passive
        },
        painLeft: rom.painLeft,
        painRight: rom.painRight,
        notes: rom.notes
      };

      setValue(
        `functionalAssessment.rangeOfMotion.measurements.${index}`,
        measurementValue,
        { shouldValidate: true, shouldDirty: true }
      );
    });
  }, [setValue]);

  return (
    <Card className="border-2 border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50 border-b border-slate-200">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Range of Motion</CardTitle>
            <CardDescription>Assess joint mobility and movement restrictions</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Assessment Guide
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {Object.entries(groupedROM).map(([joint, movements], groupIndex) => {
          const IconComponent = jointIcons[joint];
          return (
            <div key={joint} className={`${groupIndex > 0 ? 'mt-8' : ''}`}>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
                {IconComponent && <IconComponent className="h-5 w-5 text-blue-600" />}
                <h3 className="text-lg font-medium text-slate-800">{joint}</h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Movement</TableHead>
                    <TableHead>Normal ROM</TableHead>
                    <TableHead>Active L</TableHead>
                    <TableHead>Passive L</TableHead>
                    <TableHead>Pain L</TableHead>
                    <TableHead>Active R</TableHead>
                    <TableHead>Passive R</TableHead>
                    <TableHead>Pain R</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map((rom, index) => {
                    const globalIndex = DEFAULT_ROM_VALUES.findIndex(
                      r => r.joint === rom.joint && r.movement === rom.movement
                    );
                    return (
                      <TableRow key={`${rom.joint}-${rom.movement}`}>
                        <TableCell className="font-medium">
                          {rom.movement}
                        </TableCell>
                        <TableCell>{rom.normalROM}</TableCell>
                        <TableCell>
                          <Input
                            defaultValue={rom.left.active}
                            {...register(`functionalAssessment.rangeOfMotion.measurements.${globalIndex}.left.active`)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            defaultValue={rom.left.passive}
                            {...register(`functionalAssessment.rangeOfMotion.measurements.${globalIndex}.left.passive`)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            defaultChecked={rom.painLeft}
                            {...register(`functionalAssessment.rangeOfMotion.measurements.${globalIndex}.painLeft`)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            defaultValue={rom.right.active}
                            {...register(`functionalAssessment.rangeOfMotion.measurements.${globalIndex}.right.active`)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            defaultValue={rom.right.passive}
                            {...register(`functionalAssessment.rangeOfMotion.measurements.${globalIndex}.right.passive`)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            defaultChecked={rom.painRight}
                            {...register(`functionalAssessment.rangeOfMotion.measurements.${globalIndex}.painRight`)}
                          />
                        </TableCell>
                        <TableCell>
                          <Textarea
                            defaultValue={rom.notes}
                            {...register(`functionalAssessment.rangeOfMotion.measurements.${globalIndex}.notes`)}
                            placeholder="Enter observations..."
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          );
        })}

        <div className="mt-6">
          <div className="space-y-4">
            <div className="font-medium">General Assessment Notes</div>
            <Textarea
              {...register('functionalAssessment.rangeOfMotion.generalNotes')}
              placeholder="Enter overall ROM assessment observations and findings..."
              className="min-h-[100px]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}