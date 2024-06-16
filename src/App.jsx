import { useState, useEffect } from "react";
import "./assets/fonts/Iosevka.css"
import "./App.css";
import PartData from "./lib/PartData";
import Plotter from "./lib/Plotter";
// import StatsPlot from "./lib/StatsPlot";
// import EnginePlotter from "./lib/EnginePlotter";

function App() {

	const [engineStats, setEngineStats] = useState(null);

	// Will run any enclosed function when a dependency changes
	// This one has no dependencies so it'll run once on startup
	useEffect(() => {
		PartData.initaliseData().then((values) => {
			setEngineStats(PartData.getEngineStats());
		});

	// Defining dependencies, of which there aren't any, hence the empty array
	// This won't change, though, so it'll just run once on startup
	},[]);

	return (
		engineStats
		? <Plotter newData={engineStats} />
		: <p>Loading...</p>
	)
};

export default App;
