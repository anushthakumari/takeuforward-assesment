import { createBrowserRouter, RouterProvider } from "react-router-dom";

import BannerContent from "./pages/BannerContent";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./layouts/MainLayout";

import "./index.css";

const router = createBrowserRouter([
	{
		path: "/",
		element: <MainLayout />,
		children: [
			{
				path: "/",
				element: <BannerContent />,
			},
			{
				path: "/dashboard",
				element: <Dashboard />,
			},
		],
	},
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
