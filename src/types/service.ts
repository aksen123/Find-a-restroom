export interface PublicRestroom {
  id: number;
  category: string;
  basis: string;
  toilet_name: string;
  address_road: string;
  address_jibun: string;
  male_toilet_count: number;
  male_urinal_count: number;
  male_disabled_toilet_count: number;
  male_disabled_urinal_count: number;
  male_child_toilet_count: number;
  male_child_urinal_count: number;
  female_toilet_count: number;
  female_disabled_toilet_count: number;
  female_child_toilet_count: number;
  management_agency: string;
  phone_number: string;
  opening_hours: string;
  detailed_opening_hours: string;
  installation_year_month: string;
  latitude: number;
  longitude: number;
  ownership: string;
  waste_treatment: string;
  safety_management_facility: string;
  emergency_bell: string;
  emergency_bell_location: string;
  cctv: string;
  diaper_changing_station: string;
  diaper_changing_station_location: string;
  remodeling_year_month: string;
  data_date: Date;
}

export interface Lng_Lat {
  La: number;
  Ma: number;
}
