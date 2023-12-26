import React from 'react';
import { observer } from 'mobx-react-lite';
import { Upload } from 'antd';
import { MessageType } from '../../../types/message';

const UploadFiles = ({ message }: { message: MessageType }) => {
  if (message.attachments.length === 0) return null;
  return (
    <Upload
      listType="picture"
      className="upload-list-inline"
      defaultFileList={message.attachments.map((attachment, idx) => ({
        uid: idx.toString(),
        name: attachment.original_file_name,
        type: attachment.content_type,
        url: attachment.download_signed_url,
        status: 'done',
      }))}
    />
  );
};

export default observer(UploadFiles);
