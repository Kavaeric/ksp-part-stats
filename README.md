# ksp-part-stats

Stats of various rocket engine parts for the game Kerbal Space Program. This tool is meant to aid balancing and part design for the modding community.

* Each plot bubble represents the engine's thrust-to-weight ratio and efficiency (expressed as I_sp) in a **vacuum**. The size of the bubble represents the part's cost in in-game currency.
* The trailing line represents the engine's changing performance from sea level to vacuum. Note that KSP stores this data as a series of data points, and performs linear interpolation and extrapolation to draw a "performance line".
* Drag on the mini legend boxes on the bottom and left of the page to adjust the zoom and scale of the graph.
* Currently, the graphing system uses the open-source [d3](https://d3js.org/) library. However, I am looking into other options that may work better with React's component system.

https://kavaeric.net/ksp-part-stats/
