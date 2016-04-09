var bardata = [9,7,2,1,14,3,7];
var colors=['#6699ff','#6699ff','#6699ff','#6699ff','#6699ff','#6699ff','#6699ff'];
var height = 400,
    width = 600,
    barWidth = 50,
    barOffset = 5;
/*
var colors = d3.scale.linear()
  .domain([0 , bardata.length*.33, bardata.length*.66, bardata.length])
  .range(["yellow", "teal", "blue", "red", ])
*/
var yScale = d3.scale.linear()
  .domain([0, d3.max(bardata)])
  .range([0, height])

var xScale = d3.scale.ordinal()
  .domain(d3.range(0,bardata.length))
  .rangeBands([0,width])

d3.select('#chart').append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g') 
    .selectAll('rect').data(bardata)
    .enter().append('rect').attr('class', 'bars')
      .style('fill', function(d,i){
      return colors[i];
         })
      .attr('width', xScale.rangeBand()-1)
      .attr('height', function(d) {
      return yScale(d);
         })
      .attr('x', function(d,i){
      return xScale(i);
        })
      .attr('y', function(d){
      return (height - yScale(d));
        })


var step = -1
var message = [ 
"Your data: ".concat( bardata.toString()),

"Split vector on half:select first half",
"Split on another half :select first half",
"We have 2 elements, compare and swap",
"Split vector on another half: select a second half",
"We have 2 elemnts, compare and swap",
"Merge two halves: compare 7 and 1",
"Merge two halves: 1 < 7, merge 1 to new position ",
"Merge two halves: compare 7 and 2",
"Merge two halves: 2 < 7 , merge 2 to new position",
"Merge two halfs: 7 and 9 belong to one half, so just merge the whole half to new position",

"Split vector on half: select second half",
"Split on another half : select first half",
"We have 1 element, return it",
"Split on another half : Select a second half ",
"We have 2 elements: compare and swap",
"Merge two halves: compare 14 and 3",
"Merge two halves: 3 < 14, merge 3 to new position ",
"Merge two halves: compare 14 and 7",
"Merge two halves: 7 < 14 , merge 7 to new position",
"Merge two halfs: 1 elent left, move it to new position",


"Merge two halves: compare 1 and 3",
"Merge two halves: 1 < 3, merge 1 to new position ",
"Merge two halves: compare 2 and 3",
"Merge two halves: 2 < 3, merge 2 to new position ",
"Merge two halves: compare 7 and 3",
"Merge two halves:  7 > 3, merge 3 to new position",
"Merge two halves: compare 7 and 7",
"Merge two halves:  7 = 7, merge left 7 to new position",
"Merge two halves: compare 9 and 7",
"Merge two halves: 7 < 9, merge 7 to new position ",
"Merge two halves: 2 elements left ",
"Merge two halves: move them to new position ",
"VECTOR is SORTED",
]

var bardata1 = [
[9,7,2,1,14,3,7],

[9,7,2,1,14,3,7],
[9,7,2,1,14,3,7],
[7,9,2,1,14,3,7],
[7,9,2,1,14,3,7],
[7,9,1,2,14,3,7],
[7,9,1,2,14,3,7],
[1,7,9,2,14,3,7],
[1,7,9,2,14,3,7],
[1,2,7,9,14,3,7],
[1,2,7,9,14,3,7],

[1,2,7,9,14,3,7],
[1,2,7,9,14,3,7],
[1,2,7,9,14,3,7],
[1,2,7,9,14,3,7],
[1,2,7,9,14,3,7],
[1,2,7,9,14,3,7],
[1,2,7,9,3,14,7],
[1,2,7,9,3,14,7],
[1,2,7,9,3,7,14],
[1,2,7,9,3,7,14],

[1,2,7,9,3,7,14],
[1,2,7,9,3,7,14],
[1,2,7,9,3,7,14],
[1,2,7,9,3,7,14],
[1,2,7,9,3,7,14],
[1,2,3,7,9,7,14],
[1,2,3,7,9,7,14],
[1,2,3,7,9,7,14],
[1,2,3,7,9,7,14],
[1,2,3,7,7,9,14],
[1,2,3,7,7,9,14],
[1,2,3,7,7,9,14],
[1,2,3,7,7,9,14],
];
var colors1 = [
['#6699ff','#6699ff','#6699ff','#6699ff','#6699ff','#6699ff','#6699ff'],

['purple','purple','purple','purple','#6699ff','#6699ff','#6699ff'],
['pink','pink','purple','purple','#6699ff','#6699ff','#6699ff'],
['gold','gold','purple','purple','#6699ff','#6699ff','#6699ff'],
['gold','gold','pink','pink','#6699ff','#6699ff','#6699ff'],
['gold','gold','yellow','yellow','#6699ff','#6699ff','#6699ff'],
['orange','gold','orange','yellow','#6699ff','#6699ff','#6699ff'],
['green','gold','gold','yellow','#6699ff','#6699ff','#6699ff'],
['green','orange','gold','orange','#6699ff','#6699ff','#6699ff'],
['green','green','gold','gold','#6699ff','#6699ff','#6699ff'],
['green','green','green','green','#6699ff','#6699ff','#6699ff'],

['green','green','green','green','purple','purple','purple'],
['green','green','green','green','pink','purple','purple'],
['green','green','green','green','gold','purple','purple'],
['green','green','green','green','gold','pink','pink'],
['green','green','green','green','gold','yellow','yellow'],
['green','green','green','green','orange','orange','yellow'],
['green','green','green','green','blue','gold','yellow'],
['green','green','green','green','blue','orange','orange'],
['green','green','green','green','blue','blue','gold'],
['green','green','green','green','blue','blue','blue'],


['orange','green','green','green','orange','blue','blue'],
['red','green','green','green','blue','blue','blue'],
['red','orange','green','green','orange','blue','blue'],
['red','red','green','green','blue','blue','blue'],
['red','red','orange','green','orange','blue','blue'],
['red','red','red','green','blue','blue','blue'],
['red','red','red','orange','orange','blue','blue'],
['red','red','red','red','green','blue','blue'],
['red','red','red','red','orange','orange','blue'],
['red','red','red','red','red','green','blue'],
['red','red','red','red','red','orange','orange'],
['red','red','red','red','red','red','red'],
['red','red','red','red','red','red','red']
]


d3.select("#next").on('click', function(){
  step++;
  d3.selectAll('.bars')
    .data(bardata1[step])
    .attr('height', function(d) {
      return yScale(d);
    })
    .attr('y', function(d){
      return (height - yScale(d));
    })
    .style('fill', function(d,i){
      return colors1[step][i];
         })
    .append("text").text(function(d){return d3.format(".2s")})

    d3.select("#message").text(message[step])
    
})
d3.select("#prev").on('click', function(){
  step--;
  d3.selectAll('.bars')
    .data(bardata1[step])
    .attr('height', function(d) {
      return yScale(d);
    })
    .attr('y', function(d){
      return (height - yScale(d));
    })
      .style('fill', function(d,i){
      return colors1[step][i];
         })
    d3.select("#message").text(message[step])
    
})



