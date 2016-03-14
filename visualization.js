// custom variables
var w = 500, h = 190,
    element_count = 15, speed = 50,
    implimentation = "selection",
    dataset, scale, padding = 2, timer,
    states = {"default": 0, "finished": 1, "current": 2, "compare": 3, "minimal": 4, "hide": 5},
    colors = ["#B7C4CF", "#3565A1", "#D55511", "#74A82A", "#A42F11", "#fff"],
    svg;

// init the graph
setDataset(element_count);
setRects(dataset);

//generic definition
var sorts = {};



// generate random dataset
function setDataset(length) {
  dataset = [];

  //fill the dataset and set to default state
  for (var i = 0; i < length; i++)
  {
    dataset[i] = { value: (Math.random() * length * 2) | 0, state: states.default };
  }

  //draw the graphic
  scale = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d) { return d.value; })])
    .range([9, h]);
}

// create rect in svg
function setRects(set) {

  //clear this html element
  document.getElementById("graph").innerHTML = "";

  //create the svg
  svg = d3.select("#graph")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  //draw the graphic
  svg.selectAll("rect")
    .data(set)
    .enter()
    .append("rect")
    .attr({
      x: function(d, i) {
        return i * (w / set.length);
      },
      y: function(d, i) {
        return h - scale(d.value);
      },
      width: function(d, i) {
        return (w / set.length) - padding;
      },
      height: function(d, i) {
        return scale(d.value);
      },
      fill: function(d, i) {
        return colors[d.state];
      }
    });
}

//update
function redrawRects(set) {
  var rects = svg.selectAll("rect")
    .data(set)
    .transition()
    .duration(speed / 2 | 0)
    .attr({
      y: function(d, i) {
        return h - scale(d.value);
      },
      height: function(d, i) {
        return scale(d.value);
      },
      fill: function(d, i) {
        return colors[d.state];
      }
    });
}

//choice logic, will be removed since we have 1 implimentation per page
document.getElementById("implimentation").addEventListener("change", function() {
    implimentation = this.value;
});

//reset button
document.getElementById("reset").addEventListener("click", function() {
  //interrupt previous play
  clearInterval(timer);

  //set speed and count to input values
  element_count = document.getElementById("element_count").value;
  speed = document.getElementById("speed").value;

  setDataset(element_count);
  setRects(dataset);
});

//play
document.getElementById("play").addEventListener("click", function() {
  //inturrupt previous play
  clearInterval(timer);

  //reset states
  for (var i = dataset.length - 1; i >= 0; i--)
    dataset[i].state = states.default;

  sorts[implimentation]();
});
