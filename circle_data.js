function create_circles() {
  var canvas_height = 200;
  var canvas_width = 300;

  var dataset = [10, 20, 30, 40, 100, 79];

  var svg = d3.select("body")
    .append("svg")
    .attr("width", canvas_width)
    .attr("height", canvas_height);

  //circle varables
  var radius = 20;
  var padding = 2;
  var circle = svg.selectAll("circle");

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

  svg.selectAll("text")
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
