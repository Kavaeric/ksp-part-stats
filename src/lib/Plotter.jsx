import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { VictoryZoomContainer,
	VictoryVoronoiContainer,
	VictoryGroup,
	createContainer,
	VictoryChart,
	VictoryAxis,
	VictoryScatter,
	VictoryLine,
	VictoryLabel, 
	Circle} from "victory";

import "./Plotter.css";

// Styling objects--refactor these into theming or CSS later
const plotStyle = {
	labels: { fontSize: 12 },
	parent: { border: "1px solid rgba(255, 255, 255, 0.1)" },
}
const scatterStyle = {
	data: { fill: "#f00", stroke: "transparent", strokeWidth: 0, opacity: 0.8 }
}
const axisStyle = {
	axis: {stroke: "rgba(255, 255, 255, 0.5)"},
	axisLabel: {fontSize: 6, padding: 15, fontFamily: "Iosevka Web", fill: "rgba(255, 255, 255, 0.5"},
	tickLabels: {fontSize: 5, padding: 5, fontFamily: "Iosevka Web", fill: "rgba(255, 255, 255, 0.5"}
}
const labelStyle = {
	fontSize: 5,
	padding: 1,
	fontFamily: "Iosevka Web",
	fill: "rgba(255, 255, 255, 0.8)"
}

// Engine plotting component. Each engine needs to be plotted based on its stats at at least two contexts
function EngineScatter(engineStats, index) {

	const enginePerformance = [
		{isp: engineStats.isp_asl, twr: engineStats.twr_asl},
		{isp: engineStats.isp_vac, twr: engineStats.twr_vac},
	];

	return (
		<VictoryGroup key = {index}>
			<VictoryLine
				data={enginePerformance}
				x = "isp"
				y = "twr"
				style = {{ data: {fill: "transparent", stroke: "#f00", strokeWidth: 1, strokeLinecap: "round", opacity: 0.5 }}}
			/>

			<VictoryScatter
				// Plot the engine data with TWR on the y-axis and ISP on the x-axis
				data={[[engineStats.isp_vac, engineStats.twr_vac]]}
				x = {0}
				y = {1}
				// Size expects a diameter, but we need to represent these as area
				size = {Math.sqrt(engineStats.cost) * 0.05}
				style = {scatterStyle}

				labels={engineStats.name_nick}
				labelComponent={
					<VictoryLabel renderInPortal textAnchor="start" style={labelStyle} dx={3} dy={-3}/>
				}
			/>
		</VictoryGroup>
	)
}

// Main scatter plot...plotter
export default function Plotter({data}) {

	const [engineData, setEngineData] = useState(data);

	// Calculate TWR of all our engines
	for (let engine of engineData) {
		engine.twr_asl = engine.thrust_asl / (engine.mass * 9.81);
		engine.twr_vac = engine.thrust_vac / (engine.mass * 9.81);
	}

	const targetRef = useRef(null);

	const defaultZoom = {x: [150, 400], y: [0, 30]};

	return (
		<VictoryChart
			domain = {{ x: [0, 5000], y: [0, 50] }}
			domainPadding={{ x: 25 }}
			padding={{ top: 50, bottom: 50, right: 50, left: 50 }}
			style = {plotStyle}
			containerComponent = {
				<VictoryZoomContainer
				className = "engineScatterPlot"
				disableInlineStyles = {true}
				zoomDomain={defaultZoom}
				allowZoom={false}
				minimumZoom={{x: 20, y: 10}} />
			}
		>
		
			<VictoryAxis
				// X-axis
				domain = {[0, 400]}
				label="Specific impulse (Isp)"
				style={axisStyle}
			/>
			<VictoryAxis dependentAxis
				// Y-axis
				domain = {[0, 30]}
				label="Thrust-to-weight ratio (TWR)"
				style={axisStyle}
			/>

			{
				engineData
					? engineData.map((engineStats, index) => EngineScatter(engineStats, index))
					: ""
			}

		</VictoryChart>
	)
}
