import React, { memo } from "react";
import { useRoutes } from "react-router-dom";
import { useSelector } from "../../stores/rootReducer";
import { fetchCurrentRole } from "../../stores/users/selectors";
import { withNotification } from "../hoc/withAlertNotification";
import { AuthLayout } from "../layouts/AuthLayout/AuthLayout";
import { GuestLayout } from "../layouts/GuestLayout/GuestLayout";
import { AgentCusomerServiceUsers } from "../organisms/AgentCustomerServiceUsers/AgentCustomerSericeUsers";
import { Agents } from "../organisms/Agents/Agents";
import { AuthPage } from "../organisms/Auth/Auth";
import { ChangePassword } from "../organisms/ChangePassword/ChangePassword";

import { Referrals } from "../organisms/Referrals/Referrals";
import { MyVideos } from "../organisms/MyVideos/MyVideos";
import { Messenger } from "../organisms/Messenger/Messenger";
import { InboxScreen } from "../organisms/Inbox";
import { PageNotFound } from "../organisms/PageNotFound/PageNotFound";
import { VerifyEmail } from "../organisms/VerifyEmail/VerifyEmail";
import ProtectedRoute from "./ProtectedRoute";
import { AgentProfile } from "../organisms/AgentProfile/AgentProfile";

import { NewOrder } from "../organisms/NewOrder/NewOrder";
import { SelfLearning } from "../organisms/SelfLearning/SelfLearning";

import { Settings } from "../organisms/Settings/Settings";
import { Contacts } from "../organisms/Contacts/Contacts";
import { VideoDetails } from "../organisms/VideoDetails/VideoDetails";
import { Cart } from "../organisms/Cart/Cart";
import { Checkout } from "../organisms/Checkout/Checkout";
import { MyCourses } from "../organisms/MyCourses/MyCourses";
export const LazyLoadHome = React.lazy(() => import("../organisms/Home/Home"));
export const LazyLoadPublicAgentProfile = React.lazy(
  () => import("../organisms/PublicAgents/PublicAgents")
);
export const LazyLoadLogout = React.lazy(
  () => import("../organisms/Logout/Logout")
);
export const LazyLoadDashboard = React.lazy(
  () => import("../organisms/Dashboard/Dashboard")
);
export const LazyLoadResetPassword = withNotification(
  React.lazy(() => import("../organisms/ResetPassword/ResetPassword"))
);

const AuthWithNotification = withNotification(AuthPage);

const RouterView = () => {
  const role = useSelector((store) => fetchCurrentRole(store));

  const agentRoutes: { exact: boolean; path: string; element: JSX.Element }[] =
    [
      {
        exact: true,
        path: "users",
        element: <AgentCusomerServiceUsers />,
      },
      { exact: true, path: "referrals", element: <Referrals /> },
    ];

  const studentRoutes: {
    exact: boolean;
    path: string;
    element: JSX.Element;
  }[] = [
    {
      exact: true,
      path: "agents",
      element: <LazyLoadPublicAgentProfile />,
    },
    {
      exact: true,
      path: "agents/:id",
      element: <AgentProfile />,
    },
  ];

  const supportRoutes: {
    exact: boolean;
    path: string;
    element: JSX.Element;
  }[] = [
    {
      exact: true,
      path: "agents",
      element: <Agents />,
    },
  ];

  const guestRoutes = {
    path: "",
    exact: true,
    element: <GuestLayout />,
    children: [
      { exact: true, path: "*", element: <PageNotFound /> },
      { exact: true, path: "logout", element: <LazyLoadLogout /> },
      {
        exact: true,
        path: "auth/reset-password",
        element: <LazyLoadResetPassword enableNotification={true} />,
      },
      {
        exact: true,
        path: "reset-password/:id",
        element: (
          <ProtectedRoute
            reverse={true}
            authenticationPath="/"
            Component={ChangePassword}
          />
        ),
      },
      {
        exact: true,
        path: "verify-identity/:id",
        element: <VerifyEmail />,
      },
      {
        exact: true,
        path: "agents",
        element: <LazyLoadPublicAgentProfile />,
      },
      {
        exact: true,
        path: "agents/:id",
        element: <AgentProfile />,
      },
      {
        exact: true,
        path: "new-order",
        element: <NewOrder />,
      },
      {
        exact: true,
        path: "self-learning",
        element: <SelfLearning />,
      },
      {
        exact: true,
        path: "video-details",
        element: <VideoDetails />,
      },
      {
        exact: true,
        path: "cart",
        element: <Cart />,
      },
      {
        exact: true,
        path: "checkout",
        element: <Checkout />,
      },
      {
        exact: true,
        path: "",
        element: <LazyLoadHome />,
      },
      {
        exact: true,
        path: "auth",
        element: <AuthWithNotification enableNotification={true} />,
      },
    ],
  };

  //auth
  //dashboard

  const renderAuthRoutes = () => {
    if (role === "Student") return studentRoutes;
    if (role === "Agent") return agentRoutes;
    return supportRoutes;
  };
  const authRoutes = {
    path: "dashboard",
    element: <ProtectedRoute Component={AuthLayout} authenticationPath="/" />,
    children: [
      { exact: true, path: "*", element: <PageNotFound /> },
      { exact: true, path: "messenger", element: <Messenger /> },
      { exact: true, path: "my-videos", element: <MyVideos /> },
      { exact: true, path: "my-courses", element: <MyCourses /> },
      { exact: true, path: "messenger-design", element: <InboxScreen /> },
      { exact: true, path: "contacts", element: <Contacts /> },
      {
        exact: true,
        path: "agents",
        element: <LazyLoadPublicAgentProfile />,
      },
      {
        exact: true,
        path: "agents/:id",
        element: <AgentProfile />,
      },

      { exact: true, path: "settings", element: <Settings /> },
      {
        exact: true,
        path: "",
        element: <LazyLoadDashboard />,
      },
      ...renderAuthRoutes(),
    ],
  };

  const routes = useRoutes([authRoutes, guestRoutes]);
  return <>{routes}</>;
};
export default memo(RouterView);
