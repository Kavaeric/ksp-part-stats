import "./EnginePoint.css";

function scaleToRange (number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function scaleToPercent (number, inMin, inMax) {
	return scaleToRange(number, inMin, inMax, 0, 100);
}

export default function EnginePoint({stats, index}) {

	stats.twr_vac = stats.thrust_vac / (stats.mass * 9.81);
	stats.twr_asl = stats.thrust_asl / (stats.mass * 9.81);

	console.log(`${stats.name_nick} has ISP of ${stats.isp_vac} and TWR of ${stats.twr_vac}`);

	const vacPointPosition = {
		left: `${scaleToPercent(stats.isp_vac, 250, 400)}%`,
		bottom:  `${scaleToPercent(stats.twr_vac, 5, 30)}%`
	}

	const aslPointPosition = {
		left: `${scaleToPercent(stats.isp_asl, 250, 400)}%`,
		bottom:  `${scaleToPercent(stats.twr_asl, 5, 30)}%`
	}

	return (
		<>

			<button className="enginePoint" style={vacPointPosition}>
				<div className="enginePointDot"></div>
				<div className="enginePointLabel">{stats.name_nick}</div>
			</button>

		</>
	)
}
