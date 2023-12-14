export interface ApplicationListRes {
  id: number;
  uuid: string;
  name: string;
  created_at: number;
  updated_at: number;
}

export interface ApplicationCreateReq {
  name: string;
}

export interface ApplicationEditReq {
  name: string;
}

export interface ApplicationCreateRes {
  id: number;
  uuid: string;
  name: string;
  organization_id: number;
  created_at: number;
}

export interface ApplicationViewRes {
  id: number;
  uuid: string;
  name: string;
  organization_id: number;
  created_at: number;
  updated_at: number;
}

export interface ApplicationGetMasterApiKeyReq {
  password: string;
}

export interface ApplicationGetMasterApiKeyRes {
  master_api_key: string;
}
