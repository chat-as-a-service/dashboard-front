export interface UserListRes {
  id: number;
  username: string;
  nickname: string;
  application_id: number;
  created_at: number;
  updated_at: number;
}

export interface UserCreateReq {
  application_id: number;
  username: string;
  nickname: string;
}

export interface UserCreateRes {
  id: number;
  username: string;
  nickname: string;
  application_id: number;
  created_at: number;
  updated_at: number;
}

export interface UserCreateSessionTokenReq {
  username: string;
  application_id: number;
}

export interface UserCreateSessionTokenRes {
  session_token: string;
}

export interface UserViewRes {
  id: number;
  username: string;
  nickname: string;
  application_id: number;
  created_at: number;
  updated_at: number;
}

export interface UserDeleteReq {
  application_id: number;
  deleting_usernames: string[];
}
