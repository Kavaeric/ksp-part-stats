import { useState, useEffect, useLayoutEffect, useRef } from "react";

import * as Scale from "@visx/scale";
import { Circle, Line } from "@visx/shape";
import { useParentSize, ParentSize } from "@visx/responsive";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { Text } from "@visx/text";

import "./Plotter.css";

// Main scatter plot...plotter
export default function Plotter({data}) {

	const [engineData, setEngineData] = useState(data);

	// Sets up a system to use parent size of container
	const { parentRef, width, height } = useParentSize({ debounceTime: 150 });

	// Calculate TWR of all our engines
	for (let engine of engineData) {
		engine.twr_asl = engine.thrust_asl / (engine.mass * 9.81);
		engine.twr_vac = engine.thrust_vac / (engine.mass * 9.81);
	}

	// Accessor functions for mapping the data to an X and Y value
	function dataX (data) { 
		return data.isp_vac;
	}
	function dataY (data) { 
		return data.twr_vac;
	}

	// Define our scales
	const xScale = Scale.scaleLinear({
		domain: [0, 400], // Data's min and max x-coordinate values
		range: [0, width], // Drawn graph's left and right extents
		round: true
	})
	const yScale = Scale.scaleLinear({
		domain: [0, 30], // Data's min and max x-coordinate values
		range: [height, 0], // Drawn graph's left and right extents; remember a graph's y-scale goes bottom to top
		round: true
	})

	// Compose scale and accessor functions to get point functions
	const compose = (scale, accessor) => engineData => scale(accessor(engineData));
	const xPoint = compose(xScale, dataX);
	const yPoint = compose(yScale, dataY);

	console.log(engineData.length);

	return (
		<div ref={parentRef} className="plotContainer">
			<svg 
				className = "engineScatterChart"
				// <ParentSize> Passes its dimensions so the plot can responsively scale
				width = {width}
				height = {height}
			>

			<rect
				// Background colour
				className = "background"
				width = {parent.width}
				height = {parent.height}
			/>

			{
				engineData.map((engine, index) => { return (
					<>
					<Circle
						key = { `point-${index}` }
						className = "point"
						cx = { xPoint(engine) }
						cy = { yPoint(engine) }
						r = { Math.sqrt(engine.cost) * 0.2 }
						fill = "red"
						opacity = { 0.5 }
					/>

					<Line
						key = { `line-${index}` }
						className = "point"
						from = {{ x: xScale(engine.isp_asl), y: yScale(engine.twr_asl) }}
						to = {{ x: xScale(engine.isp_vac), y: yScale(engine.twr_vac) }}
						stroke = "red"
						opacity = { 0.3 }
						strokeWidth= { 2 }
					/>
					</>
				)})
			}

			{
				engineData.map((engine, index) => { return (
					<>
					<Text
						key = { `label-${index}` }
						verticalAnchor="end"
						x = { xPoint(engine) + 8}
						y = { yPoint(engine) - 8}
						fill = "white"
					>
						{engine.name_nick}
					</Text>
					</>
				)})
			}

			<AxisBottom 
				scale = { xScale }
				left = { 0 }
				top = { height - 100 }
				rangePadding= { 100 } 
				label = { "Specific impulse (isp)" }
				stroke = { "#fff" }
				tickStroke = { "#fff" }
				tickLabelProps = {{ fill: "#fff", fontSize: 16, fontFamily: "Iosevka Web" }}
				labelProps = {{ fill: "#fff", fontSize: 16, fontFamily: "Iosevka Web" }}
			/>

			<AxisLeft
				scale = { yScale }
				top = { 0 }
				left = { 100 }
				label = { "Thrust-to-weight ratio (TWR)" }
				stroke = { "#fff" }
				tickStroke = { "#fff" }
				tickLabelProps = {{ fill: "#fff", fontSize: 16, fontFamily: "Iosevka Web" }}
				labelProps = {{ fill: "#fff", fontSize: 16, fontFamily: "Iosevka Web" }}
			/>

		</svg>
		</div>
	)
}
