import { Navigate } from 'react-router-dom';
import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { CommonStoreContext } from '../../index';

const ProtectedRoute = ({ children }: React.PropsWithChildren) => {
  const commonStore = useContext(CommonStoreContext);
  const { account } = commonStore;

  if (account) {
    return children;
  }

  return <Navigate to="/auth/signin" />;
};

// @ts-ignore
export default observer(ProtectedRoute);
