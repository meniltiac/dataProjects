    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 1250 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    // parse the date / time
    var parser = d3.timeParse("%Y-%m-%d");

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the line
    var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.weight); })
    .curve(d3.curveStepAfter);

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#weight_svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    // Get the data
    d3.json("./data/caitlin_weight/measurements.json", function(error, data) {
    if (error) throw error;

    console.log(data[0].vacationDays);

    // format the data
    data[0].measurements.forEach(function(d) {
      d.date = parser(d.date);
      d.weight = +d.weight;
    });

    // format the data
    data[0].vacationDays.forEach(function(d) {
      d.startDate = parser(d.startDate);
      d.endDate = parser(d.endDate);
    });

    // Scale the range of the data
    x.domain(d3.extent(data[0].measurements, function(d) { return d.date; }));
    y.domain([125, d3.max(data[0].measurements, function(d) { return d.weight + 10; })]);

    // Add the valueline path.
    svg.append("path")
      .data([data[0].measurements])
      .attr("class", "line")
      .attr("d", valueline);

    // Add the X Axis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    svg.append("rect")
      .attr("class", "vacation")
      .attr("x")


    // Add the Y Axis
    svg.append("g")
      .call(d3.axisLeft(y));

    });
