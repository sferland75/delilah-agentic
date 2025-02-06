import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export function RoomAssessment() {
  const { register, setValue, watch } = useFormContext();
  const prefix = 'environmental.roomAssessment';

  const renderFlooringSection = (roomPath: string) => (
    <div className="space-y-4">
      <Label>Flooring</Label>
      <div className="grid grid-cols-2 gap-4">
        <Input {...register(`${roomPath}.flooring.type`)} placeholder="Floor type" />
        <Input {...register(`${roomPath}.flooring.condition`)} placeholder="Condition" />
        <div className="flex items-center space-x-2">
          <Checkbox {...register(`${roomPath}.flooring.slipResistant`)} />
          <Label>Slip Resistant</Label>
        </div>
      </div>
      <Textarea {...register(`${roomPath}.flooring.notes`)} placeholder="Additional flooring notes" />
    </div>
  );

  const renderModificationsSection = (roomPath: string) => (
    <div className="space-y-4">
      <Label>Required Modifications</Label>
      <Textarea 
        {...register(`${roomPath}.modifications.required`)} 
        placeholder="List required modifications"
        className="h-20"
      />
    </div>
  );

  const renderKitchenSection = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Kitchen Assessment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input {...register(`${prefix}.kitchen.layout`)} placeholder="Layout type (e.g., L-shaped)" />
          <Input {...register(`${prefix}.kitchen.dimensions`)} placeholder="Dimensions" />
        </div>

        {renderFlooringSection(`${prefix}.kitchen`)}
        
        <div className="space-y-4">
          <Label>Storage</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Upper Cabinets</Label>
              <Checkbox {...register(`${prefix}.kitchen.storage.upperCabinets.accessible`)} />
              <Input {...register(`${prefix}.kitchen.storage.upperCabinets.height`)} placeholder="Height" />
              <Textarea {...register(`${prefix}.kitchen.storage.upperCabinets.notes`)} placeholder="Notes" />
            </div>
            <div className="space-y-2">
              <Label>Lower Cabinets</Label>
              <Checkbox {...register(`${prefix}.kitchen.storage.lowerCabinets.accessible`)} />
              <Input {...register(`${prefix}.kitchen.storage.lowerCabinets.type`)} placeholder="Type" />
              <Textarea {...register(`${prefix}.kitchen.storage.lowerCabinets.notes`)} placeholder="Notes" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Appliances</Label>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Stove</Label>
              <Input {...register(`${prefix}.kitchen.appliances.stove.type`)} placeholder="Type" />
              <Input {...register(`${prefix}.kitchen.appliances.stove.controls`)} placeholder="Controls" />
              <Checkbox {...register(`${prefix}.kitchen.appliances.stove.accessible`)} />
            </div>
            <div className="space-y-2">
              <Label>Refrigerator</Label>
              <Input {...register(`${prefix}.kitchen.appliances.refrigerator.type`)} placeholder="Type" />
              <Checkbox {...register(`${prefix}.kitchen.appliances.refrigerator.accessible`)} />
              <Textarea {...register(`${prefix}.kitchen.appliances.refrigerator.notes`)} placeholder="Notes" />
            </div>
            <div className="space-y-2">
              <Label>Microwave</Label>
              <Input {...register(`${prefix}.kitchen.appliances.microwave.mounted`)} placeholder="Mounting" />
              <Checkbox {...register(`${prefix}.kitchen.appliances.microwave.accessible`)} />
              <Textarea {...register(`${prefix}.kitchen.appliances.microwave.notes`)} placeholder="Notes" />
            </div>
          </div>
        </div>

        {renderModificationsSection(`${prefix}.kitchen`)}
      </CardContent>
    </Card>
  );

  const renderBathroomSection = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Bathroom Assessment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input {...register(`${prefix}.bathroom_main.layout`)} placeholder="Layout" />
          <Input {...register(`${prefix}.bathroom_main.dimensions`)} placeholder="Dimensions" />
        </div>

        {renderFlooringSection(`${prefix}.bathroom_main`)}

        <div className="space-y-4">
          <Label>Fixtures</Label>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Toilet</Label>
              <Input {...register(`${prefix}.bathroom_main.fixtures.toilet.height`)} placeholder="Height" />
              <Input {...register(`${prefix}.bathroom_main.fixtures.toilet.spaceAround`)} placeholder="Space around" />
              <Checkbox {...register(`${prefix}.bathroom_main.fixtures.toilet.hasGrabBars`)} />
            </div>
            <div className="space-y-2">
              <Label>Shower</Label>
              <Input {...register(`${prefix}.bathroom_main.fixtures.shower.type`)} placeholder="Type" />
              <div className="flex flex-col gap-2">
                <Checkbox {...register(`${prefix}.bathroom_main.fixtures.shower.hasGrabBars`)} />
                <Checkbox {...register(`${prefix}.bathroom_main.fixtures.shower.hasSeat`)} />
                <Checkbox {...register(`${prefix}.bathroom_main.fixtures.shower.hasHandheld`)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Sink</Label>
              <Input {...register(`${prefix}.bathroom_main.fixtures.sink.height`)} placeholder="Height" />
              <Checkbox {...register(`${prefix}.bathroom_main.fixtures.sink.clearanceUnder`)} />
              <Input {...register(`${prefix}.bathroom_main.fixtures.sink.faucetType`)} placeholder="Faucet type" />
            </div>
          </div>
        </div>

        {renderModificationsSection(`${prefix}.bathroom_main`)}
      </CardContent>
    </Card>
  );

  const renderBedroomSection = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Bedroom Assessment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input {...register(`${prefix}.bedroom_main.layout`)} placeholder="Layout" />
          <Input {...register(`${prefix}.bedroom_main.dimensions`)} placeholder="Dimensions" />
        </div>

        {renderFlooringSection(`${prefix}.bedroom_main`)}

        <div className="space-y-4">
          <Label>Bed</Label>
          <div className="grid grid-cols-2 gap-4">
            <Input {...register(`${prefix}.bedroom_main.bed.type`)} placeholder="Type" />
            <Input {...register(`${prefix}.bedroom_main.bed.height`)} placeholder="Height" />
            <Input {...register(`${prefix}.bedroom_main.bed.accessibleFrom`)} placeholder="Accessible from" />
            <Checkbox {...register(`${prefix}.bedroom_main.bed.transferDevices`)} />
          </div>
        </div>

        <div className="space-y-4">
          <Label>Storage</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Closet</Label>
              <Input {...register(`${prefix}.bedroom_main.storage.closet.type`)} placeholder="Type" />
              <Checkbox {...register(`${prefix}.bedroom_main.storage.closet.accessible`)} />
              <Textarea {...register(`${prefix}.bedroom_main.storage.closet.notes`)} placeholder="Notes" />
            </div>
            <div className="space-y-2">
              <Label>Dresser</Label>
              <Input {...register(`${prefix}.bedroom_main.storage.dresser.height`)} placeholder="Height" />
              <Checkbox {...register(`${prefix}.bedroom_main.storage.dresser.accessible`)} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Lighting</Label>
          <div className="grid grid-cols-2 gap-4">
            <Checkbox {...register(`${prefix}.bedroom_main.lighting.adequate`)} />
            <Input {...register(`${prefix}.bedroom_main.lighting.controls`)} placeholder="Controls" />
          </div>
          <Textarea {...register(`${prefix}.bedroom_main.lighting.notes`)} placeholder="Lighting notes" />
        </div>

        {renderModificationsSection(`${prefix}.bedroom_main`)}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {renderKitchenSection()}
      {renderBathroomSection()}
      {renderBedroomSection()}
    </div>
  );
}