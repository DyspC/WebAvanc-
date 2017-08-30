var player=new HitboxRond(136,50,13,21,7);
	player.height=26;
	player.width=28;
	player.indexAnim=0; 
	player.imgHead=new Image();
	player.imgBody=new Image();
	player.bodyDir=-1;					// 10 frames	// -1 = on anime pas et on affiche le corps immobile
	player.headDir=0;
	player.shooting=0;					// 2 frames
	player.hurt=0;
	player.alive=true;
	
	player.health=3;
	player.coins=0;
	player.bombs=0;
	player.keys=0;
	player.speed=.15;					

	player.draw=function(){
		if(this.bodyDir==-1){
			conTestPerso.drawImage(this.imgBody,0,0,32,32,0,16,128,128);
		}else{
			conTestPerso.drawImage(this.imgBody,32*Math.floor(this.indexAnim),32*this.bodyDir,32,32,0,16,128,128);
		}
		conTestPerso.drawImage(this.imgHead,32*this.shooting,28*this.headDir,32,28,0,0,128,112);
		conFG.drawImage(canTestPerso,0,0,128,128+16,this.x,this.y,this.width,this.height);
		return 0;
	}
	player.drawHitbox=function(){
		conFG.beginPath();
		conFG.arc(this.x+(this.xOffset||0),this.y+(this.yOffset||0),this.rayon,0,2*Math.PI,false);
		conFG.fillStyle="violet";
		conFG.fill();
	}



var assetsPath = "https://raw.githubusercontent.com/DyspC/WebAvance/master/Upload%20git%20projet/assets/"
// Chargement des images au debut lolu

var imgBackground=new Image();
imgBackground.src=assetsPath+"BG-basement.png";

var imgHitbox=new Image();
imgHitbox.src=assetsPath+"hitbox.png";

player.imgHead.src = assetsPath+"Isaac_head.png";
player.imgBody.src = assetsPath+"Isaac_body.png";


var tearSprite=new Image();
	tearSprite.src=assetsPath+"Tears.png";


var imgDoor = new Image();
imgDoor.src = assetsPath+"Porte.png";

//---------------------------------



var animFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            null;
var fps=60.;
var lastT;
var clockAnim=0;
var nbKills=0;
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
// var xBackgroundOffset = 0;
// var xBackgroundSpeed = 0;
var backgroundWidth=1560;
var backgroundHeight=936;
///////////////////////////////////
// Fonctions pour log dans al zone de texte

function log(aString){
	document.getElementById("logZone").innerHTML+=aString+"\n ";
	document.getElementById("logZone").scrollTop = document.getElementById("logZone").scrollHeight
}
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
	
    ITEM: 32,	// Commande item = key space
    USE: 65,	// = key A
	BOMB:16		// = key shift
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

function HitboxMur(top_left_x,top_left_y,width,height){
	this.x=top_left_x;
	this.y=top_left_y;
	this.width=width;
	this.height=height;
	this.collision=function(aHitboxRond){
		var centreX=(aHitboxRond.xOffset || 0)+aHitboxRond.x;
		var centreY=(aHitboxRond.yOffset || 0)+aHitboxRond.y;
		return (centreX>this.x-aHitboxRond.rayon)&&(centreX<this.x+this.width+aHitboxRond.rayon)&&(centreY>this.y-aHitboxRond.rayon)&&(centreY<this.y+this.height+aHitboxRond.rayon)
	}
}

function HitboxRond(x,y,xOffset,yOffset,rayon){
	this.x=x;
	this.y=y;
	this.xOffset=xOffset;
	this.yOffset=yOffset;
	this.rayon=rayon;
	this.collision=function(aHitboxRond){			// Test de collision rond vs rond
		var centreX=aHitboxRond.x+(aHitboxRond.xOffset || 0);
		var centreY=aHitboxRond.y+(aHitboxRond.yOffset || 0);
		return (distance(centreX,centreY,this.x+this.xOffset,this.y+this.yOffset) < (this.rayon+aHitboxRond.rayon));
	}
}


function distance(xa,ya,xb,yb){
	return Math.sqrt((xb-xa)*(xb-xa)+(yb-ya)*(yb-ya));
}

function distanceHB(HBa,HBb){
	return distance(HBa.x+HBa.xOffset,HBa.y+HBa.yOffset,HBb.x+HBb.xOffset,HBb.y+HBb.yOffset);
}


