export interface ChannelListRes {
  id: number;
  uuid: string;
  name: string;
  application_id: number;
  max_members: number;
  user_count: number;
  last_message_at?: number;
  created_at: number;
  updated_at: number;
}

export interface ChannelCreateReq {
  name: string;
  application_id: number;
}

export interface ChannelCreateRes {
  id: number;
  uuid: string;
  max_members: number;
  name: string;
  application_id: number;
  created_at: number;
  updated_at: number;
}
