import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  ConfigProvider,
  Descriptions,
  Input,
  notification,
  Space,
  Typography,
} from 'antd';
import { CommonStoreContext } from '../../index';
import { observer } from 'mobx-react-lite';
import { Utils } from '../../core/Util';
import { useParams } from 'react-router-dom';
import { UserRepository } from '../../repository/UserRepository';
import { UserViewRes } from '../../types/user';
import { DeleteApplicationModal } from '../../components/application/DeleteApplicationModal';
import { ConfirmPasswordModal } from '../../components/common/ConfirmPasswordModal';
import { ApplicationRepository } from '../../repository/ApplicationRepository';

const { Text, Title } = Typography;

const ApplicationSettingsGeneralPage = () => {
  const [isDeleteUserModalOpen, setDeleteUserModalOpen] = React.useState(false);
  const [isConfirmPasswordModalOpen, setConfirmPasswordModalOpen] =
    React.useState(false);
  const [masterApiToken, setMasterApiToken] = React.useState('');
  const [user, setUser] = useState<UserViewRes>();
  const commonStore = useContext(CommonStoreContext);
  const { selectedApplication } = commonStore;
  const { username } = useParams();
  const [api, contextHolder] = notification.useNotification();
  const handleDeleteUserModalOk = async () => {
    setDeleteUserModalOpen(false);
    setTimeout(() => {
      window.location.href = `/${selectedApplication?.uuid}/users`;
    }, 500);
  };
  const handleConfirmPasswordModalOk = async (
    password: string,
    setLoading: (open: boolean) => void,
  ) => {
    if (selectedApplication == null) return;
    setLoading(true);
    const apiKey = await ApplicationRepository.getApplicationMasterApiKey(
      selectedApplication.id,
      {
        password,
      },
    );
    setMasterApiToken(apiKey.master_api_key);
    setLoading(false);
    setConfirmPasswordModalOpen(false);
  };

  useEffect(() => {
    const { selectedApplication } = commonStore;
    if (selectedApplication == null) return;
    (async () => {})();
  }, [commonStore.selectedApplication]);

  useEffect(() => {
    if (selectedApplication == null || username == null) return;
    (async () => {
      setUser(await UserRepository.viewUser(selectedApplication.id, username));
    })();
  }, [username, selectedApplication]);

  useEffect(() => {
    return () => {
      setMasterApiToken('');
    };
  }, []);

  return (
    <ConfigProvider
      theme={{
        components: {
          Descriptions: {
            labelBg: 'transparent',
            titleMarginBottom: 12,
          },
        },
      }}
    >
      {contextHolder}
      <div style={{ display: 'inline-block' }}>
        <div style={{ width: 980 }}>
          <Title level={4} style={{ margin: '5px 0 30px 0' }}>
            General
          </Title>
          <Descriptions
            column={1}
            style={{ marginBottom: 40 }}
            labelStyle={{
              width: '50%',
              border: 0,
              fontWeight: 'bold',
            }}
            bordered
            items={[
              {
                key: 'app_id',
                label: 'Application ID',
                children: (
                  <Input
                    size="large"
                    disabled
                    value={selectedApplication?.uuid?.toUpperCase()}
                  />
                ),
              },
              {
                key: 'app_name',
                label: 'Application name',
                children: (
                  <Input size="large" value={selectedApplication?.name} />
                ),
              },
              {
                key: 'create_at',
                label: 'Created on',
                children: (
                  <div>
                    {selectedApplication?.created_at &&
                      Utils.unixTsToDateTimeString(
                        selectedApplication.created_at,
                      )}
                  </div>
                ),
              },
            ]}
          />

          <Descriptions
            column={1}
            labelStyle={{
              width: '50%',
              border: 0,
            }}
            style={{ marginBottom: 40 }}
            bordered
            items={[
              {
                key: 'api_token',
                label: (
                  <div>
                    <Title level={5} style={{ margin: 0 }}>
                      API token
                    </Title>
                    <p>
                      <Text>
                        To be authenticated by the server, your request should
                        include one of the listed API tokens.
                      </Text>
                    </p>
                  </div>
                ),
                children: (
                  <div>
                    <ConfigProvider
                      theme={{
                        components: {
                          Input: {
                            colorBgContainer: '#E0E0E0',
                            fontSizeLG: 14,
                            colorText: '#5E5E5E',
                          },
                        },
                      }}
                    >
                      <Space.Compact block>
                        <Input
                          style={{ width: '100%' }}
                          value={
                            masterApiToken === ''
                              ? '●'.repeat(32)
                              : masterApiToken
                          }
                          size="large"
                        />
                        <Button
                          size="large"
                          onClick={async () => {
                            if (masterApiToken === '') {
                              setConfirmPasswordModalOpen(true);
                            } else {
                              await navigator.clipboard.writeText(
                                masterApiToken,
                              );

                              api.info({
                                message: `Master API Token copied.`,
                                placement: 'bottomLeft',
                              });
                            }
                          }}
                        >
                          {masterApiToken === '' ? 'Show' : 'Copy'}
                        </Button>
                      </Space.Compact>
                    </ConfigProvider>
                  </div>
                ),
              },
            ]}
          />

          <Descriptions
            column={1}
            labelStyle={{
              width: '50%',
              border: 0,
              fontWeight: 'bold',
            }}
            bordered
            items={[
              {
                key: 'delete_application',
                label: 'Delete application',
                children: (
                  <Button type="primary" size="large" danger>
                    Delete
                  </Button>
                ),
              },
            ]}
          />
        </div>
      </div>
      <ConfirmPasswordModal
        open={isConfirmPasswordModalOpen}
        onSubmit={handleConfirmPasswordModalOk}
        onCancel={() => setConfirmPasswordModalOpen(false)}
        subTitle="Enter your password to show the master API token."
      />
      <DeleteApplicationModal
        open={isDeleteUserModalOpen}
        onOk={handleDeleteUserModalOk}
        onCancel={() => setDeleteUserModalOpen(false)}
        application={commonStore.selectedApplication}
      />
    </ConfigProvider>
  );
};

export default observer(ApplicationSettingsGeneralPage);
