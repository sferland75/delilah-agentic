# Previous content remains the same until Outdoor Areas Card

      {/* Outdoor Areas Card */}
      <Card>
        <CardHeader>
          <CardTitle>Outdoor Areas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Entrances and Access */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label>Main Entrance</Label>
                <Textarea
                  {...register('environmental.outdoor.mainEntrance')}
                  placeholder="Describe main entrance accessibility (steps, ramps, lighting)"
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Other Entrances</Label>
                <Textarea
                  {...register('environmental.outdoor.otherEntrances')}
                  placeholder="Describe other entrances (garage, back door, etc.)"
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Parking</Label>
                <Textarea
                  {...register('environmental.outdoor.parking')}
                  placeholder="Describe parking situation (garage, driveway, street parking)"
                  className="mt-2"
                />
              </div>
            </div>

            {/* Property Features */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label>Yard Description</Label>
                <Textarea
                  {...register('environmental.outdoor.yardDescription')}
                  placeholder="Describe yard size, terrain, and features"
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Outdoor Structures</Label>
                <Textarea
                  {...register('environmental.outdoor.structures')}
                  placeholder="Describe outdoor structures (deck, patio, shed, pool)"
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Maintenance Requirements</Label>
                <Textarea
                  {...register('environmental.outdoor.maintenance')}
                  placeholder="Describe yard maintenance needs (mowing, gardening, snow removal)"
                  className="mt-2"
                />
              </div>
            </div>

            {/* Safety and Accessibility */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label>Lighting</Label>
                <Textarea
                  {...register('environmental.outdoor.lighting')}
                  placeholder="Describe outdoor lighting (coverage, controls, timer systems)"
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Safety Concerns</Label>
                <Textarea
                  {...register('environmental.outdoor.safetyConcerns')}
                  placeholder="List any outdoor safety concerns or hazards"
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Accessibility Modifications</Label>
                <Textarea
                  {...register('environmental.outdoor.accessibilityModifications')}
                  placeholder="Describe needed outdoor accessibility modifications"
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes Card */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* General Notes */}
            <div>
              <Label>General Environmental Notes</Label>
              <Textarea
                {...register('environmental.notes.general')}
                placeholder="Additional observations or notes about the property"
                className="mt-2 min-h-[100px]"
              />
            </div>

            {/* Recommendations */}
            <div>
              <Label>Recommendations</Label>
              <Textarea
                {...register('environmental.notes.recommendations')}
                placeholder="Overall recommendations for environmental modifications"
                className="mt-2 min-h-[100px]"
              />
            </div>

            {/* Follow-up Items */}
            <div>
              <Label>Follow-up Items</Label>
              <Textarea
                {...register('environmental.notes.followUp')}
                placeholder="Items requiring follow-up or additional assessment"
                className="mt-2 min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}