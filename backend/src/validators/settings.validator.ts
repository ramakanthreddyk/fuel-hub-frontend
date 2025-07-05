export interface SettingsInput {
  receiptTemplate?: string;
  fuelRounding?: number;
  brandingLogoUrl?: string;
}

export function validateUpdateSettings(data: any): SettingsInput {
  const { receiptTemplate, fuelRounding, brandingLogoUrl } = data || {};
  const result: SettingsInput = {};
  if (receiptTemplate && typeof receiptTemplate === 'string') {
    result.receiptTemplate = receiptTemplate;
  }
  if (fuelRounding !== undefined) {
    const n = parseInt(fuelRounding, 10);
    if (isNaN(n)) {
      throw new Error('fuelRounding must be a number');
    }
    result.fuelRounding = n;
  }
  if (brandingLogoUrl && typeof brandingLogoUrl === 'string') {
    result.brandingLogoUrl = brandingLogoUrl;
  }
  if (
    result.receiptTemplate === undefined &&
    result.fuelRounding === undefined &&
    result.brandingLogoUrl === undefined
  ) {
    throw new Error('No update fields');
  }
  return result;
}
