import { useState, useEffect } from "react";

import Loader from "../components/Loader";

import BASE_API_URL from "../constants/BASE_API_URL";

const Dashboard = () => {
	const [bannerDescription, setBannerDescription] = useState("");
	const [bannerTimer, setBannerTimer] = useState(10);
	const [bannerLink, setBannerLink] = useState("");
	const [isBannerVisible, setIsBannerVisible] = useState(true);
	const [errors, setErrors] = useState({});
	const [isLoading, setisLoading] = useState(false);

	useEffect(() => {
		const fetchBannerData = async () => {
			try {
				setisLoading(true);
				const response = await fetch(BASE_API_URL + "/banners");
				if (response.ok) {
					const data = await response.json();
					if (data) {
						setBannerDescription(data.description);
						setBannerTimer(data.timer);
						setBannerLink(data.link);
						setIsBannerVisible(data.isVisible);
					}
				} else {
					console.error("Failed to fetch banner data");
				}
			} catch (error) {
				console.error("Error fetching banner data:", error);
			} finally {
				setisLoading(false);
			}
		};

		fetchBannerData();
	}, []);

	const validateFields = () => {
		const newErrors = {};

		if (bannerDescription.trim() === "") {
			newErrors.description = "Banner description is required.";
		}

		if (bannerTimer <= 0) {
			newErrors.timer = "Banner timer must be a positive number.";
		}

		if (bannerLink.trim() === "" || !/^https?:\/\/.*\..*/.test(bannerLink)) {
			newErrors.link = "A valid banner link is required.";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleUpdateBanner = async (e) => {
		e.preventDefault();

		if (!validateFields()) return;

		const bannerData = {
			description: bannerDescription,
			timer: bannerTimer,
			link: bannerLink,
			isVisible: Boolean(isBannerVisible),
		};

		try {
			setisLoading(true);
			const response = await fetch(BASE_API_URL + "/banners", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(bannerData),
			});

			if (response.ok) {
				alert("Banner updated successfully");
			} else {
				alert("Failed to update banner");
			}
		} catch (error) {
			console.error("Error updating banner:", error);
			alert("An error occurred while updating the banner.");
		} finally {
			setisLoading(false);
		}
	};

	return (
		<form onSubmit={handleUpdateBanner} className="p-4">
			<h2 className="text-2xl font-bold mb-4">Internal Dashboard</h2>

			<div className="mb-4">
				<label className="block mb-2">Banner Description:</label>
				<textarea
					value={bannerDescription}
					onChange={(e) => setBannerDescription(e.target.value)}
					className={`border p-2 w-full ${
						errors.description ? "border-red-500" : ""
					}`}
					required
				/>
				{errors.description && (
					<p className="text-red-500 text-sm">{errors.description}</p>
				)}
			</div>

			<div className="mb-4">
				<label className="block mb-2">Banner Timer (seconds):</label>
				<input
					type="number"
					value={bannerTimer}
					onChange={(e) => setBannerTimer(Number(e.target.value))}
					className={`border p-2 w-full ${
						errors.timer ? "border-red-500" : ""
					}`}
					required
				/>
				{errors.timer && <p className="text-red-500 text-sm">{errors.timer}</p>}
			</div>

			<div className="mb-4">
				<label className="block mb-2">Banner Link:</label>
				<input
					type="text"
					value={bannerLink}
					onChange={(e) => setBannerLink(e.target.value)}
					className={`border p-2 w-full ${errors.link ? "border-red-500" : ""}`}
					required
				/>
				{errors.link && <p className="text-red-500 text-sm">{errors.link}</p>}
			</div>

			<div className="mb-4">
				<label className="block mb-2">Banner On/Off:</label>
				<input
					type="checkbox"
					checked={isBannerVisible}
					onChange={(e) => setIsBannerVisible(e.target.checked)}
					className="mr-2"
				/>
				<span>{isBannerVisible ? "On" : "Off"}</span>
			</div>

			<button type="submit" className="bg-red-500 text-white py-2 px-4 rounded">
				Update Banner
			</button>
			<Loader isLoading={isLoading} />
		</form>
	);
};

export default Dashboard;
