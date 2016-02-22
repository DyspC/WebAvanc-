var clock100;
var idCarre;
var decalage;

function start(){
	idCarre=document.getElementById("carre");
	decalage=0;
	clock100=setInterval(carreRougeD,100);
}

function carreRougeD(){
	if(decalage+idCarre.clientWidth+10 > document.body.clientWidth){
		clearInterval(clock100);
	}else{
		decalage+=10;
		idCarre.style.left=decalage+"px";
	}
}