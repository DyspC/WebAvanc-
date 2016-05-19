var animFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            null;
var fps=60.;
var lastT;
//Canvas
var divBG;
var canBG;
var conBG;
var divFG;
var canFG;
var conFG;
var divOverlay;
var canOverlay;
var conOverlay;
var canTestPerso;
var conTestPerso;

//Background
var imgBackground=new Image();
imgBackground.src="assets/BG-basement.png";
var xBackgroundOffset = 0;
// var xBackgroundSpeed = 0;
var backgroundWidth=1560;						// default 780/468
var backgroundHeight=936;

///////////////////////////////////
//Keys
var keys = {
    ARR_UP: 38,	// Commandes de tir
    ARR_DOWN: 40,
	ARR_LEFT:37,
	ARR_RIGHT:39,
	
	UP:90,		// Commandes de mouvement
	DOWN:83,
	LEFT:81,
	RIGHT:68,
	
    ITEM: 32,	// Commande item
    USE: 65,
	BOMB:16
};

var keyStatus = {};

function keyDownHandler(event) {
    "use strict"; 
    var keycode = event.keyCode, 
        key; 
    for (key in keys) {
        if (keys[key] === keycode) {
            keyStatus[keycode] = true;
            event.preventDefault();
        }
    }
}
function keyUpHandler(event) {
   var keycode = event.keyCode,
            key;
    for (key in keys) 
        if (keys[key] == keycode) {
            keyStatus[keycode] = false;
        }
        
    }
///////////////////////////////////



//////////////////////////////////
// 	Hero Player
var PlayerScale=14/16;
var imgPlayerHead = new Image();
imgPlayerHead.src = "./assets/Isaac_head.png";
var imgPlayerBody = new Image();
imgPlayerBody.src = "./assets/Isaac_body.png";
var xPlayer = 136;
var yPlayer = 50;
var PlayerSpeed = .15;
var PlayerIndexAnim=0;					// 10 frames
var PlayerImgHeight = 48;
var PlayerImgWidth = 32;
var PlayerHeight=Math.floor(PlayerImgHeight*28/45*PlayerScale);
var PlayerWidth=Math.floor(PlayerImgWidth*PlayerScale);
var PlayerDir=-1;						// -1 = on anime pas et on affiche le corps immobile
var PlayerHeadDir=0;
var PlayerShooting=0;					// 2 frames
//////////////////////////////////

//////////////////////////////////
//	Shoots
var FramesSinceLastShot=0;
var tearDelay=10;
var tearRange=90;		// en nb de frames, la distance se fera en modifiant la vitesse
var tearSpeed=0.1;
var tearDamage=1.35;
var larmesBadass=false;
var tearSprite=new Image();
	tearSprite.src="./assets/Tears.png";
var maxTearCount=50;
var tearIndex=0;
function Tear(posX,posY,speedX,speedY,range){
	this.x=posX;
	this.y=posY;
	this.vx=speedX;
	this.vy=speedY;
	this.range=range;
	this.damage=tearDamage;
	this.splash=false;
	console.log("Larme générée");
}
var listShots=[];
function damageToIndex(damage){
	return 6;			// Valeur par defaut en attendant de faire des vrais tests
}
//////////////////////////////////

//	Room
var xRoom=25,yRoom=8;
var xmRoom=279,ymRoom=127;
var doorState={
	NONE:4,
	OPENED:0,
	CLOSED:1,
	LOCK:2,
	BURST:3
};
var doors={
	UP:doorState.CLOSED,
	DOWN:doorState.CLOSED,
	LEFT:doorState.CLOSED,
	RIGHT:doorState.CLOSED
};

var imgDoor = new Image();
imgDoor.src = "./assets/Porte.png";
var doorH=51;
var doorW=51;

//////////////////////////////////

function initShoots(){
	var i;
	for(i=0;i<maxTearCount;i++){
		listShots[i]=new Tear(-100,-100,0,0,0);
	}
	console.log("Tears Reafy")
}

function genRandPath(X,Y,tarX,tarY){				// Pour les ennemis
	var tab=[]
	var dist=Math.sqrt((tarX-X)*(tarX-X)+(tarY-Y)*(tarY-Y))
	tab[0]=Math.abs(tarX-X)/dist*Math.random();			// On veut pas qu'ils fassent demitour 
	tab[1]=(tarY-Y)/dist*(1-2*Math.random());			// Yolopilote
	return tab;
}


function updateShots(){
	var i;
	var dt=Date.now()-lastT;
	for(i=0;i<maxTearCount;i++){
		if(!listShots[i].splash){
			listShots[i].x+=dt*listShots[i].vx;
			listShots[i].y+=dt*listShots[i].vy;
			listShots[i].range--;
			test_collision(listShots[i]);		// A ecrire, doit tester toutes collision possible et si en trouve une, passe splash a 1 pour l'animation et gere les eventuels dommages et arrivées a court de range
		}else{
			listShots[i].x=-100;
			listShots[i].y=-100;
			listShots[i].vx=0;
			listShots[i].vy=0;
		}
	}
}

