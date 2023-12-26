import React, { useRef, useState } from 'react';
import {
  Button,
  ConfigProvider,
  Flex,
  Mentions,
  Space,
  Typography,
  Upload,
} from 'antd';
import defaultUserImg from '../../static/images/default-user-image-1.svg';
import {
  PaperClipOutlined,
  SendOutlined,
  SettingFilled,
} from '@ant-design/icons';
import styled from 'styled-components';
import { CustomUploadFile } from '../../types/attachment';
import { useOutsideAlerter } from '../../hooks/useOutsideAlerter';

const { Text } = Typography;

const Box = styled.div<{
  $focusBorderColor: string;
  $focused: boolean;
}>`
  max-width: 956px;
  padding: 16px 8px 8px;
  border-radius: 4px;
  box-shadow:
    ${(props) =>
        props.$focused && `0 0 0 1px ${props.$focusBorderColor} inset,`}
      0 1px 5px 0 rgba(13, 13, 13, 0.12),
    0 0 1px 0 rgba(13, 13, 13, 0.16),
    0 2px 2px 0 rgba(13, 13, 13, 0.08);
`;

export const ChatInputBox = ({
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

  const chatBoxRef = useRef(null);
  useOutsideAlerter(chatBoxRef, () => setChatBoxFocused(false));
  return (
    <Box
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
          onKeyPress={(e) => {
            if (
              e.currentTarget.value.trim() !== '' &&
              e.key === 'Enter' &&
              !e.shiftKey
            ) {
              onSendMessage(e.currentTarget.value);
              setChatInput('');
            } else {
              setChatInput(e.currentTarget.value);
            }
            // e.preventDefault();
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
          />
        </Space>
      </Flex>
    </Box>
  );
};
