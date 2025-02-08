import React from 'react';
import { useFormContext } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RomMmtMap } from '@/components/RomMmtMap';
import { type AssessmentFormData } from '@/lib/validation/assessment-schema';
import { Card, CardContent } from "@/components/ui/card";
import { 
  FaWalking,
  FaChair,
  FaArrowsAltH,
  FaMale,
  FaPray,
  FaRuler,
  FaClock,
  FaExclamationCircle,
  FaStickyNote,
  FaTools,
  FaUserCog,
  FaHandHoldingHeart,
  FaLayerGroup,
  FaLevelUpAlt // Changed from FaStairs
} from 'react-icons/fa';

import { 
  ActivityTypes, 
  CapabilityLevel,
  StairPattern
} from '@/lib/validation/functional-schema';

const timeBasedActivities = [
  { id: 'walking', name: 'Walking', icon: FaWalking },
  { id: 'standing', name: 'Standing', icon: FaMale },
  { id: 'sitting', name: 'Sitting', icon: FaChair },
] as const;

const postureActivities = [
  { id: 'kneeling', name: 'Kneeling', icon: FaPray },
  { id: 'crouching', name: 'Crouching', icon: FaMale },
  { id: 'lying', name: 'Lying', icon: FaMale },
  { id: 'reaching_overhead', name: 'Reaching Overhead', icon: FaMale },
  { id: 'reaching_floor', name: 'Reaching Floor Level', icon: FaMale },
] as const;

