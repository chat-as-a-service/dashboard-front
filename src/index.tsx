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

// const colorPrimary = 'rgb(30 101 198)';

const colorPrimary = '#3B60E4';
root.render(
  <ConfigProvider
    theme={{
      cssVar: true,
      token: {
        colorPrimary: colorPrimary,
        colorInfo: colorPrimary,
        colorSuccess: '#00e070',
        colorWarning: '#ffdd1f',
        colorError: '#e72535',
        colorTextBase: '#0d0d0d',
        colorBorder: '#e0e0e0',
        colorBorderSecondary: '#E0E0E0',
        colorBgLayout: '#ffffff',
        borderRadius: 4,
        colorBgContainer: '#ffffff',
        fontFamily: 'Inter, sans-serif',
        colorText: '#0d0d0d',
        lineHeight: 1.43,
      },
      components: {
        Button: {
          fontWeight: 600,
          defaultColor: 'rgb(94, 94, 94)',
          defaultBorderColor: 'rgb(204, 204, 204)',
          borderColorDisabled: 'rgb(224, 224, 224)',
          contentFontSizeLG: 14,
        },
        Divider: {
          colorSplit: 'rgb(224, 224, 224)',
        },
        Input: {
          colorBorder: 'rgb(204, 204, 204)',
          colorText: 'rgb(13, 13, 13)',
          fontSizeLG: 14,
          colorBgContainerDisabled: 'rgb(224, 224, 224)',
          colorTextDisabled: 'rgb(94, 94, 94)',
          paddingInlineLG: 16,
        },
        Table: {
          headerBg: 'rgb(255, 255, 255)',

          cellPaddingBlock: 12,
          headerColor: 'rgb(13, 13, 13)',
          headerSplitColor: 'rgb(255, 255, 255)',
          borderColor: 'rgb(224, 224, 224)',
        },
        Modal: {
          titleFontSize: 20,
          titleLineHeight: 1.2,
        },
        Layout: {
          headerBg: colorPrimary,
          siderBg: '#f7f7f7',
          triggerBg: '#f7f7f7',
          triggerColor: '#5E5E5E',
        },
        Menu: {
          itemBorderRadius: 8,
          itemMarginInline: 8,
        },
        Descriptions: {
          colorSplit: '#E0E0E0',
          colorTextSecondary: '#0D0D0D',
        },
        Checkbox: {
          colorBorder: 'rgb(94, 94, 94)',
          borderRadiusSM: 2,
          lineWidth: 2,
          controlInteractiveSize: 18,
        },
        Typography: {
          titleMarginTop: 0,
          titleMarginBottom: 0,
          fontSizeHeading3: 16,
        },
        Select: {
          optionSelectedFontWeight: 600,
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
