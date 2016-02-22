var curseurDecompte;
var clock;

function decompte(){
	curseurDecompte--;
	document.getElementById("compteur").innerHTML=curseurDecompte;
	if(curseurDecompte===0){
		clearInterval(clock);
	}
}

function start(){
	curseurDecompte=10;
	document.getElementById("compteur").innerHTML=curseurDecompte;
	clock=setInterval(decompte,1000)
}