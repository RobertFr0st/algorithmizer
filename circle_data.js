function create_circles() {
  var height = 200;
  var width = 300;

  var dataset = [10, 20, 30, 40, 50];

  var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  var radius = 20;
  var padding = 2;

  var circle = svg.selectAll("circle");

  circle.data(dataset)
    .enter()
    .append("circle")
    .attr({
      r: function () {
        return radius;
      },
      cx: function (d, i) {
        return radius + padding + (i * (width / dataset.length) - padding);
      },
      cy: function () {
        return height / 2 + 15;
      },
      fill: function () {
        return "teal";
      }
    });

  svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function (d) {
      return d;
    })
    .attr({
      "text-anchor" : "middle",
      x: function (d, i) {
        return i * (width / dataset.length) + width / dataset.length - padding / 2 - 40;
      },
      y: function (d) {
        return height - radius * 4;
      }
    });

  circle.exit().remove();
}