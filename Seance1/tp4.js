var nombreCarres;
var clock10;
var decalage;

function start(indiceCarre){
	decalage[indiceCarre]=0;
	clock10[indiceCarre]=setInterval("carreRougeD("+indiceCarre+")",10);
	if(indiceCarre+1<nombreCarres){
		setTimeout("start("+(indiceCarre+1)+")",1000);
	}
}

function carreRougeD(indiceCarre){
	if(decalage[indiceCarre]+document.getElementsByClassName("carre")[indiceCarre].clientWidth+1 > document.body.clientWidth){
		clearInterval(clock10[indiceCarre]);
	}else{
		decalage[indiceCarre]+=1;
		document.getElementsByClassName("carre")[indiceCarre].style.left=decalage[indiceCarre]+"px";
	}
}

function loaded(n){
	nombreCarres=n;
	clock10=new Array(nombreCarres);
	decalage=new Array(nombreCarres);
	setTimeout("start(0)",4000);
}