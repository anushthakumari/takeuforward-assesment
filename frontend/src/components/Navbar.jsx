import { Link } from "react-router-dom";

const Navbar = () => {
	return (
		<nav className="bg-gray-800 p-4">
			<div className="container mx-auto flex justify-between items-center">
				<div className="text-white text-xl font-bold">takeUforward</div>
				<div className="space-x-4">
					<Link to="/" className="text-gray-300 hover:text-white">
						Banner Page
					</Link>
					<Link to="/dashboard" className="text-gray-300 hover:text-white">
						Internal Dashboard
					</Link>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
