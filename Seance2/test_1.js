var clock10;
var idCarre;
var decalage;

function start(){
	idCarre=document.getElementById("carre");
	decalage=0;
	clock10=setInterval(carreRougeG,16);
}

function carreRougeG(){		
	if(decalage+idCarre.clientWidth+1 > document.body.clientWidth){
		clearInterval(clock10);
	}else{
		decalage+=10;
		idCarre.style.right=decalage+"px";
		pauseMillis(100);
	}
}

function pauseMillis(ms){
	var date = new Date();
	var curDate = null;
	do { 
		curDate = new Date(); 
	} while(curDate-date < ms);
}