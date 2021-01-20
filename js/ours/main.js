let lineChart;
let map;
let stackedAreaChart;
let worldData;
let scatterPlot;
let rayChart;

let MyEventHandler = {};

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});

let promises = [
    d3.json("data/world.geo.json"),
    d3.csv("data/fossilfuelEmissions.csv"),
    d3.csv("data/crops.csv"),
    d3.csv("data/renewableInvestment.csv"),
    d3.csv("data/energyconsumption.csv")
];

Promise.all(promises)
    .then( function(data){ main(data) })
    .catch( function (err){console.log(err)} );

function main(data){
    console.log(data)
    lineChart = new LineChart("linechartinyourarea",data[1], MyEventHandler)
    map = new WorldMap("MapSite",data[0],data[2])
    stackedAreaChart = new StackedAreaChart('stackedAreaChart', data[3])
    scatterPlot = new Scatterplot('lineAnimation', data[1])
    rayChart = new RayChart('rayChart',data[4]);
}

$(MyEventHandler).bind("selectionChanged", function(event, year){
    scatterPlot.changedYear(year);
});

