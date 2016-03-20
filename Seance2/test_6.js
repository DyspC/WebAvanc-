var idAnim=0;
var fps=10;
var canvas=document.getElementById("canvas")
var ctx=canvas.getContext('2d');
var taillecaseX=canvas.clientWidth/7;
var taillecaseY=canvas.clientHeight/7;
var playerSprite=new Image();
	playerSprite.src="highresplayer.png";
var coinSprites=new Image();
	coinSprites.src="coin-sprite-animation.png";
var sens=1;
var indexAnim=0;

function anime(){
	ctx.clearRect(0,0,taillecaseX,taillecaseY);
	ctx.drawImage(coinSprites,100*indexAnim,0,100,100,0,0,taillecaseX,taillecaseY);
	ctx.fill();
	indexAnim+=sens;
	while(indexAnim<0){
		indexAnim+=10;
	}
	indexAnim%=10;
	//console.log(indexAnim);
	setTimeout("idAnim=requestAnimationFrame(anime)",1000./fps);
}


function start(){
	sens=(-1)*sens;
}

idAnim=requestAnimationFrame(anime);