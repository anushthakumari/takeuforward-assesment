import { useState, useEffect } from "react";

import Loader from "../components/Loader";

import BASE_API_URL from "../constants/BASE_API_URL";

const BannerContent = () => {
	const [isVisible, setIsVisible] = useState(true);
	const [timeLeft, setTimeLeft] = useState(10);
	const [bannerDescription, setBannerDescription] = useState("");
	const [bannerLink, setBannerLink] = useState("");
	const [isLoading, setisLoading] = useState(false);

	useEffect(() => {
		const fetchBannerData = async () => {
			try {
				setisLoading(true);
				const response = await fetch(BASE_API_URL + "/banners");
				const banner = await response.json();

				setIsVisible(banner.isVisible);
				setTimeLeft(banner.timer);
				setBannerDescription(banner.description);
				setBannerLink(banner.link);
			} catch (error) {
				console.error("Failed to fetch banner data:", error);
			} finally {
				setisLoading(false);
			}
		};

		fetchBannerData();
	}, []);

	useEffect(() => {
		if (!isVisible) return;

		const timer = setInterval(() => {
			setTimeLeft((prevTime) => {
				if (prevTime <= 1) {
					clearInterval(timer);
					setIsVisible(false);
					return 0;
				}
				return prevTime - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [isVisible]);

	return (
		<div className="min-h-screen flex flex-col justify-center items-center bg-white/[7%]">
			{isVisible ? (
				<a
					href={bannerLink}
					className="mt-4 text-blue-500 underline"
					target="_blank"
					rel="noopener noreferrer">
					<div className="bg-red-500 text-white text-center p-4">
						<p className="text-lg">{bannerDescription}</p>
					</div>
				</a>
			) : (
				<p className="">Banner has been disappeared!</p>
			)}
			{isVisible && (
				<div className="mt-4 bg-red-700 text-white p-2 rounded">
					<p>Banner will be disappeared in : {timeLeft} seconds</p>
				</div>
			)}
			<Loader isLoading={isLoading} />
		</div>
	);
};

export default BannerContent;
