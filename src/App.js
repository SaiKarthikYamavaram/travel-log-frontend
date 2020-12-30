import * as React from "react";
import { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { listLogEntries } from "./API";
import LogEntry from "./Components/LogEntry";

function App() {
	const [viewport, setViewport] = useState({
		width: "100vw",
		height: "100vh",
		latitude: 37.7577,
		longitude: -122.4376,
		zoom: 3,
	});

	const [showPopup, setShowPopup] = useState({});
	const [logEntries, setLogEntries] = useState([]);
	const [addEntryLocation, setAddEntryLocation] = useState(null);

	const getEntries = async () => {
		const logEntries = await listLogEntries();
		setLogEntries(logEntries);
	};
	useEffect(() => {
		(async () => {
			getEntries();
			// console.log(logEntries)
		})();
	}, []);
	const showAddMarkerPopup = (event) => {
		const [longitude, latitude] = event.lngLat;
		setAddEntryLocation({
			latitude,
			longitude,
		});
	};
	return (
		<ReactMapGL
			{...viewport}
			mapStyle='mapbox://styles/thecjreynolds/ck117fnjy0ff61cnsclwimyay'
			onViewportChange={setViewport}
			mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
			onDblClick={showAddMarkerPopup}>
			{logEntries.map((entry) => (
				<div key={entry._id}>
					<Marker latitude={entry.latitude} longitude={entry.longitude}>
						<div
							onClick={() => {
								setShowPopup({ [entry._id]: !showPopup[entry._id] });
							}}>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								style={{
									width: ` ${6 * viewport.zoom}px`,
									height: ` ${6 * viewport.zoom}px`,
								}}
								className='marker'
								viewBox='0 0 24 24'
								fill='#F3b73e'
								stroke='#F3b73e'
								strokeWidth='0'
								strokeLinecap='round'
								strokeLinejoin='round'>
								<path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'></path>
								<circle cx='12' cy='10' r='3' fill='black'></circle>
							</svg>
						</div>
					</Marker>

					{showPopup[entry._id] && (
						<Popup
							latitude={entry.latitude}
							longitude={entry.longitude}
							closeButton={true}
							closeOnClick={false}
							dynamicPosition={true}
							onClose={() => setShowPopup({})}
							anchor='top'>
							<div className='popup'>
								{entry.image && <img src={entry.image} alt={entry.title} />}
								<div className='content'>
									<h3>{entry.title}</h3>
									<div>{entry.comments}</div>
									<small>
										Visited on:{" "}
										{new Date(entry.visitedDate).toLocaleDateString()}
									</small>
								</div>
							</div>
						</Popup>
					)}
				</div>
			))}
			{addEntryLocation && (
				<>
					<Marker
						latitude={addEntryLocation.latitude}
						longitude={addEntryLocation.longitude}>
						<div>
							{/* <img src='https://i.imgur.com/y0G5YTX.png' alt='marker' /> */}
							<svg
								xmlns='http://www.w3.org/2000/svg'
								style={{
									width: ` ${6 * viewport.zoom}px`,
									height: ` ${6 * viewport.zoom}px`,
								}}
								className='marker'
								viewBox='0 0 24 24'
								fill='red'
								stroke='#F05305'
								strokeWidth='0'
								strokeLinecap='round'
								strokeLinejoin='round'>
								<path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'></path>
								<circle cx='12' cy='10' r='3' fill='#900000'></circle>
							</svg>
						</div>
					</Marker>
					<Popup
						latitude={addEntryLocation.latitude}
						longitude={addEntryLocation.longitude}
						closeButton={true}
						closeOnClick={false}
						dynamicPosition={true}
						onClose={() => setAddEntryLocation(null)}
						anchor='top'>
						<LogEntry
							onClose={() => {
								setAddEntryLocation(null);
								getEntries();
							}}
							location={addEntryLocation}
						/>
					</Popup>
				</>
			)}
		</ReactMapGL>
	);
}

export default App;
