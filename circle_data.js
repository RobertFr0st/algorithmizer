function create_circles() {
  var canvas_height = 200;
  var canvas_width = 300;
  var canvas_border = 1;

  var dataset = [10, 20, 30, 40, 100, 79];

  var svg_container = d3.select("body")
    .append("svg")
    .attr("width", canvas_width)
    .attr("height", canvas_height)
    .attr("border", canvas_border);
  var circle_text_group = svg_container.append("g");

  //this is a bit buggy can't get it not to be a solid black box but
  //uncomment to see the size of your canvas
  //for debugging purposes this box represents the edges of our canvas
  /*var borderPath = svg_container.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("height", canvas_height)
    .attr("width", canvas_width)
    .style("stroke", bordercolor)
    .style("fill", "blue")
    .style("stroke-width", 1);*/

  //circle varables
  var radius = 20;
  var padding = 2;
  var circle = circle_text_group.selectAll("circle");

  //text variables
  //this parameter is a hacky way of specifing font size.
  //it is important because we want the font centered within the circle
  var text_height = "18";

  circle.data(dataset)
    .enter()
    .append("circle")
    .attr({
      r: function () {
        return radius;
      },
      cx: function (d, i) {
        return radius + (i * (canvas_width / dataset.length));
      },
      cy: function () {
        return canvas_height / 2 + 15;
      },
      fill: function () {
        return "teal";
      }
    });

  circle_text_group.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .attr("font-size", text_height)
    .text(function (d) {
      return d;
    })
    .attr({
      "text-anchor" : "middle",
      x: function (d, i) {
        return radius + (i * (canvas_width / dataset.length));
      },
      y: function (d) {
        //first part matches circle y logic half text_height is to center text
        return canvas_height / 2 + 15 + text_height/2;
      },
      "font-size": function(){return text_height;}
    });

  circle.exit().remove();
}
