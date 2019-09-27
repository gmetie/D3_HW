
var svgWidth = 800;
var svgHeight = 600;

var chartMargin = {
 top: 100,
 right: 100,
 bottom: 150,
 left: 100
};

var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

var svg = d3
 .select("#scatter")
 .append("svg")
 .attr("height", svgHeight)
 .attr("width", svgWidth);

var chartGroup = svg.append("g")
 .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

d3.csv("assets/data/data.csv").then(function(journalData) {

 console.log(journalData);

 journalData.forEach(function(data) {
   data.poverty = +data.poverty;
   data.obesity = +data.obesity;
 });

   var xLinearScale = d3.scaleLinear()
     .domain([7, d3.max(journalData, d => d.poverty) *1.2])
     .range([0, chartWidth]);
   var yLinearScale = d3.scaleLinear()
     .domain([15, d3.max(journalData, d => d.obesity) *1.2])
     .range([chartHeight, 0]);
 
   var bottomAxis = d3.axisBottom(xLinearScale);
   var leftAxis = d3.axisLeft(yLinearScale);
 
   chartGroup.append("g")
     .attr("transform", `translate(0, ${chartHeight})`)
     .call(bottomAxis);
   chartGroup.append("g")
     .call(leftAxis);
 
   var circlesGroup = chartGroup.selectAll("circle")
   .data(journalData)
   .enter()
   .append("circle")
   .attr("cx", d => xLinearScale(d.poverty))
   .attr("cy", d => yLinearScale(d.obesity))
   .attr("r", "12")
   .attr("fill", "green")
   .attr("opacity", ".5");
 
   var toolTip = d3.tip()
     .attr("class", "tooltip")
     .offset([80, -60])
     .html(function(d) {
       return (`${d.abbr}<br> Poverty: ${d.poverty}<br>Obesity: ${d.obesity}`);
     });

   chartGroup.call(toolTip);

   circlesGroup.on("click", function(data) {
     toolTip.show(data, this);
   })
   
     .on("mouseout", function(data) {
       toolTip.hide(data);
     });
   
   chartGroup.append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 0 - chartMargin.left + 40)
     .attr("x", 0 - (chartHeight / 2))
     .attr("dy", "1em")
     .attr("class", "axisText")
     .text("Obesity Rates");
   chartGroup.append("text")
     .attr("transform", `translate(${chartWidth/ 2}, ${chartHeight + chartMargin.top})`)
     .attr("class", "axisText")
     .text("Poverty");
});