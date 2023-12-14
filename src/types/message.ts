export type MentionType = 'USERS' | 'CHANNEL';

interface User {
  username: string;
  nickname: string;
}

export interface MessageType {
  uuid: string;
  message: string;
  user: User;
  channel_uuid: string;
  thread_info?: ThreadInfo;
  reactions: ReactionType[];
  mention_type?: MentionType;
  mentioned_users: User[];
  og_tag?: OpenGraphTag;
  attachments: Attachment[];
  parent_message_uuid?: string;
  created_at: number;
  updated_at: number;
}

interface Attachment {
  original_file_name: string;
  content_type: string;
  download_signed_url: string;
}

export interface OpenGraphTag {
  url: string;
  title: string;
  description?: string;
  image?: string;
  image_width?: number;
  image_height?: number;
  image_alt?: string;
}

export interface ThreadInfo {
  reply_count: number;
  most_replies: User[];
  last_replied_at: number;
  updated_at: number;
}

export interface ReactionType {
  reaction: string;
  user: User;
  created_at: number;
}
