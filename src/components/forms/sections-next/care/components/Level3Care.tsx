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

interface Level3CareProps {
  form: UseFormReturn<any>;
}

export function Level3Care({ form }: Level3CareProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Level 3 Attendant Care</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">
          {LEVEL_DESCRIPTIONS.LEVEL_3}
        </p>
        
        <Accordion type="single" collapsible className="space-y-4">
          {/* Previous content remains the same until therapy section */}
          
          <AccordionItem value="therapy">
            <AccordionTrigger className="text-lg font-semibold">Other Therapy</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-medium mb-4">Transcutaneous Electrical Nerve Stimulation (TENS)</h4>
                  <div className="space-y-4">
                    <CareActivity
                      form={form}
                      path="level3.therapy.tens.preparation"
                      label="Preparation"
                      description="prepares equipment"
                    />
                    <CareActivity
                      form={form}
                      path="level3.therapy.tens.administration"
                      label="Administration"
                      description="administers treatment as prescribed or required"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-medium mb-4">Dorsal Column Stimulation (DCS)</h4>
                  <div className="space-y-4">
                    <CareActivity
                      form={form}
                      path="level3.therapy.dcs.monitoring"
                      label="Monitoring"
                      description="monitors skin"
                    />
                    <CareActivity
                      form={form}
                      path="level3.therapy.dcs.maintenance"
                      label="Maintenance"
                      description="maintains equipment"
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="maintenance">
            <AccordionTrigger className="text-lg font-semibold">Maintenance of Supplies and Equipment</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <CareActivity
                form={form}
                path="level3.maintenance.supplies"
                label="Supplies"
                description="monitors, orders and maintains required supplies/equipment"
              />
              <CareActivity
                form={form}
                path="level3.maintenance.equipment"
                label="Equipment"
                description="ensures wheelchairs, prosthetic devices, Hoyer lifts, shower commodes and other specialized medical equipment and assistive devices are safe and secure"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="skilledSupervisory">
            <AccordionTrigger className="text-lg font-semibold">Skilled Supervisory Care</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <CareActivity
                form={form}
                path="level3.skilledSupervisory.behaviour"
                label="Behavioral Care"
                description="applicant requires skilled supervisory care for violent behaviour that may result in physical harm to themselves or others"
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}