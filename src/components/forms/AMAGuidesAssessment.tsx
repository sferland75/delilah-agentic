import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { FormError } from "../ui/form-error";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

// Detailed sphere descriptions from AMA Guides 4th Edition
const sphereDescriptions = {
  activitiesOfDailyLiving: {
    title: "Activities of Daily Living",
    description: `Assess ability to engage in self-care, personal hygiene, communication, travel, and physical activities. Consider:
    - Self-care and personal hygiene (bathing, dressing, toileting, etc.)
    - Personal transportation (driving, public transit use)
    - Travel and movement in community
    - Sexual function and relationships
    - Sleep patterns and habits
    - Social and recreational activities`,
    classDescriptions: {
      1: "Class 1: No Impairment (0%) - Able to perform all activities of daily living without assistance or difficulty",
      2: "Class 2: Mild Impairment (1-14%) - Able to perform most daily activities with some mild limitations",
      3: "Class 3: Moderate Impairment (15-29%) - Notable difficulty with several daily activities, may need assistance",
      4: "Class 4: Marked Impairment (30-49%) - Serious difficulties with most daily activities, requires regular assistance",
      5: "Class 5: Extreme Impairment (50-70%) - Unable to perform most activities of daily living independently"
    }
  },
  socialFunctioning: {
    title: "Social Functioning",
    description: `Evaluate ability to interact and communicate effectively with others. Consider:
    - Ability to get along with family members
    - Ability to get along with friends and neighbors
    - Ability to get along with authority figures
    - Ability to work with others cooperatively
    - Ability to maintain socially appropriate behavior
    - Ability to communicate clearly and effectively`,
    classDescriptions: {
      1: "Class 1: No Impairment (0%) - Interacts and communicates effectively in all social settings",
      2: "Class 2: Mild Impairment (1-14%) - Mild difficulty in social situations but generally functions adequately",
      3: "Class 3: Moderate Impairment (15-29%) - Notable difficulties in several social contexts",
      4: "Class 4: Marked Impairment (30-49%) - Serious difficulty in most social situations",
      5: "Class 5: Extreme Impairment (50-70%) - Unable to function effectively in almost all social situations"
    }
  },
  concentrationPersistencePace: {
    title: "Concentration, Persistence and Pace",
    description: `Assess ability to sustain focused attention and concentration sufficiently long to permit timely completion of tasks. Consider:
    - Ability to focus on tasks
    - Ability to maintain attention and concentration
    - Ability to maintain reasonable pace
    - Ability to complete tasks in timely manner
    - Ability to adapt to schedules
    - Ability to manage multiple tasks
    - Ability to work under time pressure`,
    classDescriptions: {
      1: "Class 1: No Impairment (0%) - Can concentrate and complete all tasks efficiently",
      2: "Class 2: Mild Impairment (1-14%) - Occasional lapses but generally maintains adequate pace",
      3: "Class 3: Moderate Impairment (15-29%) - Frequent problems with concentration and task completion",
      4: "Class 4: Marked Impairment (30-49%) - Unable to maintain focus or complete most tasks",
      5: "Class 5: Extreme Impairment (50-70%) - Cannot concentrate or complete even simple tasks"
    }
  },
  adaptationToWork: {
    title: "Adaptation to Work or Work-Like Settings",
    description: `Evaluate ability to adapt to stressful circumstances in work settings. Consider:
    - Ability to follow rules and policies
    - Ability to respond appropriately to changes
    - Ability to be reliable and punctual
    - Ability to interact with supervisors
    - Ability to handle conflicts with others
    - Ability to maintain appropriate workplace behavior
    - Ability to handle work pressures and stress`,
    classDescriptions: {
      1: "Class 1: No Impairment (0%) - Can adapt to all work situations appropriately",
      2: "Class 2: Mild Impairment (1-14%) - Some difficulty with workplace stress but generally adapts",
      3: "Class 3: Moderate Impairment (15-29%) - Notable difficulty adapting to several aspects of work",
      4: "Class 4: Marked Impairment (30-49%) - Serious difficulty adapting to most work situations",
      5: "Class 5: Extreme Impairment (50-70%) - Cannot adapt to any work setting or handle any work stress"
    }
  }
};

