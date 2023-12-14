export interface OrganizationViewRes {
  id: number;
  name: string;
  num_apps_in_org: number;
  max_applications: number;
  created_at: number;
  updated_at: number;
}

export interface OrganizationCreateReq {
  name: string;
}

export interface OrganizationCreateRes {
  name: string;
}