//////////////////////////////////
// 	Hero Player

var afficheHitbox=false;



//////////////////////////////////
//	Boosts

function killHandler(){
	nbKills++;
	log("Killed "+nbKills+" foe"+((nbKills>1)?"s":""));
	if(!(nbKills%10)){
		tearDamage*=1.2;
		log(" Damage Up !")
	}
	
	if(nbKills==50){
		larmesBadass=true;
		log(" The pauline flows through my eyes !")			// Lolu c'est cosmetique
	}
	if(!(nbKills%5)){
		player.speed*=1.05;
		log(" Speed Up !")
	}
	if(!(nbKills%30)){
		foeHealth+=10;
		spawnDelay/=1.5
		log(" Ennemies just got harder !")
	}
	if(!(nbKills%25)){
		foeSpeed*=1.1;
		log(" They're quick !")
	}
	if(!(nbKills%20)){
		tearDelay/=1.2;
		log(" Tears Up !")
	}
	
}
//////////////////////////////////
//	Shoots
var FramesSinceLastShot=0;
var tearDelay=10;
var tearRange=90;		// en nb de frames, la distance se fera en modifiant la vitesse
var tearSpeed=0.15;
var tearDamage=3.5;
var larmesBadass=false;
var pokemon=false;
var maxTearCount=50;
var tearIndex=0;
//var matTear = matRond(10);
// Tear.prototype=new Hitbox()
function Tear(posX,posY,speedX,speedY,range){
	// Tear.prototype=new Hitbox(posX,posY,10,10,matTear);
	this.x=posX;
	this.y=posY;
	this.rayon=5;
	this.vx=speedX;
	this.vy=speedY;
	this.xOffset=10;
	this.yOffset=10;
	this.range=range;
	this.damage=tearDamage;
	this.splash=false;
	this.draw=function(){
		if(this.splash) {
			conFG.drawImage(tearSprite, 13*32,0,64,64, this.x,this.y,20,20);
		}else{
			conFG.drawImage(tearSprite, damageToIndex(this.damage)*32,32*(larmesBadass!=0),32,32, this.x,this.y,20,20);
		}
	}
	this.drawHitbox=function(){
		conFG.beginPath();
		conFG.arc(this.x+(this.xOffset||0),this.y+(this.yOffset||0),this.rayon,0,2*Math.PI,false);
		conFG.fillStyle="green";
		conFG.fill();
	}
	this.collision=function(aHitboxRond){			// Test de collision rond vs rond
		var centreX=aHitboxRond.xOffset || 0;
		var centreY=aHitboxRond.yOffset || 0;
				//console.log(centreX,centreY,this.x+this.xOffset,this.y+this.yOffset)
		if(distance(aHitboxRond.x+centreX,aHitboxRond.y+centreY,this.x+this.xOffset,this.y+this.yOffset) < (this.rayon+aHitboxRond.rayon)) return true;
		return false;
		
	}
	/* this.collision=function(aHitbox){			// Test de collision rond vs qq	= buggy
		var i,j;
		 if(Math.abs(this.x+this.rayon-aHitbox.x-aHitbox.width/2)<(this.rayon+aHitbox.width/2) && Math.abs(this.y+this.rayon-aHitbox.y-aHitbox.height/2)<(this.rayon+aHitbox.height/2)){
			 console.log("distance")
			 // return true;				// Test tempo avant de faire des tests sur le contenu de aHitbox
			 for(i=0;i<aHitbox.height;i++){		// i=Math.max(0,this.y);i<Math.min(this.y+2*this.rayon,aHitbox.height);i++
				 //console.log("premier for")
				 //anim=false;		// Pour couper l'animation a la detection et faire des tests
				 for(j=0;j<aHitbox.width;j++){
					 if(aHitbox.matrice[i][j]){
					//	 console.log("Larme en "+ (this.x+this.rayon) +" , "+(this.y+this.rayon))
					//	 console.log("Test sur Hitbox en "+(aHitbox.x+j-this.x)+" , "+(aHitbox.y+i-this.y))
						 if(distance(this.x+this.rayon,this.y+this.rayon,aHitbox.x+j-this.x,aHitbox.y+i-this.y)<this.rayon)return true
					 }
				 }
			 }
			 
		 }
		 return false;
		
	}
	*/
	
	// console.log("Larme générée");
}
var listShots=[];
function damageToIndex(damage){
	return 7;			// Valeur par defaut en attendant de faire des vrais tests
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
	RIGHT:doorState.CLOSED,
	height:51,
	width:51
};

