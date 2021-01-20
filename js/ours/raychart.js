
class RayChart {
    constructor(parentElement, data) {
        this.parentElement = parentElement
        this.data = data
        // Year parser
        this.formatDate = d3.timeFormat("%Y");
        this.parseDate = d3.timeParse("%Y");

        this.colors = ['#332288','#117733','#44AA99','#88CCEE','#DDCC77','#CC6677','#AA4499','#882255']

        this.visInit()
    }

    visInit(){
        let vis = this;

        vis.margin = {top: 40, right: 40, bottom: 40, left: 40};
        vis.width = 560 - vis.margin.left - vis.margin.right;
        vis.height = 500 - vis.margin.top - vis.margin.bottom;
        vis.innerRadius = 100;
        vis.outerRadius = Math.min(vis.width, vis.height)/1.6

        // draw svg area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + (vis.width / 2 + 30) + "," + ( vis.height/2+ 90 )+ ")");

        vis.x = d3.scaleBand()
            .range([0, 2 * Math.PI])
            .align(0)

        vis.y = d3.scaleRadial()
            .range([vis.innerRadius, vis.outerRadius])

        vis.displayData = vis.data.forEach(function(d){
            // Convert string to 'date object'
            d.year = vis.parseDate(d.year);

            // Convert numeric values to 'numbers'
            d.coal_consumption_EJ = +d.coal_consumption_EJ;
            d.gas_consumption_EJ = +d.gas_consumption_EJ;
            d.geo_biomass_other_TWh = +d.geo_biomass_other_TWh;
            d.hydro_generation_TWh = +d.hydro_generation_TWh;
            d.nuclear_generation_TWh = +d.nuclear_generation_TWh;
            d.oil_consumption_EJ = +d.oil_consumption_EJ;
            d.solar_generation_TWh = +d.solar_generation_TWh;
            d.wind_generation_TWh = +d.wind_generation_TWh;
        });

        vis.colorpicker ={
            coal_consumption_EJ: vis.colors[0],
            gas_consumption_EJ: vis.colors[1],
            geo_biomass_other_TWh : vis.colors[2],
            hydro_generation_TWh : vis.colors[3],
            nuclear_generation_TWh : vis.colors[4],
            oil_consumption_EJ : vis.colors[5],
            solar_generation_TWh : vis.colors[6],
            wind_generation_TWh : vis.colors[7]
        }

        console.log(vis.displayData)

        vis.tooltip = d3.select("#" + vis.parentElement).append("div")
            .attr("class", "tooltip mine")
            .style("opacity", 0);

        vis.wrangleData()
    }

    wrangleData(){

        let vis = this;

        vis.filteredData = []

        vis.final = []

        vis.time = d3.select('#myRange').property("value");

        console.log(vis.time)

        vis.selectValue = d3.select("#data-type").property("value");

        //return filtered data
        vis.filteredData = vis.data.filter(function (d) {
            return vis.formatDate(d.year) === vis.time
        });
        // sort by continent
        vis.comperator = function Comparator(a, b) {
            if (a.continent < b.continent) return 1;
            if (a.continent < b.continent) return -1;
            return 0;
        }
        vis.filteredData = vis.filteredData.sort(vis.comperator);
        console.log(vis.filteredData);

        vis.imgs = vis.svg.append('svg:image')
            .attr('xlink:href',"img/globe.png")
            .attr('height',230)
            .attr('width',230)
            .attr('x', -115)
            .attr('y',-115)

        vis.visUpdate()
    }

    visUpdate(){

        let vis = this;

        // update scales
        vis.x.domain(vis.filteredData.map(function(d) {return d.country;}));
        vis.y.domain([0, d3.max(vis.filteredData, d =>d[vis.selectValue])]);

        let tipMouseover = function(d,event) {
            let html  = '<b>'+ d.country;
            console.log(html)
            vis.tooltip.html(html)
                .style("left", (event.pageX - 210) + "px")
                .style("top", (event.pageY - 130) + "px")
                .transition()
                .duration(200) // ms
                .style("opacity", .9) // started as 0!

        };
        // tooltip mouseout event handler
        let tipMouseout = function() {
            vis.tooltip.transition()
                .duration(300) // ms
                .style("opacity", 0); // don't care about position!
        };

        vis.bubbleGraph = vis.svg.selectAll(".path")
            .data(vis.filteredData)

        vis.bubbleGraph.enter()
            .append("path")
            .attr("class", "path")
            .merge(vis.bubbleGraph)
            .attr("fill", vis.colorpicker[vis.selectValue])
            .on("mouseover", (event,d) => {tipMouseover(d,event)})
            .on("mouseout", tipMouseout)
            .attr("d", d3.arc()     // imagine your doing a part of a donut plot
                .innerRadius(vis.innerRadius)
                .outerRadius(function(d) { return vis.y(d[vis.selectValue]); })
                .startAngle(function(d) { return vis.x(d.country); })
                .endAngle(function(d) { return vis.x(d.country) + vis.x.bandwidth(); })
                .padAngle(0.01)
                .padRadius(vis.innerRadius))

        vis.bubbleGraph.exit().remove();

        $('#selected-year').html('Year: <b>' + vis.time + '</b>')

    }
}