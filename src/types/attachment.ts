import { type UploadFile } from 'antd';

export interface CustomUploadFile extends UploadFile {
  bucket?: string;
  fileKey?: string;
}
