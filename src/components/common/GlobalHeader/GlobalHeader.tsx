import React, { SetStateAction, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Flex, Layout } from 'antd';
import { Link } from 'react-router-dom';
import LogoImg from '../../../static/images/wingflo-logo-white-wide-sm.png';
import { CommonStoreContext } from '../../../index';
import AppDropdown from './AppDropdown';
import AccountDropdown from './AccountDropdown';

const GlobalHeader = ({
  setIsAddAppModalOpen,
}: {
  setIsAddAppModalOpen: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const commonStore = useContext(CommonStoreContext);
  const {
    applications,
    selectedApplication,
    account,
    accountFullName,
    organization,
    signOut,
  } = commonStore;

  return (
    <Layout.Header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 48,
        paddingRight: '10px',
        paddingLeft: 20,
      }}
    >
      <Flex align="center" gap={8}>
        <Link to="/" style={{ lineHeight: 0 }}>
          <img alt="WingFlo logo" src={LogoImg} height={35} />
        </Link>

        <AppDropdown
          applications={applications}
          selectedApplication={selectedApplication}
          setIsAddAppModalOpen={setIsAddAppModalOpen}
        />
      </Flex>
      <AccountDropdown
        account={account}
        accountFullName={accountFullName}
        onSignOut={signOut}
        organization={organization}
      />
    </Layout.Header>
  );
};

export default observer(GlobalHeader);
