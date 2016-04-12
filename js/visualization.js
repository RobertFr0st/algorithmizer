// custom variables
var w = 500, h = 190,
    element_count = 15, speed = 50,
    dataset, scale, padding = 2, timer,
    states = {"default": 0, "finished": 1, "current": 2, "compare": 3, "minimal": 4, "hide": 5, "pivot": 6, "left": 7, "right": 8},
    colors = ["#B7C4CF", "#3565A1", "#D55511", "#74A82A", "#A42F11", "#fff", "#0f6727", "#14b8e4", "#e3361e"],
    svg;

//now call me like var p = new Command(false, index, "finished") //
//now call me like var p = new Command(true, index, new_value) //change value of 1 bar
//now call me like var p = new Command(2, from_index, to_index) //swap command
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

sorts.insertion = function()
{
  var insertionset = dataset.slice(0);
  var command_list = [];
  insertion_sort(command_list, insertionset);
  parse_commands(command_list);

}

function insertion_sort(command_list, insertionset)
{
  for (var i = 1; i < insertionset.length; i++) {
    for (var j = i; j >= 1 && insertionset[j].value < insertionset[j-1].value; j--) {
      
      command_list.push(new Command(false, j, "compare"));
      command_list.push(new Command(false, j-1, "compare"));
      tmpswap(command_list, insertionset, j-1, j);
      
      command_list.push(new Command(false, j-1, "default"));
      command_list.push(new Command(false, j, "default"));
    }
  }

  for(var i = insertionset.length -1; i >= 0; i--)
    command_list.push(new Command(false, i, "finished"));
}

