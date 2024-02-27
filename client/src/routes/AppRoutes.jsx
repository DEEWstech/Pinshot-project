import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Home, Explore, Login, Signup, HomeUser, PinDetails } from "@pages";
import { Suspense, lazy } from "react";
import { Spinner } from "@utils";
import ProtectedRoutes from "./ProtectedRoutes";

const Root = lazy(() => import("@layouts/Root"));

const token = localStorage.getItem("userToken");

export default function AppRoutes() {
  const routes = [
    {
      path: "/",
      name: "Home",
      element: token ? <HomeUser /> : <Home />,
    },
    {
      path: "explore",
      name: "Explore",
      element: <Explore />,
    },
    {
      path: "login",
      name: "Login",
      element: <Login />,
    },
    {
      path: "Signup",
      name: "Signup",
      element: <Signup />,
    },
    {
      path: "pin/:pinId",
      name: "PinDetails",
      element: <PinDetails />,
    },
  ];
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Suspense fallback={<Spinner text="PINSHOT" />}>
          <Root />
        </Suspense>
      ),
      children: routes.map((route) => ({
        index: route.path === "/",
        path: route.path === "/" ? undefined : route.path,
        element: route.element,
      })),
    },
  ]);
  return <RouterProvider router={router} />;
}