function test_collision(tear){
	if(tear.range<1) tear.splash=true;																// Si la larme est au max de portée
	if(tear.x<xRoom || tear.x+15>xmRoom || tear.y<yRoom || tear.y+10> ymRoom) tear.splash=true;			// Si la larme heurte un mur
}

/////////////////////////////////

function updateScene() {
    "use strict"; 
    //xBackgroundOffset = (xBackgroundOffset - xBackgroundSpeed) % backgroundWidth;
	conBG.drawImage(imgBackground, 0,0,780,468, 0,0,canBG.clientWidth/5.15,canBG.clientHeight/6.2)
}

function updateItems() {
    "use strict"; 
    clearItems();
	FramesSinceLastShot++;
	if(FramesSinceLastShot>tearDelay/4){
		PlayerShooting=0;
	}
	PlayerDir=-1;
	PlayerHeadDir=0;
	PlayerIndexAnim+=0.3;
	PlayerIndexAnim%=10;
    var dt=Date.now()-lastT;
	
    var keycode;
    for (keycode in keyStatus) {
            if(keyStatus[keycode] == true){
				//console.log("Pressed : "+keycode);
                if(keycode == keys.UP) { 
				PlayerDir=2;
					if(yPlayer>PlayerSpeed*dt+yRoom){
						yPlayer -= Math.floor(PlayerSpeed*dt);
					}
                }
                if(keycode == keys.DOWN) { 
				PlayerDir=0;
                    if(yPlayer<ymRoom-PlayerSpeed*dt-PlayerHeight){
						yPlayer += Math.floor(PlayerSpeed*dt);
					}
                
				} 
				if(keycode == keys.LEFT) { 
				PlayerDir=1;
                    if(xPlayer>PlayerSpeed*dt+xRoom){
						xPlayer -= Math.floor(PlayerSpeed*dt);
					}
                } 
				if(keycode == keys.RIGHT) { 
				PlayerDir=3;
                    if(xPlayer<xmRoom-PlayerSpeed*dt-PlayerWidth){
						xPlayer += Math.floor(PlayerSpeed*dt);
					}
                } 
				if(keycode == keys.ARR_UP) { 
				PlayerHeadDir=2;
					if(FramesSinceLastShot>tearDelay){
						PlayerShooting=1;
						listShots[tearIndex]= new Tear(xPlayer+(PlayerScale*PlayerImgWidth)*0.35,
															yPlayer+(PlayerScale*PlayerImgHeight)*(-0.2),
															(keyStatus[keys.RIGHT]-keyStatus[keys.LEFT])*tearSpeed/10,
															-tearSpeed+(keyStatus[keys.DOWN]-keyStatus[keys.UP])*tearSpeed/10,
															tearRange);
						tearIndex=(tearIndex+1)%maxTearCount;
						FramesSinceLastShot=0;
					}
                }
                if(keycode == keys.ARR_DOWN) { 
				PlayerHeadDir=0;
					if(FramesSinceLastShot>tearDelay){
						PlayerShooting=1;
						listShots[tearIndex]= new Tear(xPlayer+(PlayerScale*PlayerImgWidth)*0,
															yPlayer+(PlayerScale*PlayerImgHeight)*0.15,
															(keyStatus[keys.RIGHT]-keyStatus[keys.LEFT])*tearSpeed/10,
															tearSpeed+(keyStatus[keys.DOWN]-keyStatus[keys.UP])*tearSpeed/10,
															tearRange);
						tearIndex=(tearIndex+1)%maxTearCount;
						FramesSinceLastShot=0;
					}
                } 
				if(keycode == keys.ARR_LEFT) { 
				PlayerHeadDir=1;
					if(FramesSinceLastShot>tearDelay){
						PlayerShooting=1;
						listShots[tearIndex]= new Tear(xPlayer+(PlayerScale*PlayerImgWidth)*0,
															yPlayer+(PlayerScale*PlayerImgHeight)*0.05,
															-tearSpeed+(keyStatus[keys.RIGHT]-keyStatus[keys.LEFT])*tearSpeed/10,
															(keyStatus[keys.DOWN]-keyStatus[keys.UP])*tearSpeed/10,
															tearRange);
						tearIndex=(tearIndex+1)%maxTearCount;
						FramesSinceLastShot=0;
					}
                } 
				if(keycode == keys.ARR_RIGHT) { 
				PlayerHeadDir=3;
					if(FramesSinceLastShot>tearDelay){
						PlayerShooting=1;
						listShots[tearIndex]= new Tear(xPlayer+(PlayerScale*PlayerImgWidth)*0.35,
															yPlayer+(PlayerScale*PlayerImgHeight)*0.05,
															tearSpeed+(keyStatus[keys.RIGHT]-keyStatus[keys.LEFT])*tearSpeed/10,
															(keyStatus[keys.DOWN]-keyStatus[keys.UP])*tearSpeed/10,
															tearRange);
						tearIndex=(tearIndex+1)%maxTearCount;
						FramesSinceLastShot=0;
					}
                } 
				/*
                if(keycode == keys.SPACE) { 
					console.log("Pressed key : Space")
					if(FramesSinceLastShot>tearDelay){
						listShots[tearIndex].x=xPlayer+(PlayerScale*PlayerImgWidth)*0.9;
						listShots[tearIndex].y=yPlayer+(PlayerScale*PlayerImgHeight)/2;
						listShots[tearIndex].vx=xBackgroundSpeed/10;
						listShots[tearIndex].vy=0;
						tearIndex=(tearIndex+1)%maxTearCount;
						FramesSinceLastShot=0;
					}
					
                }*/
					
            }
        //keyStatus[keycode] = false;			// Commenté pour authoriser l'appui continu avec plusieurs touches
    }
	updateShots();
	
}

