// custom variables
var w = 500, h = 190,
    element_count = 15, speed = 50,
    implimentation = "insertion",
    dataset, scale, padding = 2, timer,
    states = {"default": 0, "finished": 1, "current": 2, "compare": 3, "minimal": 4, "hide": 5},
    colors = ["#B7C4CF", "#3565A1", "#D55511", "#74A82A", "#A42F11", "#fff"],
    svg;

//now call me like var p = new Command(true, 0, "finished")
function Command(isValue, index, change)
{
  this.isValue = isValue;
  this.index = index;
  this.change = change;
}

// init the graph
setDataset(element_count);
setRects(dataset);

//generic definition
var sorts = {};

sorts.insertion = function() {
  var i = 0, j = 0, was_swapped = false;

  timer = setInterval(function() {
    if (j == 0 || !was_swapped) {
      dataset[j].state = states.finished;
      i++;
      j = i;
      was_swapped = true;
      dataset[i].state = states.current;
      if (i == dataset.length) {          // done sorting, break from the loop
        dataset[dataset.length - 1].state = states.finished;
        clearInterval(timer);
      }
    } else {
      was_swapped = false;
      if (dataset[j].value < dataset[j - 1].value) {
        swap(j, j - 1);
        was_swapped = true;
      }
      dataset[j - 1].state = states.compare;
      dataset[j].state = states.finished;
      j--;
    }
    redrawRects(dataset);
  }, speed);
}

//selection implimentation
sorts.bubble = function()
{
  var i, j, maximum_index, isInner, unsort_length;
  j = 0; first = false;
  unsort_length = dataset.length
  timer = setInterval(function()
  {
 
    if (unsort_length-1 == 0)
    {
      clearInterval(timer);
    }  
    if (j !== unsort_length-1){
      maximum_index=j;
 
      //set this as element to swap with
      dataset[j].state = states.current;

      //set current element to being compared 
      dataset[j+1].state = states.compare;

      //current element is new minimum 
      if (dataset[j+1].value < dataset[maximum_index].value)
      {
        //perform the swap
        swap(maximum_index, j);

        //reset last checked element to default
        dataset[j].state = states.default;

        //reset minimum to default
        dataset[maximum_index].state = states.default;

        //set comparing element to finished
        dataset[j].state = states.finished;
      }
      //move on to next element in the array
      j++;
    } else {
      unsort_length = unsort_length - 1;
      j=0;
    }
    redrawRects(dataset);
  }, speed);
}

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

sorts.quick = function()
{
  var quickset = dataset;
  var command_list;
  recursive_sort(command_list, quickset, 0, quickset.length);
  parse_commands(command_list);
}

//incrimentally find values that are in the wrong position in relation to the pivot
function incrimentLeft(quickset, index, pivot, maxIndex)
{
  for(var i = index; i <= maxIndex; i++)
    if(quickset[i].value >= pivot) return i;
}

//incrimentally find values that are in the wrong position in relation to the pivot
function decrimentRight(quickset, index, pivot, minIndex)
{
  for(var i = index; i >= minIndex; i--)
    if(quickset[i].value <= pivot) return i;
}

//trivial swap case
function tmpswap(quickset, a, b)
{
  var tmp = quickset[a];
  quickset[a] = quickset[b];
  quickset[b] = tmp;
}

//determines if a swap is necessary for trivial case
function vectorSort(quickset, a, b)
{
  if(quickset[a].value <= quickset[b].value) return;
  tmpswap(quickset, a, b);
}

//carries out median calculation
function findPivot(quickset, start, size)
{
  //setup
  var stop = start + (size-1);
  var middle = (start + (size/2)) | 0;
  var a = quickset[start].value;//start
  var b = quickset[stop].value;//last
  var c = quickset[middle].value;//middle

  //last is median
  if((b >= a && b <= c)||(b >= c && b <= a))
  {
    tmpswap(quickset, start, stop);
    return;
  }

  //middle is median
  if((c >= a && c <= b)||(c >= b && c <= a))
  {
    tmpswap(quickset, start, middle);
    return;
  }

  //otherwise start is median
}

