export interface AccountRes {
  email: string;
  first_name: string;
  last_name: string;
  organization_id: number;
}

export interface AccountSignInReq {
  email: string;
  password: string;
}

export interface AccountSignInRes {
  token: string;
}
