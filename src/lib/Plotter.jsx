import { useState, useEffect, useLayoutEffect, useRef, useMemo } from "react";

import * as Scale from "@visx/scale";
import { Circle, Line } from "@visx/shape";
import { useParentSize } from "@visx/responsive";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { GridColumns, GridRows } from "@visx/grid"
import { Text } from "@visx/text";
import { PatternLines } from "@visx/pattern"
import { Group } from "@visx/group";
import { Brush } from "@visx/brush";

import "./Plotter.css";
import { XYChart } from "@visx/xychart";

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

	// View domain state variables
	const [xScaleViewDomain, setXScaleViewDomain] = useState([0, 400]);
	const [yScaleViewDomain, setYScaleViewDomain] = useState([0, 30]);

	// Get min and max extents of X and Y axes
	// TODO: Turn this into a useMemo and dynamically find these bounds
	const [xScaleDomain, setXScaleDomain] = useState([0, 5000]);
	const [yScaleDomain, setYScaleDomain] = useState([0, 30]);

	// console.log(`engineData x-axis value range (I_sp) is ${xScaleDomain}`)
	// console.log(`engineData y-axis value range (TWR) is ${yScaleDomain}`)

	// Define our scales
	const xScale = Scale.scaleLinear({
		domain: xScaleViewDomain, // Data's min and max x-coordinate values
		range: [0, chartPlotWidth], // Drawn graph's left and right extents
	})
	const yScale = Scale.scaleLinear({
		domain: yScaleViewDomain, // Data's min and max x-coordinate values
		range: [chartPlotHeight, 0], // Drawn graph's bottom and top extents; remember a graph's y-scale goes bottom to top
	})

	const xBrushScale = Scale.scaleLinear({
		domain: xScaleDomain, // Data's min and max x-coordinate values
		range: [0, chartWidth - chartMargin], // Drawn graph's left and right extents
	})
	const yBrushScale = Scale.scaleLinear({
		domain: yScaleDomain, // Data's min and max x-coordinate values
		range: [chartPlotHeight, 0], // Drawn graph's bottom and top extents
	})

	// Accessor functions for mapping the data to an X and Y value
	function dataX (data) { 
		return data.isp_vac;
	}
	function dataY (data) { 
		return data.twr_vac;
	}

	// Compose scale and accessor functions to get point functions
	const compose = (scale, accessor) => engineData => scale(accessor(engineData));
	const xPoint = compose(xScale, dataX);
	const yPoint = compose(yScale, dataY);

	console.log(engineData.length);

	function handleXBrushChange(bounds) {
		if (!bounds) {
			console.log("handleBrushChange: Bounds is null!");
			return null;
		}

		setXScaleViewDomain([bounds.x0, bounds.x1]);
	}

	function handleYBrushChange(bounds) {
		if (!bounds) {
			console.log("handleBrushChange: Bounds is null!");
			return null;
		}

		setYScaleViewDomain([bounds.y0, bounds.y1]);
	}

	return (
		<div ref={chartParentRef} className="plotContainer">
			<svg 
				className = "plot"
				width = {chartWidth}
				height = {chartHeight}
			>
				<Group
					className = "plotArea"
					left = {chartMargin}	
				>
					<XYChart 
						width = {chartWidth}
						height = {chartHeight}
						xScale = {xScale}
						yScale = {yScale}
					>
						<rect
							// Background colour
							className = "background"
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
							width = {chartPlotWidth}
							height = {chartPlotHeight}
							stroke = {"rgba(255, 255, 255, 0.1)"}
						/>

						<g>
						{
							engineData.map((engine, index) => { return (
								<>
									<Circle
										key = { `point-${index}` }
										cx = { xScale(engine.isp_vac) }
										cy = { yScale(engine.twr_vac) }
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
						</g>

						<g>
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
						</g>
					</XYChart>
				</Group>

				<Group
					className = "xAxisGroup"
					left = {chartMargin}
				>
					<AxisBottom
						scale = { xScale }
						top = { chartPlotHeight }
						hideAxisLine = { true }
						hideTicks = { true }
						label = {"Specific impulse (I_sp)"}
						labelProps = {{ fill: "#fff", fontSize: 20, fontFamily: "Iosevka Web", fontWeight: 600}}
						tickLabelProps = {{ fill: "#fff", fontSize: 16, fontFamily: "Iosevka Web" }}
					/>
				</Group>

				<Group
					className = "yAxisGroup"
					left = {chartMargin}
				>
					<AxisLeft
						scale = { yScale }
						hideAxisLine = { true }
						hideTicks = { true }
						label = {"Thrust-to-weight ratio (TWR)"}
						labelProps = {{ fill: "#fff", fontSize: 20, fontFamily: "Iosevka Web", fontWeight: 600}}
						tickLabelProps = {{ fill: "#fff", fontSize: 16, fontFamily: "Iosevka Web"}}
					/>
				</Group>

				<Group
					className = "brushGroup xBrushGroup"
					left = {chartMargin}
					top = {chartPlotHeight + rulerSize}
					width = {chartWidth}
				>
					<XYChart
						// X-scale brush navigator
						height = {brushNavSize}
						width = {chartWidth}
						xScale = {xBrushScale}
						yScale = {yBrushScale}
					>
						<rect
							className = "brushBackground"
							y = { brushNavSize/4 }
							width = { chartPlotWidth }
							height = { brushNavSize/2 }
						/>
						
						<g>
						{
							engineData.map((engine, index) => { return (
								<>
								<Circle
									key = { `xBrushPoint-${index}` }
									cx = { xBrushScale(engine.isp_vac) }
									cy = { brushNavSize/2 }
									r = { Math.pow(engine.cost, 1/4) }
									fill = "red"
									opacity = { 0.5 }
								/>

								<Line
									key = { `xBrushLine-${index}` }
									from = {{ x: xBrushScale(engine.isp_asl), y: brushNavSize/2 }}
									to = {{ x: xBrushScale(engine.isp_vac), y: brushNavSize/2 }}
									stroke = "red"
									strokeLinecap = "round"
									opacity = { 0.02 }
									strokeWidth= { brushNavSize/2 }
								/>
								</>
							)})
						}
						</g>

						<Group
							className = "brush xBrush"
							top = {brushNavSize / 4}
						>
							<Brush 
								xScale = {xBrushScale}
								yScale = {yBrushScale}
								height = {brushNavSize / 2}
								width = {chartPlotWidth}
								//initialBrushPosition = {{ start: {x: xScaleViewDomain[0]}, 
								//							end: {x: xScaleViewDomain[1]}}}
								onChange = {handleXBrushChange}
							/>
						</Group>
					</XYChart>
				</Group>

				<Group
					className = "brushGroup yBrushGroup"
					height = {chartHeight}
				>
					<XYChart
						// Y-scale brush navigator
						height = {chartPlotHeight}
						width = {brushNavSize}
						xScale = {xBrushScale}
						yScale = {yBrushScale}
					>
						<rect
							className = "brushBackground"
							x = { brushNavSize / 4 }
							width = { brushNavSize / 2 }
							height = { chartPlotHeight }
						/>
						
						<g>
						{
							engineData.map((engine, index) => { return (
								<>
								<Circle
									key = { `yBrushPoint-${index}` }
									cx = { brushNavSize/2 }
									cy = { yBrushScale(engine.twr_vac) }
									r = { Math.pow(engine.cost, 1/4) }
									fill = "red"
									opacity = { 0.5 }
								/>

								<Line
									key = { `xBrushLine-${index}` }
									from = {{ x: brushNavSize/2, y: yBrushScale(engine.twr_asl) }}
									to = {{ x: brushNavSize/2, y: yBrushScale(engine.twr_vac) }}
									stroke = "red"
									strokeLinecap = "round"
									opacity = { 0.02 }
									strokeWidth= { brushNavSize/2 }
								/>
								</>
							)})
						}
						</g>

						<Group
							className = "brush yBrush"
							left = {brushNavSize / 4}
						>
							<Brush 
								xScale = {xBrushScale}
								yScale = {yBrushScale}
								height = {chartPlotHeight}
								width = {brushNavSize/2}
								brushDirection = "vertical"
								resizeTriggerAreas = {['top', 'bottom']}
								//initialBrushPosition = {{ start: {y: yScaleViewDomain[0]}, 
								//							end: {y: yScaleViewDomain[1]}}}
								onChange = {handleYBrushChange}
							/>
						</Group>
					</XYChart>
				</Group>
			</svg>
		</div>
	)
}