//totally fun
function recursive_sort(command_list, quickset, start, size)
{
  //base case 1: size is out of index
  if(size < 2) return;

  //base case 2: trivial case has been reached
  if(size == 2)
  {
    //compare and swap visual
    vectorSort(quickset, start, start+1);
    return;
  }

  //pivot finding visual(choose 3, chose median element, swap with first element if not first)
  //both finds pivot and moves it to start
  findPivot(quickset, start, size);

  var pivot = quickset[start].value;

  //draw left and right
  var leftIndex = start+1;
  var rightIndex = start+size-1;

  //copys are so the increment and decrement functions know the edges of their partition
  var copyLeftIndex = leftIndex;
  var copyRightIndex = rightIndex;

  while(leftIndex < rightIndex)
  {
    //move left and right till they point to a value swappable
    //find next pair out of order based on pivot
    leftIndex = incrimentLeft(quickset, leftIndex, pivot, copyRightIndex);
    rightIndex = decrimentRight(quickset, rightIndex, pivot, copyLeftIndex);

    //carry out swap
    if(leftIndex < rightIndex)
    {
      //show the swap
      tmpswap(quickset, leftIndex, rightIndex);

      //keep indices moving in event of ties
      // a special case move right index
      if(quickset[leftIndex].value == pivot && quickset[rightIndex].value == pivot)
        rightIndex -= 1;
    }
    //keep r and l unhighlight any other elements except pivot
  }

  var pivotIndex = leftIndex -1;

  //move pivot to middle of vector
  //swap pivot with the current right index
  tmpswap(quickset, start, pivotIndex);

  //recursion stop here for now, big thing is the inverting of bar directions to represent partitions

  //first half
/*  var firstSize = pivotIndex - start;
  recursive_sort(command_list, quickset, start, firstSize);

  //second half
  var secondSize = size - firstSize - 1;
  recursive_sort(command_list, quickset, leftIndex, secondSize);*/
}

function swap(i, j)
{
  var tmp = dataset[i];
  dataset[i] = dataset[j];
  dataset[j] = tmp;
}

function parse_commands(params)
{
  if(params == null) { console.log("no data to parse"); return; }
  var i = 0; 
  timer = setInterval(function() {
    if (i == params.length) { clearInterval(timer); }
    else if(params[i].isValue === true) { dataset[params[i].index].value = params[i].change; }
    else
    {
      if(params[i].change === "default")
        dataset[params[i].index].state = states.default;
      else if(params[i].change === "finished")
        dataset[params[i].index].state = states.finished;
      else if(params[i].change === "current")
        dataset[params[i].index].state = states.current;
      else if(params[i].change === "compare")
        dataset[params[i].index].state = states.compare;
      else if(params[i].change === "minimal")
        dataset[params[i].index].state = states.minimal;
      else if(params[i].change === "hide")
        dataset[params[i].index].state = states.hide;
      else { console.log("could not parse command: " + params[i].change); }
    }
    i += 1;
    redrawRects(dataset);
  }, speed);
}

// generate random dataset
function setDataset(length) {
  dataset = [];

  //fill the dataset and set to default state
  if(length > 100) length = 100;
  for (var i = 0; i < length; i++)
    dataset[i] = { value: (Math.random() * length * 2) | 0, state: states.default };

  //draw the graphic
  scale = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d) { return d.value; })])
    .range([9, h-15]);
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

  //draw the rectangles
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

  //font size choosing logic
  if(set.length > 50) text_height = "0"
  else if(set.length > 35) text_height = "8"
  else if(set.length > 25) text_height = "12"
  else text_height = "18"

  //draw values
  svg.selectAll("text")
    .data(set)
    .enter()
    .append("text")
    .text(function(d, i) { return d.value;})
    .attr("font-size", text_height)
    .attr("text-anchor", "middle")
    .attr({
      x: function(d, i) {
        return i * (w / set.length) + (w/set.length)/2;
      },
      y: function(d, i) {
        return h - scale(d.value);
      }
    });
}

//update
function redrawRects(set) {
  var rects = svg.selectAll("rect")
    .data(set)
    .transition()
    .duration(speed/2 | 0)
    .ease("quad")
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

  //draw values
  svg.selectAll("text")
    .data(set)
    .transition()
    .duration(speed)
    .ease("quad")
    .tween('text', function(d, i) {
      var currentValue = +this.textContent;
      var interpolator = d3.interpolateRound(currentValue, d.value);
      return function(t) { this.textContent = interpolator(t); };
    })
    .attr({
      y: function(d, i) {
        return h - scale(d.value);
      }
    });
}

//choice logic, will be removed since we have 1 implimentation per page
document.getElementById("implimentation").addEventListener("change", function() {
    implimentation = this.value;
    console.log(implimentation);
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
