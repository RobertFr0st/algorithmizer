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

//todo: put length input on slider so bad input is not possible
//selection implimentation
sorts.selection = function()
{
  var i, j, minimum_index, isInner;
  j = 0; isInner = false;

  timer = setInterval(function()
  {
    //done sorting clean up
    if(j == dataset.length - 1)
    {
      clearInterval(timer);
    }

    //set this as element to swap with
    dataset[j].state = states.current;

    //upon next i iteration set first element as minimum
    if (!isInner)
    {
      minimum_index = j;
      i = j + 1;
      isInner = true;
    }
    if (i < dataset.length)
    {
      //reset previous element to no longer being compared
      if (dataset[i - 1].state === states.compare)
        dataset[i - 1].state = states.default;

      //set current element to being compared 
      dataset[i].state = states.compare;

      //current element is new minimum 
      if (dataset[i].value < dataset[minimum_index].value)
      {
        //reset previous minimum state
        if (minimum_index !== j)
          dataset[minimum_index].state = states.default;

        //set new minimum
        minimum_index = i;
        dataset[minimum_index].state = states.minimal;
      }

      //move on to next inner for loop element
      i++;
    }
    else
    {
      isInner = false;

      //perform the swap
      swap(minimum_index, j);

      //reset last checked element to default
      dataset[i - 1].state = states.default;

      //reset minimum to default
      dataset[minimum_index].state = states.default;

      //set comparing element to finished
      dataset[j].state = states.finished;

      //move on to next element in the array
      j++;
    }

    redrawRects(dataset);
  }, speed);
}

function swap(i, j)
{
  var tmp = dataset[i];
  dataset[i] = dataset[j];
  dataset[j] = tmp;
}

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