doors.draw=function(){
	conFG.drawImage(imgDoor,this.UP*this.width,0*this.height,this.width,this.height,139, 5,this.width*0.5,this.height*0.5);
	conFG.drawImage(imgDoor,this.RIGHT*this.width,1*this.height,this.width,this.height,265, 63,this.width*0.6,this.height*0.5);
	conFG.drawImage(imgDoor,this.DOWN*this.width,2*this.height,this.width,this.height,139, 121,this.width*0.5,this.height*0.5);
	conFG.drawImage(imgDoor,this.LEFT*this.width,3*this.height,this.width,this.height,8, 63,this.width*0.6,this.height*0.5);
}	

var walls={
	TOP:new HitboxMur(25,17,250,9),
	BOTTOM:new HitboxMur(20,126,254,14),
	LEFT:new HitboxMur(15,15,19,120),
	RIGHT:new HitboxMur(268,15,15,120)
};


//////////////////////////////////
//	 Foes
var listFoes=[];
var maxFoeCount=200;
var spawnDelay=2*fps;
var foeIndex=0;
var foeHealth=20;
var foeSpeed=0.09;

function Bouboule(x,y){
	this.x=x;
	this.y=y;
	this.health=foeHealth;
	this.rayon=7;
	this.xOffset=18;
	this.yOffset=18;
	this.hurt=0;
	this.alive=true;
	this.sprites=new Image();
	this.sprites.src=assetsPath+"default_foe.png";
	this.speed=foeSpeed;
	this.cursorAnim=0;		// %3frames
	this.IA=function(dt){			// IA vite fait valable seulement sur un terrain de jeu convexe
		var tab=genPath(this,player);
		this.x+=tab[0]*this.speed*dt/10;
		this.y+=tab[1]*this.speed*dt/10;
	}
	
	this.draw=function(){
		conFG.drawImage(this.sprites,48*Math.floor(this.cursorAnim),48*(this.hurt>0),48,48,Math.floor(this.x),Math.floor(this.y),36,36);
		this.cursorAnim=(this.cursorAnim+0.2)%3;
	}
	
	this.drawHitbox=function(){
		conFG.beginPath();
		conFG.arc(this.x+this.xOffset,this.y+this.yOffset,this.rayon,0,2*Math.PI,false);
		conFG.fillStyle="red";
		conFG.fill();
	}
	
}

function spawnFoe(x,y){
	listFoes[foeIndex]=new Bouboule(x,y);
	if(distanceHB(player,listFoes[foeIndex])<20){
															log("Ennemi généré sur joueur")
		listFoes[foeIndex].x+=20
	}												// 1 fois c'est le random, 2 fois de suite c'est le destin
	foeIndex=(foeIndex+1)%maxFoeCount;
	
}

function initFoes(){
	var i;
	for(i=0;i<maxFoeCount;i++){
		listFoes[i]=new Bouboule(-100,-100);
		listFoes[i].alive=false;
	} 
}

function updateFoes(){
	var i;
	var dt=Date.now()-lastT;
	for(i=0;i<maxFoeCount;i++){
		if(listFoes[i].alive){
			if(listFoes[i].hurt>0) listFoes[i].hurt--;
			if(listFoes[i].health<=0){
				listFoes[i].alive=false;
				listFoes[i].x=-200;
				listFoes[i].y=-200
			}
			listFoes[i].IA(dt);
			
			if(player.collision(listFoes[i]) && player.hurt==0 && listFoes[i].alive){
				log("Ouch !")
				player.health--;
				player.hurt=fps/2;
				if(player.health==0){
					log("Fin avec "+nbKills+" kill"+(nbKills>1?"s":""))
					player.alive=false;
				}
			}
		}
	}
	
}





//////////////////////////////////
function initShoots(){
	var i;
	for(i=0;i<maxTearCount;i++){
		listShots[i]=new Tear(-100,-100,0,0,0);
	}
}