const StairAssessmentForm = () => {
  const { register, watch } = useFormContext<AssessmentFormData>();
  const basePath = 'functionalAssessment.stairAssessment';
  const stairData = watch(basePath) || {};

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <FaLevelUpAlt className="h-5 w-5 text-blue-500" /> {/* Changed from FaStairs */}
          <h4 className="text-lg font-semibold">Stair Assessment</h4>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FaWalking className="h-4 w-4 text-blue-500" />
              <Label>Stair Climbing Pattern</Label>
            </div>
            <Select
              value={stairData.pattern}
              onValueChange={(value) => register(`${basePath}.pattern`).onChange({ target: { value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select climbing pattern" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={StairPattern.RECIPROCAL}>Reciprocal</SelectItem>
                <SelectItem value={StairPattern.RECIPROCAL_RAIL}>Reciprocal with Handrail</SelectItem>
                <SelectItem value={StairPattern.STEP_STEP}>Step-Step</SelectItem>
                <SelectItem value={StairPattern.STEP_STEP_RAIL}>Step-Step with Handrail</SelectItem>
                <SelectItem value={StairPattern.STEP_STEP_ASSIST}>Step-Step with Assistance</SelectItem>
                <SelectItem value={StairPattern.UNABLE}>Unable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FaLayerGroup className="h-4 w-4 text-blue-500" />
              <Label>Flights Completed</Label>
            </div>
            <Input
              type="number"
              {...register(`${basePath}.flightsCompleted`)}
              placeholder="Number of flights"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FaHandHoldingHeart className="h-4 w-4 text-blue-500" />
              <Label>Assistive Device</Label>
            </div>
            <Input
              {...register(`${basePath}.assistiveDevice`)}
              placeholder="Device used (if any)"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FaExclamationCircle className="h-4 w-4 text-blue-500" />
              <Label>Limitations</Label>
            </div>
            <Input
              {...register(`${basePath}.limitations`)}
              placeholder="Any limitations"
            />
          </div>

          <div className="space-y-2 col-span-2">
            <div className="flex items-center gap-2">
              <FaStickyNote className="h-4 w-4 text-blue-500" />
              <Label>Notes</Label>
            </div>
            <Textarea
              {...register(`${basePath}.notes`)}
              placeholder="Additional observations or notes"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TimeBasedActivityForm = ({ activity }: { activity: typeof timeBasedActivities[number] }) => {
  const { register, watch } = useFormContext<AssessmentFormData>();
  const basePath = `functionalAssessment.timeBasedActivities.${activity.id}`;
  const activityData = watch(basePath) || {};

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <activity.icon className="h-5 w-5 text-blue-500" />
          <h4 className="text-lg font-semibold">{activity.name}</h4>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FaClock className="h-4 w-4 text-blue-500" />
              <Label>Time Tolerance</Label>
            </div>
            <div className="flex gap-2">
              <Input
                type="number"
                {...register(`${basePath}.timeLimit`)}
                placeholder="Duration"
                className="w-24"
              />
              <Select
                value={activityData.timeUnit}
                onValueChange={(value) => register(`${basePath}.timeUnit`).onChange({ target: { value } })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seconds">Seconds</SelectItem>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FaExclamationCircle className="h-4 w-4 text-blue-500" />
              <Label>Limitations</Label>
            </div>
            <Input
              {...register(`${basePath}.limitations`)}
              placeholder="Any limitations"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FaTools className="h-4 w-4 text-blue-500" />
              <Label>Modifications</Label>
            </div>
            <Input
              {...register(`${basePath}.modifications`)}
              placeholder="Required modifications"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FaStickyNote className="h-4 w-4 text-blue-500" />
              <Label>Notes</Label>
            </div>
            <Input
              {...register(`${basePath}.notes`)}
              placeholder="Additional notes"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PostureActivityForm = ({ activity }: { activity: typeof postureActivities[number] }) => {
  const { register, watch } = useFormContext<AssessmentFormData>();
  const basePath = `functionalAssessment.postureActivities.${activity.id}`;
  const activityData = watch(basePath) || {};

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <activity.icon className="h-5 w-5 text-blue-500" />
          <h4 className="text-lg font-semibold">{activity.name}</h4>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FaUserCog className="h-4 w-4 text-blue-500" />
              <Label>Capability Level</Label>
            </div>
            <Select
              value={activityData.capability}
              onValueChange={(value) => register(`${basePath}.capability`).onChange({ target: { value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select capability level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CapabilityLevel.INDEPENDENT}>Independent</SelectItem>
                <SelectItem value={CapabilityLevel.INDEPENDENT_WITH_DEVICE}>Independent with Device</SelectItem>
                <SelectItem value={CapabilityLevel.PARTIAL_ASSISTANCE}>Partial Assistance Required</SelectItem>
                <SelectItem value={CapabilityLevel.UNABLE}>Unable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FaTools className="h-4 w-4 text-blue-500" />
              <Label>Device/Assistance</Label>
            </div>
            <Input
              {...register(`${basePath}.device`)}
              placeholder="Required device or assistance"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FaExclamationCircle className="h-4 w-4 text-blue-500" />
              <Label>Limitations</Label>
            </div>
            <Input
              {...register(`${basePath}.limitations`)}
              placeholder="Any limitations"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FaStickyNote className="h-4 w-4 text-blue-500" />
              <Label>Notes</Label>
            </div>
            <Input
              {...register(`${basePath}.notes`)}
              placeholder="Additional notes"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const FunctionalSection = () => {
  const { getValues, setValue } = useFormContext<AssessmentFormData>();
  const functionalAssessment = getValues('functionalAssessment') || {};

  const handleRomMmtUpdate = (data: any) => {
    setValue('functionalAssessment', {
      ...functionalAssessment,
      [data.type === 'ROM' ? 'rangeOfMotion' : 'manualMuscleTesting']: data.data
    }, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="capacity" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-100">
          <TabsTrigger 
            value="capacity" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <div className="flex items-center gap-2">
              <FaWalking className="h-4 w-4" />
              Functional Capacity
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="bodymap"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <div className="flex items-center gap-2">
              <FaRuler className="h-4 w-4" />
              ROM & MMT Assessment
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="capacity">
          <div className="space-y-4">
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Stair Assessment</h3>
              <StairAssessmentForm />
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Time-Based Activities</h3>
              {timeBasedActivities.map(activity => (
                <TimeBasedActivityForm key={activity.id} activity={activity} />
              ))}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Posture-Based Activities</h3>
              {postureActivities.map(activity => (
                <PostureActivityForm key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="bodymap">
          <RomMmtMap onUpdate={handleRomMmtUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  );
};