import React, { useContext, useEffect, useMemo } from 'react';
import { Layout, Spin } from 'antd';
import {
  Outlet,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom';
import styled from 'styled-components';
import { AccountRepository } from '../repository/AccountRepository';
import { AccountRes } from '../types/account';
import { OrganizationViewRes } from '../types/organization';
import { OrganizationRepository } from '../repository/OrganizationRepository';
import { ApplicationListRes } from '../types/application';
import { ApplicationRepository } from '../repository/ApplicationRepository';
import { CommonStoreContext } from '../index';
import { observer } from 'mobx-react-lite';
import axios from 'axios';
import { AddApplicationModal } from '../components/application/AddApplicationModal';
import GlobalHeader from '../components/common/GlobalHeader';

const { Header, Content } = Layout;

const CustomContent = styled(Content)`
  display: flex;
  flex-direction: column;

  & h1 {
    font-size: 20px;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.25px;
    margin: 0;
  }
`;

type ContextType = {
  account?: AccountRes;
  organization?: OrganizationViewRes;
  applications: ApplicationListRes[];
  setApplications: React.Dispatch<React.SetStateAction<ApplicationListRes[]>>;
};

const NotificationContext = React.createContext({
  name: 'NotificationContext',
});

const Root = () => {
  const [isAddAppModalOpen, setIsAddAppModalOpen] = React.useState(false);

  const navigate = useNavigate();
  const [applications, setApplications] = React.useState<ApplicationListRes[]>(
    [],
  );
  let { appUuid } = useParams();
  const commonStore = useContext(CommonStoreContext);

  useEffect(() => {
    const accessToken = window.localStorage.getItem('accessToken');
    if (accessToken == null) {
      navigate('/auth/signin');
    } else {
      (async () => {
        try {
          commonStore.account = await AccountRepository.whoAmI();
          commonStore.organization =
            await OrganizationRepository.getOrganization(
              commonStore.account.organization_id,
            );
          commonStore.applications =
            await ApplicationRepository.listApplications();
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response) {
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            }
          }
          navigate('/auth/signin');
        }
      })();
    }
  }, []);

  useEffect(() => {
    if (appUuid == null) return;
    (async () => {
      await ApplicationRepository.viewApplicationByUuid(appUuid);
    })();
  }, [appUuid]);

  const notificationContextValue = useMemo(
    () => ({ name: 'NotificationContext' }),
    [],
  );
  if (commonStore.account == null || commonStore.organization == null)
    return <Spin></Spin>;

  return (
    <NotificationContext.Provider value={notificationContextValue}>
      <Layout
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        <GlobalHeader setIsAddAppModalOpen={setIsAddAppModalOpen} />
        <CustomContent>
          <Outlet
            context={{
              account: commonStore.account,
              organization: commonStore.organization,
              applications,
              setApplications,
            }}
          />
        </CustomContent>
      </Layout>

      <AddApplicationModal
        open={isAddAppModalOpen}
        onOk={() => setIsAddAppModalOpen(false)} // todo: change into real logic
        onCancel={() => setIsAddAppModalOpen(false)}
        organizationId={commonStore.account.organization_id}
      />
    </NotificationContext.Provider>
  );
};
export default observer(Root);

export function useTypedOutletContext() {
  return useOutletContext<ContextType>();
}