function genPath(fromHb,tarHb){				// Pour les ennemis
	var tab=[]
	tarX=tarHb.x+tarHb.xOffset;
	tarY=tarHb.y+tarHb.yOffset;
	X=fromHb.x+fromHb.xOffset;
	Y=fromHb.y+fromHb.yOffset;
	var dist=Math.sqrt((tarX-X)*(tarX-X)+(tarY-Y)*(tarY-Y))
	tab[0]=(tarX-X)/(dist+1)//*Math.random();
	tab[1]=(tarY-Y)/(dist+1)//*Math.random();
	return tab;
}


function updateShots(){
	var i;
	var dt=Date.now()-lastT;
	
	if(pokemon && !(clockAnim%3)) larmesBadass = !larmesBadass;
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
	var i;
	if(tear.range<1) tear.splash=true;																// Si la larme est au max de portée
	if(tear.x+5<xRoom || tear.x+15>xmRoom || tear.y<yRoom || tear.y+10> ymRoom) tear.splash=true;			// Garder cette version de la collision contre mur pour permettre au larmes de frapper sur le mur et pas au pied
	//if(tear.collision(walls.TOP) || tear.collision(walls.BOTTOM) || tear.collision(walls.LEFT) || tear.collision(walls.RIGHT)) tear.splash=true;
	for(i=0;i<maxFoeCount;i++){
		if(listFoes[i].alive){
			//console.log("Test de collision sur mob "+i)
			if(tear.collision(listFoes[i])){
				console.log("PD");
				listFoes[i].health-=tear.damage;
				if(listFoes[i].health<=0){
					killHandler();
				}
				listFoes[i].hurt=5;
				tear.splash=true;
			}
		}
	}
}

/////////////////////////////////

function drawScene() {
    "use strict"; 
    //xBackgroundOffset = (xBackgroundOffset - xBackgroundSpeed) % backgroundWidth;
	conBG.drawImage(imgBackground, 0,0,780,468, 0,0,backgroundWidth,backgroundHeight)
}

function updateItems() {
    "use strict"; 
		clearFG();
		FramesSinceLastShot++;
		if(FramesSinceLastShot>tearDelay/4){
			player.shooting=0;
		}
		player.bodyDir=-1;
		player.headDir=0;
		player.indexAnim=(player.indexAnim+0.3)%10;
		if(player.hurt>0) player.hurt--;
		
		var dt=Date.now()-lastT;
		
		var keycode;
		for (keycode in keyStatus) {
				if(keyStatus[keycode] == true){
					//console.log("Pressed : "+keycode);
					if(keycode == keys.ITEM) {			// Space 
						anim=!anim
						keyStatus[keycode]=false;
					}
					if(keycode == keys.UP) { 
					player.bodyDir=2;
						if( !walls.TOP.collision(player)){
							player.y -= Math.floor(player.speed*dt);
						}
					}
					if(keycode == keys.DOWN) { 
					player.bodyDir=0;
						if( !walls.BOTTOM.collision(player)){
							player.y += Math.floor(player.speed*dt);
						}
					
					} 
					if(keycode == keys.LEFT) {					
					player.bodyDir=1;
						if( !walls.LEFT.collision(player)){
							player.x -= Math.floor(player.speed*dt);
						}
					} 
					if(keycode == keys.RIGHT) { 
					player.bodyDir=3;
						if( !walls.RIGHT.collision(player)){
							player.x += Math.floor(player.speed*dt);
						}
					} 
					if(keycode == keys.ARR_UP) { 
					player.headDir=2;
						if(FramesSinceLastShot>tearDelay){
							player.shooting=1;
							listShots[tearIndex]= new Tear(player.x+(player.width)*0.35,
																player.y+(player.height)*(-0.2),
																(keyStatus[keys.RIGHT]-keyStatus[keys.LEFT])*tearSpeed/10,
																-tearSpeed+(keyStatus[keys.DOWN]-keyStatus[keys.UP])*tearSpeed/10,
																tearRange);
							tearIndex=(tearIndex+1)%maxTearCount;
							FramesSinceLastShot=0;
						}
					}
					if(keycode == keys.ARR_DOWN) { 
					player.headDir=0;
						if(FramesSinceLastShot>tearDelay){
							player.shooting=1;
							listShots[tearIndex]= new Tear(player.x+(player.width)*(-0.12),
																player.y+(player.height)*0.15,
																(keyStatus[keys.RIGHT]-keyStatus[keys.LEFT])*tearSpeed/10,
																tearSpeed+(keyStatus[keys.DOWN]-keyStatus[keys.UP])*tearSpeed/10,
																tearRange);
							tearIndex=(tearIndex+1)%maxTearCount;
							FramesSinceLastShot=0;
						}
					} 
					if(keycode == keys.ARR_LEFT) { 
					player.headDir=1;
						if(FramesSinceLastShot>tearDelay){
							player.shooting=1;
							listShots[tearIndex]= new Tear(player.x+0,
																player.y+(player.height)*0.05,
																-tearSpeed+(keyStatus[keys.RIGHT]-keyStatus[keys.LEFT])*tearSpeed/10,
																(keyStatus[keys.DOWN]-keyStatus[keys.UP])*tearSpeed/10,
																tearRange);
							tearIndex=(tearIndex+1)%maxTearCount;
							FramesSinceLastShot=0;
						}
					} 
					if(keycode == keys.ARR_RIGHT) { 
					player.headDir=3;
						if(FramesSinceLastShot>tearDelay){
							player.shooting=1;
							listShots[tearIndex]= new Tear(player.x+(player.width)*0.35,
																player.y+(player.height)*0.05,
																tearSpeed+(keyStatus[keys.RIGHT]-keyStatus[keys.LEFT])*tearSpeed/10,
																(keyStatus[keys.DOWN]-keyStatus[keys.UP])*tearSpeed/10,
																tearRange);
							tearIndex=(tearIndex+1)%maxTearCount;
							FramesSinceLastShot=0;
						}
					} 
						
				}
			// keyStatus[keycode] = false;			// Commenté pour authoriser l'appui continu avec plusieurs touches
		}
		updateShots();
		updateFoes();
		
		if(player.health<=0) console.log("TMORLOL")
	
}

