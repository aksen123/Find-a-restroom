export interface PublicRestroom {
  id: number;
  category: string;
  basis: string;
  toiletName: string;
  addressRoad: string;
  addressJibun: string;
  maleToiletCount: number;
  maleUrinalCount: number;
  maleDisabledToiletCount: number;
  maleDisabledUrinalCount: number;
  maleChildToiletCount: number;
  maleChildUrinalCount: number;
  femaleToiletCount: number;
  femaleDisabledToiletCount: number;
  femaleChildToiletCount: number;
  managementAgency: string;
  phoneNumber: string;
  openingHours: string;
  detailedOpeningHours: string;
  installationYearMonth: string;
  latitude: number;
  longitude: number;
  ownership: string;
  wasteTreatment: string;
  safetyManagementFacility: string;
  emergencyBell: string;
  emergencyBellLocation: string;
  cctv: string;
  diaperChangingStation: string;
  diaperChangingStationLocation: string;
  remodelingYearMonth: string;
  dataDate: Date;
}

export interface Lng_Lat {
  La: number;
  Ma: number;
}
