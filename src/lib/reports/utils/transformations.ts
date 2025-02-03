export const formatDate = (isoDate: string): string => {
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return isoDate;
  }
};

export const cleanString = (str: string): string => {
  if (!str) return '';
  
  // Replace escaped newlines with actual newlines
  return str.replace(/\\n/g, '\n')
    // Remove multiple newlines
    .replace(/\n{3,}/g, '\n\n')
    // Trim whitespace
    .trim();
};

export const formatProviderInfo = (provider: any): string => {
  if (!provider) return '';
  
  const parts = [
    provider.name,
    provider.type && `(${provider.type})`,
    provider.frequency && `Frequency: ${provider.frequency}`,
    provider.focus && `Focus: ${provider.focus}`
  ].filter(Boolean);

  return parts.join('\n');
};

export const extractProviderType = (provider: any): string => {
  const PROVIDER_TYPES: { [key: string]: string } = {
    'gp': 'Family Physician',
    'pt': 'Physiotherapist',
    'ot': 'Occupational Therapist',
    'psych': 'Psychologist',
    'psyc': 'Psychiatrist',
    'mt': 'Massage Therapist'
  };

  if (!provider?.providerType) return '';
  return PROVIDER_TYPES[provider.providerType.toLowerCase()] || provider.providerType;
};