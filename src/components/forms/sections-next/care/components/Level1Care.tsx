import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
<<<<<<< HEAD
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LEVEL_DESCRIPTIONS } from "../constants";
import { CareActivity } from "./CareActivity";
=======
import { LEVEL_DESCRIPTIONS } from "../constants";
import { CareActivity } from "./CareActivity";
import { Shirt, Stethoscope, Glasses, Smile, UtensilsCrossed, PersonStanding } from 'lucide-react';
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801

interface Level1CareProps {
  form: UseFormReturn<any>;
}

export function Level1Care({ form }: Level1CareProps) {
  return (
<<<<<<< HEAD
    <Card>
      <CardHeader>
        <CardTitle>Level 1 Attendant Care</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">
          {LEVEL_DESCRIPTIONS.LEVEL_1}
        </p>
        
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="dress">
            <AccordionTrigger className="text-lg font-semibold">Dress</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
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

          <AccordionItem value="undress">
            <AccordionTrigger className="text-lg font-semibold">Undress</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
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

          <AccordionItem value="prosthetics">
            <AccordionTrigger className="text-lg font-semibold">Prosthetics</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
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

          <AccordionItem value="orthotics">
            <AccordionTrigger className="text-lg font-semibold">Orthotics</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <CareActivity
                form={form}
                path="level1.orthotics.assists"
                label="Assists dressing applicant using prescribed orthotics"
                description="burn garment(s), brace(s), support(s), splints, elastic stockings"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="grooming">
            <AccordionTrigger className="text-lg font-semibold">Grooming</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <CareActivity
                form={form}
                path="level1.grooming.face"
                label="Face"
                description="wash, rinse, dry, morning and evening"
              />
              <CareActivity
                form={form}
                path="level1.grooming.hands"
                label="Hands"
                description="wash, rinse, dry, morning and evening, before and after meals, and after elimination"
              />
              <CareActivity
                form={form}
                path="level1.grooming.shaving"
                label="Shaving"
                description="shaves applicant using electric/safety razor"
              />
              <CareActivity
                form={form}
                path="level1.grooming.cosmetics"
                label="Cosmetics"
                description="applies makeup as desired or required"
              />
              <CareActivity
                form={form}
                path="level1.grooming.hair.brushing"
                label="Hair: Brushing"
                description="brushes/combs as required"
              />
              <CareActivity
                form={form}
                path="level1.grooming.hair.washing"
                label="Hair: Washing"
                description="shampoos, blow/towel dries"
              />
              <CareActivity
                form={form}
                path="level1.grooming.hair.styling"
                label="Hair: Styling"
                description="performs styling, set and comb-out"
              />
              <CareActivity
                form={form}
                path="level1.grooming.fingernails"
                label="Fingernails"
                description="cleans and manicures as required"
              />
              <CareActivity
                form={form}
                path="level1.grooming.toenails"
                label="Toenails"
                description="cleans and trims as required"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="feeding">
            <AccordionTrigger className="text-lg font-semibold">Feeding</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <CareActivity
                form={form}
                path="level1.feeding.preparation"
                label="Preparation"
                description="prepares applicant for meals (includes transfer to appropriate location)"
              />
              <CareActivity
                form={form}
                path="level1.feeding.assistance"
                label="Assistance"
                description="provides assistance, either in whole or in part, in preparing serving and feeding meals"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="mobility">
            <AccordionTrigger className="text-lg font-semibold">Mobility</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <CareActivity
                form={form}
                path="level1.mobility.sitting"
                label="Sitting"
                description="assists applicant from sitting position (for example, wheelchair, chair, sofa)"
              />
              <CareActivity
                form={form}
                path="level1.mobility.walking"
                label="Walking"
                description="supervises/assists in walking"
              />
              <CareActivity
                form={form}
                path="level1.mobility.transfers"
                label="Transfers"
                description="performs transfer needs as required (for example, bed to wheelchair, wheelchair to bed)"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="laundering">
            <AccordionTrigger className="text-lg font-semibold">Extra Laundering</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <CareActivity
                form={form}
                path="level1.laundering.incontinence"
                label="Incontinence"
                description="launders applicant's bedding and clothing as a result of incontinence/spillage"
              />
              <CareActivity
                form={form}
                path="level1.laundering.orthotics"
                label="Orthotics"
                description="launders/cleans orthotic supplies that require special care"
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
=======
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
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
  );
}