interface RatingFieldProps {
  sphere: keyof typeof sphereDescriptions;
}

const RatingField: React.FC<RatingFieldProps> = ({ sphere }) => {
  const { control, watch } = useFormContext();
  const currentRating = watch(`amaGuides.${sphere}.rating`) || 1;
  const sphereData = sphereDescriptions[sphere];

  return (
    <div className="space-y-6 p-4 border rounded-lg">
      <div>
        <h3 className="text-lg font-semibold mb-2">{sphereData.title}</h3>
        <Alert>
          <AlertDescription className="whitespace-pre-line">
            {sphereData.description}
          </AlertDescription>
        </Alert>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <FormLabel className="text-lg font-semibold">Impairment Classification</FormLabel>
          <span className="text-sm font-medium">
            Class {currentRating} Rating
          </span>
        </div>
        
        <FormField
          control={control}
          name={`amaGuides.${sphere}.rating`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={[field.value || 1]}
                  onValueChange={(value) => field.onChange(value[0])}
                  className="py-4"
                />
              </FormControl>
              <FormDescription className="mt-2 text-sm font-medium">
                {sphereData.classDescriptions[currentRating as keyof typeof sphereData.classDescriptions]}
              </FormDescription>
            </FormItem>
          )}
        />

        <Separator className="my-4" />

        <FormField
          control={control}
          name={`amaGuides.${sphere}.clinicalFindings`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Clinical Findings</FormLabel>
              <FormControl>
                <Textarea 
                  {...field}
                  placeholder="Document objective findings that support this rating..."
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormError message={field.value?.message} />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`amaGuides.${sphere}.functionalLimitations`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Functional Limitations</FormLabel>
              <FormControl>
                <Textarea 
                  {...field}
                  placeholder="Describe specific functional limitations in this area..."
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormError message={field.value?.message} />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`amaGuides.${sphere}.treatmentAndPrognosis`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Treatment and Prognosis</FormLabel>
              <FormControl>
                <Textarea 
                  {...field}
                  placeholder="Document current treatment approach and expected outcomes..."
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormError message={field.value?.message} />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export const AMAGuidesAssessment: React.FC = () => {
  const { control } = useFormContext();
  
  const ratings = useWatch({
    control,
    name: [
      'amaGuides.activitiesOfDailyLiving.rating',
      'amaGuides.socialFunctioning.rating',
      'amaGuides.concentrationPersistencePace.rating',
      'amaGuides.adaptationToWork.rating'
    ]
  });

  // Calculate highest class rating
  const highestRating = React.useMemo(() => {
    const validRatings = ratings.filter(Boolean);
    return validRatings.length > 0 ? Math.max(...validRatings) : 1;
  }, [ratings]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AMA Guides Assessment (4th Edition)</CardTitle>
        <CardDescription>
          Mental and Behavioral Impairment Assessment following Chapter 14 criteria
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Alert>
            <AlertDescription>
              Following AMA Guides 4th Edition Chapter 14, evaluate impairment in each area using the 
              five-class system. Document clinical findings and functional limitations to support each rating. 
              The final impairment class is determined by the highest rated area.
            </AlertDescription>
          </Alert>

          <RatingField sphere="activitiesOfDailyLiving" />
          <RatingField sphere="socialFunctioning" />
          <RatingField sphere="concentrationPersistencePace" />
          <RatingField sphere="adaptationToWork" />

          {highestRating > 1 && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <FormField
                control={control}
                name="amaGuides.overallAssessment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Overall Assessment</FormLabel>
                    <FormDescription>
                      Based on the highest rated impairment (Class {highestRating}), provide final assessment justification.
                    </FormDescription>
                    <FormControl>
                      <Textarea 
                        {...field}
                        placeholder="Provide justification for the overall impairment rating..."
                        className="min-h-[100px] mt-2"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AMAGuidesAssessment;