function drawScene() {
    "use strict"; 
    //canBG.style.backgroundPosition = xBackgroundOffset + "px 0px" ;
}
function drawItems() {
    "use strict"; 
	var i;
	conFG.drawImage(imgDoor,doors.UP*doorW,0*doorH,doorW,doorH,139, 5,doorW*0.5,doorH*0.5);
	conFG.drawImage(imgDoor,doors.RIGHT*doorW,1*doorH,doorW,doorH,265, 63,doorW*0.6,doorH*0.5);
	conFG.drawImage(imgDoor,doors.DOWN*doorW,2*doorH,doorW,doorH,139, 121,doorW*0.5,doorH*0.5);
	conFG.drawImage(imgDoor,doors.LEFT*doorW,3*doorH,doorW,doorH,8, 63,doorW*0.6,doorH*0.5);
	
	if(PlayerDir==-1){
		conTestPerso.drawImage(imgPlayerBody,0,0,32,32,0,16,128,128);
	}else{
		conTestPerso.drawImage(imgPlayerBody,32*Math.floor(PlayerIndexAnim),32*PlayerDir,32,32,0,16,128,128);
	}
	conTestPerso.drawImage(imgPlayerHead,32*PlayerShooting,28*PlayerHeadDir,32,28,0,0,128,112);
	
	conFG.drawImage(canTestPerso,0,0,128,128+16,xPlayer,yPlayer,PlayerWidth,PlayerHeight);
	
	for(i=0;i<maxTearCount;i++){
		if(listShots[i].splash) {
			conFG.drawImage(tearSprite, 13*32,0,64,64, listShots[i].x,listShots[i].y,20,20);
		}else{
			conFG.drawImage(tearSprite, damageToIndex(listShots[i].damage)*32,32*(larmesBadass!=0),32,32, listShots[i].x,listShots[i].y,20,20);
		}
	}
}
function clearItems() {			// Efface tout le contenu du bg, pas souhaité
    "use strict"; 
	canFG.width=canFG.width;
	canTestPerso.width=canTestPerso.width;
}

function updateGame() {
    "use strict"; 
	
    updateScene();
    updateItems();
	lastT=Date.now();
}

function drawGame() {
    "use strict"; 
    drawScene();
    drawItems();    
}


function mainloop () {
    "use strict"; 
    updateGame();
    drawGame();
}

function recursiveAnim () {
    "use strict"; 
    if(anim) mainloop();
	setTimeout("request=animFrame( recursiveAnim )",1000/fps);
}
 
function init() {
    "use strict";
	

    divBG = document.getElementById("BG");
    divFG = document.getElementById("FG");
    divOverlay = document.getElementById("Overlay");
	
    canBG = document.createElement("canvas");
    canBG.setAttribute("id", "canBG");
    conBG = canBG.getContext("2d");
    divBG.appendChild(canBG);
	
	canFG = document.createElement("canvas");
    canFG.setAttribute("id", "canFG");
    conFG = canFG.getContext("2d");
    divFG.appendChild(canFG);
	
	canOverlay = document.createElement("canvas");
    canOverlay.setAttribute("id", "canOverlay");
    conOverlay = canOverlay.getContext("2d");
    divOverlay.appendChild(canOverlay);
	
	canTestPerso = document.createElement("canvas");
    canTestPerso.setAttribute("id", "canTestPerso");
    conTestPerso = canTestPerso.getContext("2d");
    document.getElementById("test_perso").appendChild(canTestPerso);
	
	initShoots();
window.addEventListener("keydown", keyDownHandler, false);
window.addEventListener("keyup", keyUpHandler, false);
    lastT=Date.now()
    animFrame( recursiveAnim );
    
}

var request;
var anim=true;
window.addEventListener("load", init, false);
