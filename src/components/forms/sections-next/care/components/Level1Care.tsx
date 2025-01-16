import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LEVEL_DESCRIPTIONS } from "../constants";
import { CareActivity } from "./CareActivity";
import { Shirt, Stethoscope, Glasses, Smile, UtensilsCrossed, PersonStanding } from 'lucide-react';

interface Level1CareProps {
  form: UseFormReturn<any>;
}

export function Level1Care({ form }: Level1CareProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-slate-800">Level 1 Attendant Care</h3>
        <p className="text-sm text-slate-600 mt-1 mb-4">
          {LEVEL_DESCRIPTIONS.LEVEL_1}
        </p>
      </div>

      <Accordion type="multiple" className="space-y-4">
        <AccordionItem value="dress" className="border rounded-lg">
          <AccordionTrigger className="hover:no-underline px-4 py-3 [data-state=open]:bg-blue-50 rounded-t-lg">
            <div className="flex items-center gap-2 flex-1">
              <Shirt className="h-4 w-4 text-blue-600" />
              <div className="flex-1 text-left">
                <div className="font-medium text-slate-800">Dress</div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 space-y-4 bg-white rounded-b-lg">
            <CareActivity
              form={form}
              path="level1.dress.upperBody"
              label="Upper Body"
              description="underwear, shirt/blouse, sweater, tie, jacket, gloves, jewelry"
            />
            <CareActivity
              form={form}
              path="level1.dress.lowerBody"
              label="Lower Body"
              description="underwear, disposable briefs, skirt/pants, socks, panty hose, slippers shoes"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="undress" className="border rounded-lg">
          <AccordionTrigger className="hover:no-underline px-4 py-3 [data-state=open]:bg-blue-50 rounded-t-lg">
            <div className="flex items-center gap-2 flex-1">
              <Shirt className="h-4 w-4 text-blue-600 rotate-180" />
              <div className="flex-1 text-left">
                <div className="font-medium text-slate-800">Undress</div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 space-y-4 bg-white rounded-b-lg">
            <CareActivity
              form={form}
              path="level1.undress.upperBody"
              label="Upper Body"
              description="underwear, shirt/blouse, sweater, tie, jacket, gloves, jewelry"
            />
            <CareActivity
              form={form}
              path="level1.undress.lowerBody"
              label="Lower Body"
              description="underwear, disposable briefs, skirt/pants, socks, panty hose, slippers shoes"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="prosthetics" className="border rounded-lg">
          <AccordionTrigger className="hover:no-underline px-4 py-3 [data-state=open]:bg-blue-50 rounded-t-lg">
            <div className="flex items-center gap-2 flex-1">
              <Stethoscope className="h-4 w-4 text-blue-600" />
              <div className="flex-1 text-left">
                <div className="font-medium text-slate-800">Prosthetics</div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 space-y-4 bg-white rounded-b-lg">
            <CareActivity
              form={form}
              path="level1.prosthetics.appliesLimbAndSock"
              label="Applies to upper/lower limb prosthesis and stump sock(s)"
            />
            <CareActivity
              form={form}
              path="level1.prosthetics.exchangesDevices"
              label="Exchanges terminal devices and adjusts prosthesis as required"
            />
            <CareActivity
              form={form}
              path="level1.prosthetics.maintenance"
              label="Ensures prosthesis is properly maintained and in good working condition"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="orthotics" className="border rounded-lg">
          <AccordionTrigger className="hover:no-underline px-4 py-3 [data-state=open]:bg-blue-50 rounded-t-lg">
            <div className="flex items-center gap-2 flex-1">
              <Glasses className="h-4 w-4 text-blue-600" />
              <div className="flex-1 text-left">
                <div className="font-medium text-slate-800">Orthotics</div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 space-y-4 bg-white rounded-b-lg">
            <CareActivity
              form={form}
              path="level1.orthotics.assists"
              label="Assists dressing applicant using prescribed orthotics"
              description="burn garment(s), brace(s), support(s), splints, elastic stockings"
            />
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}