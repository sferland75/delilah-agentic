import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ROMDialogProps {
  isOpen: boolean;
  onClose: () => void;
  joint: string;
  onSave: (data: any) => void;
}

export const ROMDialog: React.FC<ROMDialogProps> = ({
  isOpen,
  onClose,
  joint,
  onSave
}) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      percentage: "100",
      painLevel: "0",
      restrictions: "",
      notes: ""
    }
  });

  const onSubmit = (data: any) => {
    onSave(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Range of Motion Assessment - {joint}</DialogTitle>
          <DialogDescription>
            Document ROM restrictions and observations
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>ROM Percentage</Label>
            <Controller
              name="percentage"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="100" id="r100" />
                    <Label htmlFor="r100">100% - Normal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="75" id="r75" />
                    <Label htmlFor="r75">75% - Mild Restriction</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="50" id="r50" />
                    <Label htmlFor="r50">50% - Moderate Restriction</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="25" id="r25" />
                    <Label htmlFor="r25">25% - Severe Restriction</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Pain Level (0-10)</Label>
            <Controller
              name="painLevel"
              control={control}
              render={({ field }) => (
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pain level" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(11)].map((_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i} - {i === 0 ? 'No Pain' : i === 10 ? 'Worst Pain' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Movement Restrictions</Label>
            <Controller
              name="restrictions"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Describe any specific movement restrictions..."
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Additional Notes</Label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Add any additional observations..."
                />
              )}
            />
          </div>

          <DialogFooter>
            <Button type="submit">Save Assessment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface MMTDialogProps {
  isOpen: boolean;
  onClose: () => void;
  muscleGroup: string;
  onSave: (data: any) => void;
}

export const MMTDialog: React.FC<MMTDialogProps> = ({
  isOpen,
  onClose,
  muscleGroup,
  onSave
}) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      grade: "5",
      painLevel: "0",
      observations: ""
    }
  });

  const onSubmit = (data: any) => {
    onSave(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manual Muscle Testing - {muscleGroup}</DialogTitle>
          <DialogDescription>
            Assess muscle strength and function
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>MMT Grade</Label>
            <Controller
              name="grade"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5" id="g5" />
                    <Label htmlFor="g5">Grade 5 - Normal strength</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4" id="g4" />
                    <Label htmlFor="g4">Grade 4 - Good strength</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="g3" />
                    <Label htmlFor="g3">Grade 3 - Fair strength</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="g2" />
                    <Label htmlFor="g2">Grade 2 - Poor strength</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="g1" />
                    <Label htmlFor="g1">Grade 1 - Trace movement</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0" id="g0" />
                    <Label htmlFor="g0">Grade 0 - No movement</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Pain Level (0-10)</Label>
            <Controller
              name="painLevel"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pain level" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(11)].map((_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i} - {i === 0 ? 'No Pain' : i === 10 ? 'Worst Pain' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Observations</Label>
            <Controller
              name="observations"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Note any compensations, quality of movement, or other observations..."
                />
              )}
            />
          </div>

          <DialogFooter>
            <Button type="submit">Save Assessment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};