import { useState, useEffect, useLayoutEffect, useRef } from "react";

import * as Scale from "@visx/scale";
import { Circle, Line } from "@visx/shape";
import { useParentSize } from "@visx/responsive";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { GridColumns, GridRows } from "@visx/grid"
import { Text } from "@visx/text";

import "./Plotter.css";

// Main scatter plot...plotter
export default function Plotter(plotterProps) {

	// Save the engine data to a local state variable
	const [engineData, setEngineData] = useState(plotterProps.newData);

	// Calculate TWR of all our engines
	for (let engine of engineData) {
		engine.twr_asl = engine.thrust_asl / (engine.mass * 9.81);
		engine.twr_vac = engine.thrust_vac / (engine.mass * 9.81);
	}

	// Define the dimensions of the rulers
	const rulerSize = 60;
	const brushNavSize = 80;

	// Calculate height and width of entire chart from the above measurements and from size of the parent container
	const { parentRef: chartParentRef, width: chartWidth, height: chartHeight } = useParentSize({ debounceTime: 150 });
	const chartPlotWidth = chartWidth - rulerSize - brushNavSize;
	const chartPlotHeight = chartHeight - rulerSize - brushNavSize;
	const chartMargin = rulerSize + brushNavSize;

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
		range: [chartMargin, chartWidth], // Drawn graph's left and right extents
	})
	const yScale = Scale.scaleLinear({
		domain: [0, 30], // Data's min and max x-coordinate values
		range: [chartPlotHeight, 0], // Drawn graph's bottom and top extents; remember a graph's y-scale goes bottom to top
	})

	const xBrushScale = Scale.scaleLinear({
		domain: [0, 400], // Data's min and max x-coordinate values
		range: [chartMargin, chartWidth], // Drawn graph's left and right extents
	})
	const yBrushScale = Scale.scaleLinear({
		domain: [0, 30], // Data's min and max x-coordinate values
		range: [chartPlotHeight, chartPlotHeight - brushNavSize], // Drawn graph's bottom and top extents
	})

	// Compose scale and accessor functions to get point functions
	const compose = (scale, accessor) => engineData => scale(accessor(engineData));
	const xPoint = compose(xScale, dataX);
	const yPoint = compose(yScale, dataY);

	console.log(engineData.length);

	return (
		<div ref={chartParentRef} className="plotContainer">
			<svg 
				className = "plotArea"
				width = {chartWidth}
				height = {chartHeight}
			>

				<rect
					// Background colour
					className = "background"
					x = {chartMargin}
					width = {chartPlotWidth}
					height = {chartPlotHeight}
				/>

				<GridColumns
					scale = {xScale}
					width = {chartPlotWidth}
					height = {chartPlotHeight}
					stroke = {"rgba(255, 255, 255, 0.1)"}
				/>

				<GridRows 
					scale = {yScale}
					left = {chartMargin}
					width = {chartPlotWidth}
					height = {chartPlotHeight}
					stroke = {"rgba(255, 255, 255, 0.1)"}
				/>

				{
					engineData.map((engine, index) => { return (
						<>
						<Circle
							key = { `point-${index}` }
							cx = { xPoint(engine) }
							cy = { yPoint(engine) }
							r = { Math.sqrt(engine.cost) * 0.2 }
							fill = "red"
							opacity = { 0.5 }
						/>

						<Line
							key = { `line-${index}` }
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
				<AxisLeft
					scale = { yScale }
					top = { 0 }
					left = { chartMargin }
					hideAxisLine = { true }
					hideTicks = { true }
					label = {"Thrust-to-weight ratio (TWR)"}
					labelProps = {{ fill: "#fff", fontSize: 20, fontFamily: "Iosevka Web", fontWeight: 600}}
					tickLabelProps = {{ fill: "#fff", fontSize: 16, fontFamily: "Iosevka Web"}}
				/>
				<AxisBottom
					scale = { xScale }
					top = { chartPlotHeight }
					left = { 0 }
					hideAxisLine = { true }
					hideTicks = { true }
					label = {"Specific impulse (I_sp)"}
					labelProps = {{ fill: "#fff", fontSize: 20, fontFamily: "Iosevka Web", fontWeight: 600}}
					tickLabelProps = {{ fill: "#fff", fontSize: 16, fontFamily: "Iosevka Web" }}
				/>

				{
					// X-scale brush navigator
					engineData.map((engine, index) => { return (
						<>
						<Circle
							key = { `xBrushPoint-${index}` }
							cx = { xPoint(engine) }
							cy = { chartHeight - brushNavSize/2 }
							r = { Math.pow(engine.cost, 1/4) }
							fill = "red"
							opacity = { 0.5 }
						/>

						<Line
							key = { `xBrushLine-${index}` }
							from = {{ x: xScale(engine.isp_asl), y: chartHeight - brushNavSize/2 }}
							to = {{ x: xScale(engine.isp_vac), y: chartHeight - brushNavSize/2 }}
							stroke = "red"
							strokeLinecap = "round"
							opacity = { 0.02 }
							strokeWidth= { brushNavSize/2 }
						/>
						</>
					)})
				}

			</svg>
		</div>
	)
}