//selection implimentation
sorts.bubble = function()
{
  var j, isInner, unsort_length;
  j = 0; doswap = false; swapped = false;
  unsort_length = dataset.length
  timer = setInterval(function()
  {
	if (swapped == true) swapped =false;
	if (j > 0){
	   dataset[j-1].state = states.default;
	   dataset[j].state = states.default;
		if (doswap === true){
			swap(j, j-1);
			doswap = false;
			swapped = true;
		}
	}
    if (unsort_length-1 == 0)
    {
      clearInterval(timer);
    }
	if (swapped == false){
    if (j < unsort_length-1){
      //set this as element to swap with
      dataset[j].state = states.current;
      dataset[j+1].state = states.compare;


      //current element is new minimum 
      if (dataset[j+1].value < dataset[j].value)
      {
        doswap = true;
      }

	j++;
    } else {
	  dataset[j].state = states.finished;
      unsort_length = unsort_length - 1;
      j=0;
    }
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

sorts.heap = function()
{
  var heapset = dataset.slice(0);
  var command_list = [];
  sort_heap(command_list, heapset);
  parse_commands(command_list);
}

sorts.quick = function()
{
  var quickset = dataset.slice(0);
  var command_list = [];
  recursive_sort(command_list, quickset, 0, quickset.length);
  parse_commands(command_list);
}

function incrimentLeft(command_list, quickset, index, pivot, maxIndex)
{
  for(var i = index; i <= maxIndex; i++)
  {
    command_list.push(new Command(false, i, "left"));
    if(quickset[i].value >= pivot) return i;
    command_list.push(new Command(false, i, "default"));
  }
}

//incrimentally find values that are in the wrong position in relation to the pivot
function decrimentRight(command_list, quickset, index, pivot, minIndex)
{
  for(var i = index; i >= minIndex; i--)
  {
    command_list.push(new Command(false, i, "right"));
    if(quickset[i].value <= pivot) return i;
    command_list.push(new Command(false, i, "default"));
  }
}

//trivial swap case
function tmpswap(command_list, quickset, a, b)
{
  //swap states and values
  command_list.push(new Command(2, a, b));

  var tmp = quickset[a];
  quickset[a] = quickset[b];
  quickset[b] = tmp;
}

//determines if a swap is necessary for trivial case
function vectorSort(command_list, quickset, a, b)
{
  command_list.push(new Command(false, a, "compare"));
  command_list.push(new Command(false, b, "compare"));
  if(quickset[a].value <= quickset[b].value) return;
  tmpswap(command_list, quickset, a, b);
}

//carries out median calculation
function findPivot(command_list, quickset, start, size)
{
  //mark bars for comparison

  //setup
  var stop = start + (size-1);
  var middle = (start + (size/2)) | 0;
  var a = quickset[start].value;//start
  var b = quickset[stop].value;//last
  var c = quickset[middle].value;//middle

  //visualize compares
  command_list.push(new Command(false, start, "compare"));
  command_list.push(new Command(false, stop, "compare"));
  command_list.push(new Command(false, middle, "compare"));

  //last is median
  if((b >= a && b <= c)||(b >= c && b <= a))
  {
    command_list.push(new Command(false, stop, "pivot"));
    command_list.push(new Command(false, start, "default"));
    command_list.push(new Command(false, middle, "default"));
    tmpswap(command_list, quickset, start, stop);
    return;
  }

  //middle is median
  if((c >= a && c <= b)||(c >= b && c <= a))
  {
    command_list.push(new Command(false, middle, "pivot"));
    command_list.push(new Command(false, stop, "default"));
    command_list.push(new Command(false, start, "default"));
    tmpswap(command_list, quickset, start, middle);
    return;
  }

  //otherwise start is median
  command_list.push(new Command(false, start, "pivot"));
  command_list.push(new Command(false, middle, "default"));
  command_list.push(new Command(false, stop, "default"));
}

//totally fun
function recursive_sort(command_list, quickset, start, size)
{
  //base case 1: size is out of index
  if(size < 2)
  {
    command_list.push(new Command(false, start, "finished"));
    return;
  }

  //base case 2: trivial case has been reached
  if(size == 2)
  {
    //compare and swap visual
    vectorSort(command_list, quickset, start, start+1);
    command_list.push(new Command(false, start, "finished"));
    command_list.push(new Command(false, start+1, "finished"));
    return;
  }

  //both finds pivot and moves it to start
  findPivot(command_list, quickset, start, size);

  var pivot = quickset[start].value;

  //draw left and right
  var leftIndex = start+1;
  var rightIndex = start+size-1;

  //copys are so the increment and decrement functions know the edges of their partition
  var copyLeftIndex = leftIndex;
  var copyRightIndex = rightIndex;

  while(leftIndex < rightIndex)
  {
    //find next pair out of order based on pivot
    leftIndex = incrimentLeft(command_list, quickset, leftIndex, pivot, copyRightIndex);
    rightIndex = decrimentRight(command_list, quickset, rightIndex, pivot, copyLeftIndex);

    //carry out swap
    if(leftIndex < rightIndex)
    {
      command_list.push(new Command(false, leftIndex, "compare"));
      command_list.push(new Command(false, rightIndex, "compare"));

      //show the swap
      tmpswap(command_list, quickset, leftIndex, rightIndex);


      command_list.push(new Command(false, leftIndex, "default"));
      command_list.push(new Command(false, rightIndex, "default"));

      //keep indices moving in event of ties
      if(quickset[leftIndex].value == pivot && quickset[rightIndex].value == pivot)
        rightIndex -= 1;
    }
  }
  command_list.push(new Command(false, leftIndex, "default"));
  command_list.push(new Command(false, rightIndex, "default"));

  var pivotIndex = leftIndex -1;

  //move pivot to middle of vector
  tmpswap(command_list, quickset, start, pivotIndex);

  //first half
  var firstSize = pivotIndex - start;
  recursive_sort(command_list, quickset, start, firstSize);

  //second half
  var secondSize = size - firstSize - 1;
  recursive_sort(command_list, quickset, leftIndex, secondSize);

  //mark pivot as finished
  command_list.push(new Command(false, pivotIndex, "finished"));
}

//commandlist.push(new Command(false, leftchild, "default"));
function sort_heap(commandlist, mergeset)
{
  // Turn into a heap where the root is the maximum element 
//states = {"default": 0, "finished": 1, "current": 2, "compare": 3, "minimal": 4, "hide": 5, "pivot": 6, "left": 7, "right": 8},
  for (var i = ((mergeset.length / 2) | 0); i >= 0; i--)
  {
    var index = i;
    var okay = true;
    while(okay)
    {
      if(index == i) 
        commandlist.push(new Command(false, index, "pivot"));
      var leftchild = index*2+1;
      var rightchild = leftchild+1;

      if (leftchild >= mergeset.length)
      {
        commandlist.push(new Command(false, index, "default"));
        break;
      }

      commandlist.push(new Command(false, leftchild, "left"));
      if(rightchild != mergeset.length)
        commandlist.push(new Command(false, rightchild, "right"));

      if (rightchild == mergeset.length || mergeset[leftchild].value >= mergeset[rightchild].value)
      {
        //left child bigger than parent swap
        if (mergeset[leftchild].value > mergeset[index].value)
        {
          commandlist.push(new Command(false, leftchild, "compare"));
          tmpswap(commandlist, mergeset, leftchild, index)
          commandlist.push(new Command(false, index, "default"));
          index = leftchild;
          commandlist.push(new Command(false, leftchild, "pivot"));
        }
        else
        {
          commandlist.push(new Command(false, index, "default"));
          okay = false;
        }
      }
      else if (mergeset[rightchild].value > mergeset[index].value)
      {
        commandlist.push(new Command(false, rightchild, "compare"));
        tmpswap(commandlist, mergeset, rightchild, index)
        commandlist.push(new Command(false, index, "default"));
        index = rightchild;
        commandlist.push(new Command(false, rightchild, "pivot"));
      }
      else
      {
        commandlist.push(new Command(false, index, "default"));
        okay = false;
      }

      if(index != leftchild)
        commandlist.push(new Command(false, leftchild, "default"));
      if(rightchild != mergeset.length && index != rightchild)
        commandlist.push(new Command(false, rightchild, "default"));
    }
  }

  // Now remove each element from the root of the heap and put it at the end of the array,
  // and percolate down.

  for (var i = mergeset.length - 1; i > 0; i--)
  {
    commandlist.push(new Command(false, 0, "current"));
    tmpswap(commandlist, mergeset, i, 0)
    commandlist.push(new Command(false, i, "finished"));
    var index = 0;
    var okay = true;
    while(okay)
    {
      if(index == 0)
        commandlist.push(new Command(false, index, "pivot"));
      var leftchild = index*2+1;
      var rightchild = leftchild+1;
      if (leftchild >= i)
      {
        commandlist.push(new Command(false, index, "default"));
        break;
      }

      commandlist.push(new Command(false, leftchild, "left"));
      if(rightchild != i)
        commandlist.push(new Command(false, rightchild, "right"));

      if (rightchild == i || mergeset[leftchild].value >= mergeset[rightchild].value)
      {
        if (mergeset[leftchild].value > mergeset[index].value)
        {
          commandlist.push(new Command(false, leftchild, "compare"));
          tmpswap(commandlist, mergeset, leftchild, index)
          commandlist.push(new Command(false, index, "default"));
          index = leftchild;
          commandlist.push(new Command(false, leftchild, "pivot"));
        }
        else
        {
          commandlist.push(new Command(false, index, "default"));
          okay = false;
        }
      }
      else if (mergeset[rightchild].value > mergeset[index].value)
      {

        commandlist.push(new Command(false, rightchild, "compare"));
        tmpswap(commandlist, mergeset, rightchild, index)
        commandlist.push(new Command(false, index, "default"));
        index = rightchild;
        commandlist.push(new Command(false, rightchild, "pivot"));
      }
      else
      {
        commandlist.push(new Command(false, index, "default"));
        okay = false;
      }

      if(index != leftchild)
        commandlist.push(new Command(false, leftchild, "default"));
      if(rightchild != i && index != rightchild)
        commandlist.push(new Command(false, rightchild, "default"));
    }
  }
  commandlist.push(new Command(false, 0, "finished"));
}

function swap(i, j)
{
  var tmp = dataset[i];
  dataset[i] = dataset[j];
  dataset[j] = tmp;
}

function parse_commands(params)
{
  var i = 0; 
  timer = setInterval(function() {

    if (i == params.length) { clearInterval(timer); }
    else if(params[i].isValue == 1) { dataset[params[i].index].value = params[i].change; }
    else if(params[i].isValue == 2)
    {
      swap(params[i].index, params[i].change);
    }
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
      else if(params[i].change === "pivot")
        dataset[params[i].index].state = states.pivot;
      else if(params[i].change === "left")
        dataset[params[i].index].state = states.left;
      else if(params[i].change === "right")
        dataset[params[i].index].state = states.right;
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

  var implimentation = $("#graph").parent().attr("id");
  sorts[implimentation]();
});
