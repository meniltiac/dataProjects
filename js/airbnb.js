function edinburghD3Chart(){

	// grab correct svg to place chart in
	var svg = d3.select("#edinburgh_svg"),
		//include room at the top for the .data-explainer to live
		margin = {top: 45, right: 20, bottom: 30, left: 40},
		width = +svg.attr("width") - margin.left - margin.right,
		height = +svg.attr("height") - margin.top - margin.bottom;

	var x = d3.scaleBand().rangeRound([0, width]).padding(.1),
		y = d3.scaleLinear().rangeRound([height, 0]);

	var g = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Define the div for the .data-explainer
	var div = d3.select(".wrapper").append("div")
		.attr("class", "data-explainer")
		.style("opacity", 0);

	// load csv from data directory
	d3.csv("/data/airbnb/edinburgh.csv", function(d) {
		d.listings = +d.listings;
			console.log(d);
			return d;
		}, function(error, data) {
			if (error) throw error;

		// calculate how to present the x and y axis
		x.domain(data.map(function(d) { return d.neighbourhood; }));
		y.domain([0, d3.max(data, function(d) { return d.listings; })]);

		// create g within the svg for the x axis labels
		g.append("g")
			.attr("class", "axis axis--x")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x));

		// create g within the svg for y axis labels
		g.append("g")
			.attr("class", "axis axis--y")
			.call(d3.axisLeft(y).ticks())
		  .append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", "0.71em")
			.attr("text-anchor", "end")
			.text("Number of Listings");

		// create the bars for the bar chart for number of listings in each
		// neighborhood
		g.selectAll(".edinburgh-bar")
		  .data(data)
		  .enter().append("rect")
			.attr("class", "bar")
			.attr("x", function(d) { return x(d.neighbourhood); })
			.attr("y", function(d) { return y(d.listings); })
			.attr("width", x.bandwidth())
			.attr("height", function(d) { return height - y(d.listings); })
			// create event with information for the .data-explainer
			.on("mouseover", function(d) {
				div.transition()
					.duration(200)
					.style("opacity", 1);
				div.html("<img src='//logo.clearbit.com/airbnb.com?size=40' class='airbnb'>\
						 <span>\
							 <strong>"
								 + d.listings
								 + " listings\
							 </strong> \
								 in <strong>"
									  + d.neighbourhood
								  + "</strong> \
								  in July 2017</span>");
			});
	});

}

function edinburghD3Donut() {

    var width = 600,
        height = 600,
        radius = Math.min(width, height) / 2;

    var arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 70);

    var pie = d3.pie()
        .sort(null)
        .value(function(d) { return d.listings; });

    var svg = d3.select(".donut-wrapper").append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    d3.csv("/data/airbnb/edinburgh.csv", type, function(error, data) {
      if (error) throw error;

      var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56",
      "#d0743c", "#ff8c00"]);

      var g = svg.selectAll(".arc")
          .data(pie(data))
        .enter().append("g")
          .attr("class", "arc");


      g.append("path")
          .attr("d", arc)
          .style("fill", function(d) { return color(d.data.neighbourhood); });

      g.append("text")
          .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
          .attr("dy", ".35em")
          .text(function(d) { return d.data.neighbourhood; });
    });

    function type(d) {
      d.listings = +d.listings;
      return d;
    }

}


edinburghD3Chart();
edinburghD3Donut();
