import React, { useContext, useRef, useState } from 'react';
import {
  Button,
  ConfigProvider,
  Flex,
  Mentions,
  Space,
  Typography,
  Upload,
} from 'antd';
import defaultUserImg from '../../../static/images/default-user-image-1.svg';
import {
  PaperClipOutlined,
  SendOutlined,
  SettingFilled,
} from '@ant-design/icons';
import { CustomUploadFile } from '../../../types/attachment';
import { useOutsideAlerter } from '../../../hooks/useOutsideAlerter';
import SC from './ChatInputBox.styles';
import { observer } from 'mobx-react-lite';
import { ChatStoreContext } from '../../../pages/application/ApplicationRoot';

const { Text } = Typography;

const ChatInputBox = ({
  chatBoxBorderColor,
  style,
  onSendMessage,
  onUpload,
  uploadFiles,
  onUploadRemove,
}: {
  chatBoxBorderColor: string;
  style?: React.CSSProperties;
  onSendMessage: (message: string) => void;
  onUpload: (file: CustomUploadFile) => void;
  uploadFiles: CustomUploadFile[];
  onUploadRemove: (file: CustomUploadFile) => void;
}) => {
  const [chatBoxFocused, setChatBoxFocused] = useState(false);
  const [chatInput, setChatInput] = useState('');

  const chatStore = useContext(ChatStoreContext);

  const chatBoxRef = useRef(null);
  useOutsideAlerter(chatBoxRef, () => setChatBoxFocused(false));

  return (
    <SC.Box
      $focusBorderColor={chatBoxBorderColor}
      $focused={chatBoxFocused}
      onClick={() => setChatBoxFocused(true)}
      ref={chatBoxRef}
      style={style}
    >
      <Flex justify="space-between">
        <Button type="text" style={{ paddingTop: 0 }} size="small">
          <Flex gap={4} align="center">
            <img
              src={defaultUserImg}
              width={16}
              height={16}
              style={{ borderRadius: '50%' }}
              alt="user"
            />
            <Text strong style={{ fontSize: 12 }}>
              user
            </Text>
            <SettingFilled style={{ fontSize: 10 }} />
          </Flex>
        </Button>
      </Flex>

      <ConfigProvider
        theme={{
          components: {
            Mentions: {
              lineWidth: 0,
              borderRadius: 0,
              activeShadow: 'none',
            },
          },
        }}
      >
        <Mentions
          autoSize={{
            minRows: 1,
            maxRows: 5,
          }}
          placeholder="Enter message"
          value={chatInput}
          onChange={setChatInput}
          onPressEnter={(e) => {
            if (chatStore.sendMessageState === 'pending') return;
            const inputTextArea = e.currentTarget;
            if (e.shiftKey) {
              inputTextArea.scrollTop = inputTextArea.scrollHeight + 1000;
            } else if (inputTextArea.value.trim() === '') {
              e.preventDefault();
              return;
            } else {
              e.preventDefault();
              onSendMessage(inputTextArea.value);
              setChatInput('');
            }
            inputTextArea.focus();
          }}
        />
      </ConfigProvider>
      <Flex justify="space-between">
        <div>
          <Upload
            listType="picture"
            fileList={uploadFiles}
            beforeUpload={onUpload}
            className="upload-list-inline"
            onRemove={onUploadRemove}
          >
            <Button
              icon={<PaperClipOutlined />}
              size="large"
              style={{ marginRight: 10, width: 50 }}
              type="text"
            />
          </Upload>
        </div>
        <Space>
          <Button
            type="text"
            icon={<SendOutlined />}
            disabled={chatInput.length === 0}
            onClick={() => onSendMessage(chatInput)}
            loading={chatStore.sendMessageState === 'pending'}
          />
        </Space>
      </Flex>
    </SC.Box>
  );
};

export default observer(ChatInputBox);
