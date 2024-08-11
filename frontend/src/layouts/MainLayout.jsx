import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<div className="container mx-auto p-4 flex-grow">
				<Outlet />
			</div>
		</div>
	);
};

export default MainLayout;
