var clock10;
var idCarre;
var decalage;
var lastframe,newframe;
var dpms=1;

function start(){
	lastframe= new Date();
	idCarre=document.getElementById("carre");
	decalage=0;
	clock10=setInterval(carreRougeG,16);
}

function carreRougeG(){		
	if(decalage+idCarre.clientWidth+10 > document.body.clientWidth){
		clearInterval(clock10);
	}else{
		newframe=new Date();
		decalage+=dpms*(newframe-lastframe);
		lastframe=newframe;
		idCarre.style.right=decalage+"px";
		pauseMillis(16);
	}
}

function pauseMillis(ms){
	var date = new Date();
	var curDate = null;
	do { 
		curDate = new Date(); 
	} while(curDate-date < ms);
}