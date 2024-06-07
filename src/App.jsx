import { useState, useEffect } from "react";
import "./assets/fonts/Iosevka.css"
import "./App.css";
import PartData from "./lib/PartData";

function debugHandler(event) {

	console.log(PartData.getEngineStats());

}

function App() {

	// Will run any enclosed function when a dependency changes
	// This one has no dependencies so it'll run once on startup
	useEffect(() => {

		PartData.parseEngineData().then((value) => {
			console.log(PartData.getEngineStats());
			console.log("Initialised");
		});

	// Defining dependencies, of which there aren't any, hence the empty array
	// This won't change, though, so it'll just run once on startup
	},[]);

	return (
		<>
		<button onClick={debugHandler}>Click me</button>
		</>
	)
};

export default App;
