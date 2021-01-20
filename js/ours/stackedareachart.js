
class StackedAreaChart {
    constructor(parentElement, data) {
        this.parentElement = parentElement
        this.data = data
        this.displayData = [];

        let colors = ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462','#b3de69', '#fccde5']

        this.dataCategories = Object.keys(this.data[0]).filter(d => d !== "Year")

        let colorArray = this.dataCategories.map((d, i) => {
            return colors[i % 10]
        })

        this.colorScale = d3.scaleOrdinal()
            .domain(this.dataCategories)
            .range(colorArray);

        this.initvis()
    }

    initvis() {
        let vis = this

        vis.margin = {top: 40, right: 40, bottom: 60, left: 60};
        vis.width = 600 - vis.margin.left - vis.margin.right;
        vis.height = 500 - vis.margin.top - vis.margin.bottom;

        // svg drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        //Overlay with path clipping
        vis.svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height);

        // Scales and axes
        vis.x = d3.scaleTime()
            .range([0, vis.width])
            .domain(d3.extent(vis.data, d => d.Year));

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        // stack layout
        vis.stackedData = d3.stack().keys(vis.dataCategories)(vis.data);

        //stacked area layout
        vis.area = d3.area()
            .curve(d3.curveCardinal)
            .x(function (d) {
                return vis.x(d.data.Year);
            })
            .y0(function (d) {
                return vis.y(d[0]);
            })
            .y1(function (d) {
                return vis.y(d[1]);
            });
        
        // Basic area layout
        vis.basicArea = d3.area()
            .x(function(d) { return vis.x(d.data.Year); })
            .y0(vis.height)
            .y1(function(d) { return vis.y(d[1]-d[0]); });

        //add tooltip holder
        vis.tooltip = vis.svg.append("text")
            .attr("class", "focus")
            .attr("x", 20)
            .attr("y", 0)
            .attr("dy", ".35em");

        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;

        if (vis.focus) {

            vis.displayData = [vis.stackedData[vis.selectedIndex]];
        } else {
            vis.displayData = vis.stackedData;
        }

        // Update the visualization
        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        // Update domain
        vis.y.domain([0, d3.max(vis.displayData, function (d) {
            return d3.max(d, function (e) {
                if (vis.focus) {
                    return e[1] - e[0];
                } else {
                    return e[1];
                }
            });
        })
        ]);

        // Draw the layers
        let categories = vis.svg.selectAll(".area")
            .data(vis.displayData);

        categories.enter().append("path")
            .attr("class", "area")
            .merge(categories)
            .style("fill", d => {
                return vis.colorScale(d)
            })
            .attr("d", d => {
                if (vis.focus) {
                    return vis.basicArea(d)
                } else {
                    return vis.area(d)
                }
            })
            .on("click", function (event, d) {

                // set filter
                vis.filter = vis.dataCategories[d.index]

                // updating focus
                vis.focus ? vis.focus = false : vis.focus = true

                // lastly, call wangleData
                vis.wrangleData();
            })
            .on("mouseover", function (event, d) {
                // always
                vis.selectedIndex = d.index
                // update tooltip text
                vis.tooltip.text(vis.dataCategories[d.index]);
            })
            .on("mouseout", function (d) {
                // empty tooltip
                vis.tooltip.text("");
            });

        categories.exit().remove();

        // Call axis functions with the new domain
        vis.svg.select(".x-axis").call(vis.xAxis);
        vis.svg.select(".y-axis").call(vis.yAxis);
    }
}
