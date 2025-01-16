import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LEVEL_DESCRIPTIONS } from "../constants";
import { CareActivity } from "./CareActivity";

interface Level2CareProps {
  form: UseFormReturn<any>;
}

export function Level2Care({ form }: Level2CareProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Level 2 Attendant Care</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">
          {LEVEL_DESCRIPTIONS.LEVEL_2}
        </p>
        
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="hygiene">
            <AccordionTrigger className="text-lg font-semibold">Hygiene</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-medium mb-4">Bathroom</h4>
                  <CareActivity
                    form={form}
                    path="level2.hygiene.bathroom.cleaning"
                    label="Cleaning"
                    description="cleans tub/shower/sink/toilet after applicant's use"
                  />
                </div>
                
                <div>
                  <h4 className="text-base font-medium mb-4">Bedroom</h4>
                  <div className="space-y-4">
                    <CareActivity
                      form={form}
                      path="level2.hygiene.bedroom.cleaning"
                      label="Cleaning"
                      description="changes applicant's bedding, makes bed, cleans bedroom, including Hoyer lifts, overhead bars, bedside tables"
                    />
                    <CareActivity
                      form={form}
                      path="level2.hygiene.bedroom.comfort"
                      label="Comfort"
                      description="ensures comfort, safety and security in this environment"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-medium mb-4">Clothing Care</h4>
                  <div className="space-y-4">
                    <CareActivity
                      form={form}
                      path="level2.hygiene.clothing.preparation"
                      label="Preparation"
                      description="assists in preparing daily wearing apparel"
                    />
                    <CareActivity
                      form={form}
                      path="level2.hygiene.clothing.sorting"
                      label="Sorting"
                      description="hangs clothes and sorts clothing to be laundered/cleaned"
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="basicSupervisory">
            <AccordionTrigger className="text-lg font-semibold">Basic Supervisory Care</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <CareActivity
                form={form}
                path="level2.basicSupervisory.tracheostomy"
                label="Tracheostomy"
                description="applicant lacks the capacity to reattach tubing if it becomes detached from trachea"
              />
              <CareActivity
                form={form}
                path="level2.basicSupervisory.transfers"
                label="Transfers"
                description="applicant requires assistance to transfer from wheelchair, periodic turning, genitourinary care"
              />
              <CareActivity
                form={form}
                path="level2.basicSupervisory.wheelchair"
                label="Wheelchair"
                description="applicant lacks the ability to independently get in and out of a wheelchair or to be self-sufficient in an emergency"
              />
              <CareActivity
                form={form}
                path="level2.basicSupervisory.behavioural"
                label="Behavioral"
                description="applicant lacks the ability to respond to an emergency or needs custodial care due to changes in behaviour"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="coordination">
            <AccordionTrigger className="text-lg font-semibold">Co-ordination of Attendant Care</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <CareActivity
                form={form}
                path="level2.coordination.scheduling"
                label="Scheduling"
                description="applicant requires assistance in co-ordinating/scheduling attendant care (maximum 1 hour per week)"
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}