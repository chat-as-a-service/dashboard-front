import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import './index.css';
import {
  createBrowserRouter,
  createRoutesFromChildren,
  matchRoutes,
  RouterProvider,
  useLocation,
  useNavigationType,
} from 'react-router-dom';
import SignInPage from './pages/auth/SignInPage';
import SignUpPage from './pages/auth/SignUpPage';
import OnboardingPage from './pages/onboarding/OnboardingPage';
import OnboardingCreateOrgSubPage from './pages/onboarding/OnboardingCreateOrgSubPage';
import OnboardingCreateAppSubPage from './pages/onboarding/OnboardingCreateAppSubPage';
import DashboardHomePage from './pages/DashboardHomePage';
import Root from './pages/Root';
import ApplicationRoot from './pages/application/ApplicationRoot';
import ApplicationOverviewPage from './pages/application/ApplicationOverviewPage';
import ApplicationUsersPage from './pages/user/UsersPage';
import CommonStore from './store/CommonStore';
import { injectStores } from '@mobx-devtools/tools';
import UserDetailPage from './pages/user/UserDetailPage';
import ApplicationSettingsRoot from './pages/application/ApplicationSettingsRoot';
import ApplicationSettingsGeneralPage from './pages/application/ApplicationSettingsGeneralPage';
import ChannelsPage from './pages/channel/ChannelsPage';
import NotFoundPage from './pages/common/NotFoundPage';
import ChannelChatPage from './pages/channel/ChannelChatPage';
import ProtectedRoute from './core/auth/ProtectedRoute';
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [
    new Sentry.BrowserTracing({
      // See docs for support of different versions of variation of react router
      // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      ),
    }),
    new Sentry.Replay(),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  tracesSampleRate: 1.0,

  // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ['localhost', /^https:\/\/.+wingflo\.com/],

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '',
        index: true,
        element: <DashboardHomePage />,
      },
      {
        path: ':appUuid',
        element: <ApplicationRoot />,
        children: [
          {
            path: 'overview',
            index: true,
            element: <ApplicationOverviewPage />,
          },
          {
            path: 'users',
            element: <ApplicationUsersPage />,
          },
          {
            path: 'users/:username',
            element: <UserDetailPage />,
          },
          {
            path: 'channels',
            element: <ChannelsPage />,
          },
          {
            path: 'channels/:channelUuid',
            element: <ChannelChatPage />,
          },
          {
            path: 'settings',
            element: <ApplicationSettingsRoot />,
            children: [
              {
                path: 'general',
                element: <ApplicationSettingsGeneralPage />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/auth/signin',
    element: <SignInPage />,
  },
  {
    path: '/auth/signup',
    element: <SignUpPage />,
  },
  {
    path: '/onboarding',
    element: (
      <ProtectedRoute>
        <OnboardingPage />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        path: 'organization',
        element: <OnboardingCreateOrgSubPage />,
      },
      {
        path: 'application',
        element: <OnboardingCreateAppSubPage />,
      },
    ],
  },
]);

const commonStore = new CommonStore();

injectStores({
  commonStore,
});
export const CommonStoreContext = createContext<CommonStore>(commonStore);

const colorPrimary = 'rgb(30 101 198)';
root.render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: colorPrimary,
        fontFamily: 'Inter, sans-serif',
      },
      components: {
        Table: {
          headerBg: 'rgba(0,0,0,0)',
          borderColor: '#E0E0E0',
          cellPaddingBlock: 12,
        },
        Layout: {
          headerBg: colorPrimary,
        },
      },
    }}
  >
    <CommonStoreContext.Provider value={commonStore}>
      <RouterProvider router={router} />
    </CommonStoreContext.Provider>
  </ConfigProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
