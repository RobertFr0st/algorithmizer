var arr = [0, 30, 60, 20, 50, 40, 10, 90, 80, 70];
var min_element;
var min_index;
var tmp;

for (var i = 0; i < arr.length; i++) {
  min_element = arr[i];
  for (var j = i; j < arr.length; j++) {
    if (arr[j] <=  min_element) {
      min_element = arr[j];
      min_index = j;
    }
  }
  tmp = arr[i];
  arr[i] = min_element; // or arr[i] = arr[min_index]
  arr[min_index] = tmp;
}

for (var k = 0; k < arr.length; k++) {
  console.log(arr[k]);
}