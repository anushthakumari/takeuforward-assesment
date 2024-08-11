const Loader = ({ isLoading }) => {
	if (!isLoading) return null;

	return (
		<div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
			<div className="w-16 h-16 border-4 border-t-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
		</div>
	);
};

export default Loader;
