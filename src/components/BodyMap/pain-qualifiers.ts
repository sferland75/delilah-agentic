const defaultQualifiers = [
  'Sharp',
  'Dull',
  'Aching',
  'Burning',
  'Tingling',
  'Numbness',
  'Throbbing',
  'Shooting',
  'Stiffness',
  'Weakness',
  'Radiating',
  'Spasm'
];

const spineQualifiers = [
  'Sharp',
  'Dull',
  'Aching',
  'Burning',
  'Tingling',
  'Numbness',
  'Throbbing',
  'Shooting',
  'Stiffness',
  'Weakness',
  'Radiating',
  'Spasm',
  'Limited ROM',
  'Muscle Tension',
  'Joint Restriction'
];

const cervicalQualifiers = [
  ...spineQualifiers,
  'Headache',
  'Dizziness',
  'Vertigo',
  'Upper Extremity Symptoms'
];

const regionQualifiers: Record<string, string[]> = {
  neck: cervicalQualifiers,
  cervicalSpine: cervicalQualifiers,
  thoracicSpine: spineQualifiers,
  lumbarSpine: spineQualifiers,
  sacralSpine: spineQualifiers
};

export function getQualifiersForRegion(regionId: string): string[] {
  console.log('Getting qualifiers for region:', regionId);
  const qualifiers = regionQualifiers[regionId] || defaultQualifiers;
  console.log('Qualifiers:', qualifiers);
  return qualifiers;
}