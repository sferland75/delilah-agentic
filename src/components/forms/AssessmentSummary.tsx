import React from "react";
import { useFormContext } from "react-hook-form";
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const AssessmentSummary: React.FC = () => {
  const { control, watch } = useFormContext();
  
  // Watch key fields from other sections to help with summary
  const functionalImpairments = watch("functionalAssessment.rangeOfMotion.assessment");
  const careNeeds = watch("careRequirements.justification");
  const amaRatings = {
    adl: watch("amaGuides.activitiesOfDailyLiving.rating"),
    social: watch("amaGuides.socialFunctioning.rating"),
    concentration: watch("amaGuides.concentrationPersistencePace.rating"),
    adaptation: watch("amaGuides.adaptationToWorkSettings.rating"),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessment Summary</CardTitle>
        <CardDescription>
          Summarize key findings and recommendations based on the comprehensive assessment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="key-findings">
            <AccordionTrigger>Key Findings</AccordionTrigger>
            <AccordionContent>
              <FormField
                control={control}
                name="summary.keyFindings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Primary Findings and Impairments</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field}
                        placeholder={`Summarize key findings including:
- Primary functional limitations
- Major impairments identified
- Notable symptoms and their impact
- Significant test results
- Overall severity assessment`}
                        className="min-h-[200px]"
                      />
                    </FormControl>
                    <FormDescription>
                      Consider functional assessment results and AMA Guide ratings when documenting findings
                    </FormDescription>
                    <FormError message={field.value?.message} />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="care-needs">
            <AccordionTrigger>Care & Assistance Needs</AccordionTrigger>
            <AccordionContent>
              <FormField
                control={control}
                name="summary.careAssistanceNeeds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Required Support and Assistance</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field}
                        placeholder={`Detail care and assistance requirements including:
- Level of supervision needed
- Specific assistance required for ADLs
- Safety considerations
- Equipment or modification needs
- Support frequency and duration`}
                        className="min-h-[200px]"
                      />
                    </FormControl>
                    <FormDescription>
                      Reference care requirements assessment and AMA Guide ratings for ADL
                    </FormDescription>
                    <FormError message={field.value?.message} />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="functional-impact">
            <AccordionTrigger>Functional Impact</AccordionTrigger>
            <AccordionContent>
              <FormField
                control={control}
                name="summary.functionalImpact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Impact on Daily Activities and Participation</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field}
                        placeholder={`Describe impact on:
- Work capacity and limitations
- Social participation
- Domestic activities
- Community engagement
- Quality of life`}
                        className="min-h-[200px]"
                      />
                    </FormControl>
                    <FormDescription>
                      Consider functional assessment findings and social functioning ratings
                    </FormDescription>
                    <FormError message={field.value?.message} />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="recommendations">
            <AccordionTrigger>Recommendations</AccordionTrigger>
            <AccordionContent>
              <FormField
                control={control}
                name="summary.recommendations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Treatment and Management Recommendations</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field}
                        placeholder={`Detail recommendations for:
- Treatment interventions
- Care requirements
- Environmental modifications
- Equipment needs
- Follow-up assessments
- Review timeframes`}
                        className="min-h-[200px]"
                      />
                    </FormControl>
                    <FormDescription>
                      Base recommendations on assessment findings and identified needs
                    </FormDescription>
                    <FormError message={field.value?.message} />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="closing">
            <AccordionTrigger>Closing Summary</AccordionTrigger>
            <AccordionContent>
              <FormField
                control={control}
                name="summary.closingSummary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overall Assessment Conclusions</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field}
                        placeholder={`Provide a comprehensive closing summary including:
- Overall functional status
- Primary care needs
- Key recommendations
- Prognosis and expected outcomes
- Follow-up requirements`}
                        className="min-h-[200px]"
                      />
                    </FormControl>
                    <FormDescription>
                      Synthesize all assessment findings into a cohesive conclusion
                    </FormDescription>
                    <FormError message={field.value?.message} />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default AssessmentSummary;