function drawItems() {
    "use strict"; 
	var i;
	
	doors.draw();
	player.draw()
	
	if(afficheHitbox) {					// Affichage hitboxes player + walls
		player.drawHitbox();
		conFG.drawImage(imgHitbox,0,0,10,10,walls.TOP.x,walls.TOP.y,walls.TOP.width,walls.TOP.height);
		conFG.drawImage(imgHitbox,0,0,10,10,walls.BOTTOM.x,walls.BOTTOM.y,walls.BOTTOM.width,walls.BOTTOM.height);
		conFG.drawImage(imgHitbox,0,0,10,10,walls.LEFT.x,walls.LEFT.y,walls.LEFT.width,walls.LEFT.height);
		conFG.drawImage(imgHitbox,0,0,10,10,walls.RIGHT.x,walls.RIGHT.y,walls.RIGHT.width,walls.RIGHT.height);
	}
	
	for(i=0;i<maxTearCount;i++){				// drawShots
		listShots[i].draw();
		if(afficheHitbox) listShots[i].drawHitbox();	// Hitbox
	}
	
	for(i=0;i<maxFoeCount;i++){					// drawFoes
		if(listFoes[i].alive){
			listFoes[i].draw();
			if(afficheHitbox) listFoes[i].drawHitbox();	// Hitbox
		}
	}
}

function clearFG() {
    "use strict"; 
	canFG.width=canFG.width;
	canTestPerso.width=canTestPerso.width;
}

function clearBG() {
    "use strict"; 
	canBG.width=canBG.width;
}

function updateGame() {
    "use strict"; 
	clockAnim=Math.floor((clockAnim+1)%spawnDelay);
    //updateScene();			pas utile car affichage du BG change que si on change de salle et on a pas de laby
    if(player.alive){
		updateItems();
		if(!(clockAnim%20)) document.getElementById("lolu").innerHTML=" "+Math.round(1000/(Date.now()-lastT))+" ";
		if(!clockAnim) spawnFoe(xRoom+Math.floor((xmRoom-xRoom-48)*Math.random()),yRoom+Math.floor((ymRoom-yRoom-48)*Math.random()));
	}
	lastT=Date.now();
}

function drawGame() {
    "use strict"; 
    drawScene();
    if(player.alive)drawItems();    
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
	cancelAnimationFrame(request);

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
	initFoes();
	window.addEventListener("keydown", keyDownHandler, false);
	window.addEventListener("keyup", keyUpHandler, false);
    lastT=Date.now()
    request = animFrame( recursiveAnim );
	
	backgroundWidth=canBG.clientWidth/5.15;		
	backgroundHeight=canBG.clientHeight/6.2;
    
}

var request;
var anim=true;
window.addEventListener("load", init, false);
