// d3 will only be used as a processing library
// React will be used for rendering content to the DOM
import * as d3 from "d3";
import EngineDatum from "./EngineDatum.jsx";
import "./StatsPlot.css";
import { useState } from "react";

export default function StatsPlot({data = []}) {

	const [xRange, setXRange] = useState([0, 400]);
	const [yRange, setYRange] = useState([0, 30]);

	// Get our engine stats
	const stats = data;

	// Create our x-scale
	const xScale = d3.scaleLinear()
		.domain(xRange)	// Our data range
		.range([0, 100])	// The output range

	// Create our y-scale
	const yScale = d3.scaleLinear()
		.domain(yRange)	// Our data range
		.range([100, 0])	// The output range

	// Calculate TWR for all our engines
	for (let engine of data) {
		engine.twr_asl = engine.thrust_asl / (engine.mass * 9.81);
		engine.twr_vac = engine.thrust_vac / (engine.mass * 9.81);
	}

	function handleRangeChange(event) {
		switch (event.target.name) {

			case "xRangeMin":
				setXRange([event.target.value, xRange[1]])
				break;

			case "xRangeMax":
				setXRange([xRange[0], event.target.value])
				break;

			case "yRangeMin":
				setYRange([event.target.value, yRange[1],])
				break;

			case "yRangeMax":
				setYRange([yRange[0], event.target.value])
				break;
		}
	}

	return (
		<div className="plotFrame">

		<div className="plotSettings">
			<form>
				<label for="xRangeMin">X from</label>
				<input type="number" id="xRangeMin" name="xRangeMin" min="0" value={xRange[0]} onChange={handleRangeChange}/>
				<label for="xRangeMax">X to</label>
				<input type="number" id="xRangeMax" name="xRangeMax" min={xRange[0]} value={xRange[1]} onChange={handleRangeChange}/>
				<br/>
				<label for="yRangeMin">Y from</label>
				<input type="number" id="yRangeMin" name="yRangeMin" min="0" value={yRange[0]} onChange={handleRangeChange}/>
				<label for="yRangeMax">Y to</label>
				<input type="number" id="yRangeMax" name="yRangeMax" min={yRange[0]} value={yRange[1]} onChange={handleRangeChange}/>
			</form>
		</div>

		<svg className="plot"
			width="400" height="30"
			preserveAspectRatio="xMidYMid meet">
			
			{data.map((engine, index) => 
				<g key={index}>
					<line x1={`${xScale(engine.isp_asl)}%`}
						  y1={`${yScale(engine.twr_asl)}%`}
						  x2={`${xScale(engine.isp_vac)}%`}
						  y2={`${yScale(engine.twr_vac)}%`}
						  stroke="red" 
						  strokeWidth="1"
						  opacity="0.5" />
					<circle 
						cx={`${xScale(engine.isp_vac)}%`}
						cy={`${yScale(engine.twr_vac)}%`}
						r={engine.cost ** 0.3}
						fill="red"
						opacity="0.8"/>
					<text
						x={`${xScale(engine.isp_vac)}%`}
						y={`${yScale(engine.twr_vac)}%`}
						className="datumLabel">
						{engine.name_nick}
					</text>
				</g>
			)}
	  	</svg>
		</div>
	)
}
