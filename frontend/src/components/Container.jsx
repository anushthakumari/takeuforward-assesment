const Container = ({ children }) => {
	return (
		<div
			className="flex flex-col gap-y-6
    relative w-full min-h-screen p-8 md:p-12 mx-auto md:max-w-3xl md:mx-auto lg:max-w-4xl lg:py-16
    text-content selection:bg-selection">
			{children}
		</div>
	);
};

export default Container;
