import React, { SetStateAction, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Button,
  Divider,
  Dropdown,
  Flex,
  Select,
  Space,
  theme,
  Typography,
} from 'antd';
import {
  HeaderAppSearchInput,
  HeaderCreateAppButton,
  RotatingDownOutlined,
} from './AppDropdown.styles';
import {
  CaretDownOutlined,
  CaretUpOutlined,
  CloseOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  ApplicationListRes,
  ApplicationViewRes,
} from '../../../types/application';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;
const AppDropdown = ({
  applications,
  selectedApplication,
  setIsAddAppModalOpen,
}: {
  applications: ApplicationListRes[];
  selectedApplication: ApplicationViewRes | null;
  setIsAddAppModalOpen: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const [headerAppDropdownOpen, setHeaderAppDropdownOpen] = useState(false);
  const [headerAppDropdownSearchText, setHeaderAppDropdownSearchText] =
    useState('');
  const [headerAppDropdownSortBy, setHeaderAppDropdownSortBy] =
    useState('recent');
  const [headerAppDropdownSortDir, setHeaderAppDropdownSortDir] = useState<
    'asc' | 'desc'
  >('desc');

  const navigate = useNavigate();
  const {
    token: { colorBgElevated, borderRadiusLG, boxShadowSecondary },
  } = theme.useToken();
  const contentStyle: React.CSSProperties = {
    backgroundColor: colorBgElevated,
    borderRadius: borderRadiusLG,
    boxShadow: boxShadowSecondary,
  };

  const menuStyle: React.CSSProperties = {
    boxShadow: 'none',
    width: 280,
    maxHeight: 320,
    overflow: 'hidden',
    padding: '8px 0',
  };
  return (
    <Dropdown
      menu={{
        items: [
          ...applications.map((app) => ({
            key: app.uuid,
            label: <Typography.Text ellipsis>{app.name}</Typography.Text>,
            style: { padding: '10px 15px', borderRadius: 0 },
          })),
        ],
        onClick: ({ key: appUuid }) => {
          navigate(`/${appUuid}/overview`);
        },
      }}
      trigger={['click']}
      open={headerAppDropdownOpen}
      onOpenChange={(open) => setHeaderAppDropdownOpen(open)}
      dropdownRender={(menu) => (
        <div
          style={{
            ...contentStyle,
            minWidth: 168,
            maxWidth: 280,
          }}
        >
          <HeaderAppSearchInput
            bordered={false}
            placeholder="Search"
            suffix={
              <Button
                type="text"
                icon={
                  headerAppDropdownSearchText.length > 0 ? (
                    <CloseOutlined />
                  ) : (
                    <SearchOutlined />
                  )
                }
                onClick={() => {
                  if (headerAppDropdownSearchText.length > 0) {
                    setHeaderAppDropdownSearchText('');
                  } else {
                  }
                }}
              />
            }
            value={headerAppDropdownSearchText}
            onChange={(e) =>
              setHeaderAppDropdownSearchText(e.currentTarget.value)
            }
          />
          <Divider style={{ margin: 0 }} />
          <Flex align="center" gap={0}>
            <Select
              style={{
                marginLeft: 3,
                padding: '5px 0',
                marginRight: -3,
              }}
              bordered={false}
              value={headerAppDropdownSortBy}
              onSelect={setHeaderAppDropdownSortBy}
              options={[
                { value: 'recent', label: 'Recently created' },
                { value: 'alphabetical', label: 'Alphabetical' },
              ]}
            />
            <div
              role="button"
              style={{
                position: 'relative',
                cursor: 'pointer',
                fontSize: 11,
                width: 18,
                height: 18,
              }}
              onClick={() =>
                setHeaderAppDropdownSortDir((prevDir) =>
                  prevDir === 'asc' ? 'desc' : 'asc',
                )
              }
            >
              <CaretUpOutlined
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 2,
                  color:
                    headerAppDropdownSortDir === 'asc'
                      ? 'var(--ant-color-primary)'
                      : '#858585',
                }}
              />
              <CaretDownOutlined
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 2,
                  color:
                    headerAppDropdownSortDir === 'desc'
                      ? 'var(--ant-color-primary)'
                      : '#858585',
                }}
              />
            </div>
          </Flex>
          <Divider style={{ margin: 0 }} />
          {React.cloneElement(menu as React.ReactElement, {
            style: menuStyle,
          })}
          <Divider style={{ margin: 0 }} />

          <div style={{ padding: '8px 4px' }}>
            <HeaderCreateAppButton
              type="text"
              onClick={() => setIsAddAppModalOpen(true)}
            >
              <Space align="center">
                <Text>Create application</Text>
                <PlusCircleOutlined />
              </Space>
            </HeaderCreateAppButton>
          </div>
        </div>
      )}
      align={{
        offset: [0, -1],
      }}
    >
      <Button
        type="text"
        size="large"
        onClick={(e) => e.preventDefault()}
        style={{
          color: '#fff',
          fontSize: 14,
          maxWidth: 160,
          textAlign: 'left',
        }}
      >
        <Space align="center" size={6}>
          <Text style={{ color: '#fff' }}>
            {selectedApplication != null
              ? selectedApplication.name
              : 'Select application'}
          </Text>
          <RotatingDownOutlined rotate={headerAppDropdownOpen ? 180 : 0} />
        </Space>
      </Button>
    </Dropdown>
  );
};

export default observer(AppDropdown);
