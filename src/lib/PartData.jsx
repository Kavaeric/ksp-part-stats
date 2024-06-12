import { useState } from "react";
import Papa from "papaparse";

let engineStats = [];

// Data parser and builder
function loadDataTable(path) {

	return new Promise((resolve) => {
		Papa.parse(path, {
			download: true,
			header: true,
			comments: "//",
			skipEmptyLines: "greedy",
			dynamicTyping: true,
			
			complete: function(result) {
				console.log(`PartData.loadData: Parsed ${path}`);
				engineStats = engineStats.concat(result.data);
				resolve(result);
			}
		})
	});
}

// Initial load of part data
function initaliseData() {

	engineStats = [];

    // Converts a callback function into an async function
    return Promise.all(
        [
            // Stock engine data
            new Promise((resolve, reject) => {
                resolve(loadDataTable("./data/engines-stock.csv"));
            })

			/* ReStock+ engine data
			new Promise((resolve, reject) => {
				resolve(loadDataTable("./data/engines-restockplus.csv"));
			})*/
        ]
    )
}

function getEngineStats() {
	return engineStats;
}

export default { initaliseData, getEngineStats };
