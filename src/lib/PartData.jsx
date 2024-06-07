import { useState } from "react";
import Papa from "papaparse";

let engineStats = [];

// Data parser and builder
function loadData(path) {
	Papa.parse(path, {
		download: true,
		header: true,
		comments: "//",
		skipEmptyLines: "greedy",
		
		complete: function(result) {
			console.log(`PartData.loadData: Parsed ${path}`);
			engineStats = engineStats.concat(result.data);
			return result;
		}
	});
}

// Initial load of part data
function parseEngineData() {
    // Converts a callback function into an async function
    return Promise.all(
        [
            // Stock engine data
            new Promise((resolve, reject) => {
                resolve(loadData("./data/engines-stock.csv"));
            })
        ]
    )
}

function getEngineStats() {
	return engineStats;
}

export default { parseEngineData, getEngineStats };
