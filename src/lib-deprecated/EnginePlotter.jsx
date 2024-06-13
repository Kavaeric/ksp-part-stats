import EnginePoint from "./EnginePoint";
import "./EnginePlotter.css";

export default function EnginePlotter({data}) {

	const engineStats = data;

	console.log(engineStats);

	return (
		<div className="graphFrame">
			<div className="graphPlotFrame">
				<div className="graphPlot">
					{engineStats.map((engine, index) => <EnginePoint stats={engine} key={index}/>)}
				</div>
			</div>
		</div>
	)
}
