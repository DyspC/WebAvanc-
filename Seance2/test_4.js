var idAnim;
var idCarre;
var decalage;
var lastframe,newframe;
var dpms=1;
var fps=80

function start(){
	lastframe= new Date();
	idCarre=document.getElementById("carre");
	decalage=0;
	idAnim=requestAnimationFrame(carreRougeG);
}

function carreRougeG(){		
	//if(decalage+idCarre.clientWidth+50 > document.body.clientWidth){
		//clearInterval(clock10);
	
		newframe=new Date();
		if(newframe-lastframe<500){
			decalage+=dpms*(newframe-lastframe);
		}
		lastframe=newframe;
		idCarre.style.right=decalage+"px";
		if(decalage<1500){
			requestAnimationFrame(carreRougeG);
		}
	
}

function pauseMillis(ms){
	var date = new Date();
	var curDate = null;
	do { 
		curDate = new Date(); 
	} while(curDate-date < ms);
}