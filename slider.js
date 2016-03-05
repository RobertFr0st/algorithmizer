function myMove() {
	var elem = document.getElementById("animate");   
	var pos = 0;
	var id = setInterval(frame, 5);
	function frame() {
		if (pos == 150) {
			clearInterval(id);
		} else {
			pos++; 
			elem.style.top = 'px'; 
			elem.style.left = pos +'px';
		}
	} 
}
