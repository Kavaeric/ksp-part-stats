import { VictoryZoomContainer, VictoryVoronoiContainer, VictoryGroup, createContainer, VictoryChart, VictoryAxis, VictoryScatter, VictoryLine, VictoryLabel } from 'victory';

// Styling object--should be refactored as a theme or CSS later
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
const lineStyle = {
	data: { fill: "transparent", stroke: "#f00", strokeWidth: 0.5, opacity: 0.5}
}
const labelStyle = {
	fontSize: 5,
	padding: 1,
	fontFamily: "Iosevka Web",
	fill: "rgba(255, 255, 255, 0.8)"
}

function EngineScatter(stats, index) {

	const engineStats = [
		{isp: stats.isp_asl, twr: stats.twr_asl, label: null},
		{isp: stats.isp_vac, twr: stats.twr_vac, label: stats.name_nick},
	];

	return (
		<VictoryGroup key = {index}>
			<VictoryLine
				data={engineStats}
				x = "isp"
				y = "twr"
				style = {{ data: {fill: "transparent", stroke: "#f00", strokeWidth: stats.cost**0.4*0.5, strokeLinecap: "round", opacity: 0.1 }}}
			/>
			<VictoryScatter
				// Plot the engine data with TWR on the y-axis and ISP on the x-axis
				data={engineStats}
				x = "isp"
				y = "twr"
				size = {0.1}
				style = {scatterStyle}
				
				labels="label"
				labelComponent={
					<VictoryLabel renderInPortal textAnchor="start" style={labelStyle} dx={3} dy={-3}/>
				  }
			/>
		</VictoryGroup>

	)

}

export default function Plotter({data}) {

	const engineData = data;

	// Calculate TWR of all our engines
	for (let engine of engineData) {
		engine.twr_asl = engine.thrust_asl / (engine.mass * 9.81);
		engine.twr_vac = engine.thrust_vac / (engine.mass * 9.81);
	}

	const PlotContainer = createContainer("zoom", "voronoi");

	const defaultZoom = {x: [200, 400], y: [5, 30]};

	return (
		<VictoryChart
		domain = {{ x: [0, 5000], y: [0, 50] }}
		style = {plotStyle}
		containerComponent = {<VictoryZoomContainer
								zoomDomain={defaultZoom}
								allowZoom={false}
								minimumZoom={{x: 20, y: 10}} />}
		>
		
			<VictoryAxis
				// X-axis
				domain = {[0, 400]}
				label="Isp (axisStyle)"
				style={axisStyle}
			/>
			<VictoryAxis dependentAxis
				// Y-axis
				domain = {[0, 30]}
				label="TWR (vacuum)"
				style={axisStyle}
			/>

			{
				engineData
					? engineData.map((engine, index) => EngineScatter(engine, index))
					: ""
			}

		</VictoryChart>
	)
}
