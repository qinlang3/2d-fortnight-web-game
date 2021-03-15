function randint(n){ return Math.round(Math.random()*n); }
function rand(n){ return Math.random()*n; }

class Stage {
	constructor(canvas){
		this.canvas = canvas;
	
		this.actors=[]; // all actors on this stage (monsters, player, boxes, ...)
		this.player=null; // a special actor, the player
	
		// the logical width and height of the stage (display area)
		this.width=canvas.width;
		this.height=canvas.height;

		// the actual width and height of the map
		this.mapWidth = 10000;
		this.mapHeight = 10000;

		// Add the player to the center of the map
		var velocity = new Pair(0,0);
		var radius = 15;
		var colour= 'rgba(217,189,164,1)';
		var position = new Pair(Math.floor(this.mapWidth/2), Math.floor(this.mapHeight/2));
		// Set camrea focus on the player
		this.camera = new Pair(Math.floor(this.mapWidth/2), Math.floor(this.mapHeight/2));
		// Add the player
		this.addPlayer(new Player(this, position, velocity, colour, radius));
		// the number of total enemies
		this.enemNum=0;
		// Add in 500 obstacles
		var total=500;
		while(total>0){
			var x=Math.floor((Math.random()*this.mapWidth)); 
			var y=Math.floor((Math.random()*this.mapHeight)); 
			if(this.getActor(x,y)===null){
				var velocity = new Pair(0, 0);
				var red=randint(255), green=randint(255), blue=randint(255);
				var radius = 15;
				var alpha = 1;
				var colour= 'rgba('+red+','+green+','+blue+','+alpha+')';
				var position = new Pair(x,y);
				this.addActor(new Obstacle(this, position, velocity, colour, radius));
				total--;
			}
		}
		// Add in 50 enemies 
		total=50;
		while(total>0){
			var x=Math.floor((Math.random()*this.mapWidth)); 
			var y=Math.floor((Math.random()*this.mapHeight)); 
			if(this.getActor(x,y)===null){
				var velocity = new Pair(rand(3), rand(3));
				var red=111, green=221, blue=91;
				var radius = 15;
				var alpha = 1;
				var colour= 'rgba('+red+','+green+','+blue+','+alpha+')';
				var position = new Pair(x,y);
				var type = 'level1';
				this.addActor(new Enemy(this, position, velocity, colour, radius, type));
				total--;
			}
		}
		

		// the number of total pickupable items
		this.itemNum=0;
	}
	addPlayer(player){
		this.addActor(player);
		this.player=player;
	}
	removePlayer(){
		this.removeActor(this.player);
		this.player=null;
	}

	addActor(actor){
		this.actors.push(actor);
		if(actor instanceof Enemy){
			this.enemNum++;
		}
		//if(actor.type=='ammo'){
			//this.itemNum++;
		//}
	}

	addBullet(bullet){
		this.bullets.push(bullet);
	}
	
	removeActor(actor){
		var index=this.actors.indexOf(actor);
		if(index!=-1){
			this.actors.splice(index,1);
		}
	}
	updateCamera(){
		var x=this.player.position.x;
		var y=this.player.position.y;
		this.camera.x=x;
		this.camera.y=y;
		if(this.player.position.x<=this.width/2){
			this.camera.x=this.width/2;
		}
		if(this.player.position.x>=(this.mapWidth-this.width/2)){
			this.camera.x=this.mapWidth-this.width/2;
		}
		if(this.player.position.y<=this.height/2){
			this.camera.y=this.height/2;
		}
		if(this.player.position.y>=(this.mapHeight-this.height/2)){
			this.camera.y=this.mapHeight-this.height/2;
		}
	}

	// Take one step in the animation of the game.  Do this by asking each of the actors to take a single step. 
	// NOTE: Careful if an actor died, this may break!
	step(){
		
		/*
		if(this.oppoNum<5){
			var gen=randint(200);
			if(gen==100){
				var x=Math.floor((Math.random()*this.width)); 
				var y=Math.floor((Math.random()*this.height)); 
				if(this.getActor(x,y)===null){
					var velocity = new Pair(rand(3), rand(3));
					var red=111, green=221, blue=91;
					var radius = 15;
					var alpha = 1;
					var colour= 'rgba('+red+','+green+','+blue+','+alpha+')';
					var position = new Pair(x,y);
					var type = 'enemy';
					var b = new Ball(this, position, velocity, colour, radius, type);
					this.addActor(b);
				}
			}
		}
		*/
		/*
		if(this.pickup==0){
			var gen=randint(500);
			if(gen==100){
				var x=Math.floor((Math.random()*this.width)); 
				var y=Math.floor((Math.random()*this.height)); 
				if(this.getActor(x,y)===null){
					var velocity = new Pair(rand(3), rand(3));
					var radius = 15;
					var colour= 'rgba(0,0,1,1)';
					var position = new Pair(x,y);
					var type = 'ammo';
					var b = new Ball(this, position, velocity, colour, radius, type);
					this.addActor(b);
				}
			}
		}*/
		for(var i=0;i<this.actors.length;i++){
			this.actors[i].step();
		}
		this.updateCamera();
	}

	draw(){
		var context = this.canvas.getContext('2d');
		context.clearRect(0, 0, this.width, this.height);
		for(var i=0;i<this.actors.length;i++){
			this.actors[i].draw(context);
		}
		this.displayInfo(context);
	}

	displayInfo(context){
		context.fillStyle = 'rgba(0,0,0,1)';
		context.font = '23px serif';
		context.fillText('Health:', 600, 30);
		context.fillText(this.player.health, 700, 30);
		context.fillText('Ammo:', 600, 60);
		context.fillText(this.player.ammo, 700, 60);
		context.fillText('Points:', 600, 90);
		context.fillText(this.player.points, 700, 90);
		context.fillText('x:', 600, 120);
		context.fillText(Math.round(this.player.position.x), 700, 120);
		context.fillText('y:', 600, 150);
		context.fillText(Math.round(this.player.position.y), 700, 150);
		if(this.player.health==0){
			context.font = '30px serif';
			context.fillText('You Died!', 350, 400);
		}
	}
	// return the first actor at coordinates (x,y) return null if there is no such actor
	getActor(x, y){
		for(var i=0;i<this.actors.length;i++){
			if(this.actors[i].x==x && this.actors[i].y==y){
				return this.actors[i];
			}
		}
		return null;
	}
} // End Class Stage

class Pair {
	constructor(x,y){
		this.x=x; this.y=y;
	}

	toString(){
		return "("+this.x+","+this.y+")";
	}

	normalize(){
		var magnitude=Math.sqrt(this.x*this.x+this.y*this.y);
		var rx=rand(3);
		var ry=rand(3);
		this.x=rx*this.x/magnitude;
		this.y=ry*this.y/magnitude;
	}
}

class Ball {
	constructor(stage, position, velocity, colour, radius){
		this.stage = stage;
		this.position=position;
		this.velocity=velocity;
		this.colour = colour;
		this.radius = radius;
	}
	
	headTo(position){
		this.velocity.x=(position.x-this.position.x);
		this.velocity.y=(position.y-this.position.y);
		this.velocity.normalize();
	}

	toString(){
		return this.position.toString() + " " + this.velocity.toString();
	}
	
	step(){
	
		
				
		/*
		if(this.type=='ammo'){
			for(var i=0;i<this.stage.actors.length;i++){
				if(this.stage.actors[i].type=='player'){
				
					distX=this.stage.actors[i].position.x-(this.position.x+15);
					distY=this.stage.actors[i].position.y-(this.position.y-15);
					if(Math.sqrt(distX*distX+distY*distY)<=this.radius+this.stage.actors[i].radius){
						this.stage.removeActor(this);
						this.stage.pickup--;
						this.stage.player.ammo+=10;
					}
				}
			}

		}
		*/
		//if(this.type=='enemy'){
			//this.headTo(this.stage.player.position);
		//}		
	}

	setVelocityX(value){
		this.velocity.x=value;
	}
	setVelocityY(value){
		this.velocity.y=value;
	}
	getStagePositionX(x){
		return x+this.stage.width/2-this.stage.camera.x;
	}
	getStagePositionY(y){
		return y+this.stage.height/2-this.stage.camera.y;
	}
}
class Obstacle extends Ball {
	constructor(stage, position, velocity, colour, radius){
		super(stage, position, velocity, colour, radius);
		this.width=100+randint(500);
		this.height=100+randint(500);
	}
	draw(context){
		var stageX=this.getStagePositionX(this.position.x);
		var stageY=this.getStagePositionY(this.position.y);
		var x = Math.round(stageX);
		var y = Math.round(stageY);
		context.fillStyle=this.colour;
		context.beginPath(); 
		context.lineWidth=5;
   		context.strokeRect(x, y, this.width,this.height);


	}

}

class Bullet extends Ball {
	constructor(stage, position, velocity, colour, radius, type, fireFrom){
		super(stage, position, velocity, colour, radius);
		this.type=type;
		this.fireFrom=fireFrom; // the actor who fired this bullet
		this.range=0;
		if(this.type=='level1'){
			this.range=100;
		}
	}
	step() {
		// bullet has limited range
		if(this.range==0){
			this.stage.removeActor(this);
			return;
		}
		this.position.x+=this.velocity.x;
		this.position.y+=this.velocity.y;

		// bullet hit obstacles or edge
		for(var i=0;i<this.stage.actors.length;i++){
			if(this.stage.actors[i] instanceof Obstacle){
				var x=this.stage.actors[i].position.x;
				var y=this.stage.actors[i].position.y;
				var xRange=x+this.stage.actors[i].width;
				var yRange=y+this.stage.actors[i].height;
				if((y-this.radius<this.position.y&&this.position.y<yRange+this.radius)&&
					(x-this.radius<this.position.x&&this.position.x<xRange+this.radius)){
					this.stage.removeActor(this);
					return;
				}
				
			}
		}

		if(this.position.y<=0||this.position.y>=this.stage.mapHeight|| 
			this.position.x<=0||this.position.x>=this.stage.mapWidth){
			this.stage.removeActor(this);
			return;
		}
		var distX;
		var distY;
		for(var i=0;i<this.stage.actors.length;i++){
			if(((this.stage.actors[i] instanceof Player)&&(this.fireFrom instanceof Enemy))||
				((this.stage.actors[i] instanceof Enemy)&&(this.fireFrom instanceof Player))){
				distX=this.stage.actors[i].position.x-this.position.x;
				distY=this.stage.actors[i].position.y-this.position.y;
				// bullet hit someone
				if(Math.sqrt(distX*distX+distY*distY)<=this.radius+this.stage.actors[i].radius){
					this.stage.removeActor(this);
					if(this.stage.actors[i].health>0){
						this.stage.actors[i].beingHit=true;
						this.stage.actors[i].health--;
					}
					return;
				}
			}
		}
		this.range--;		
	}
	draw(context){
		var stageX=this.getStagePositionX(this.position.x);
		var stageY=this.getStagePositionY(this.position.y);
		var x = Math.round(stageX);
		var y = Math.round(stageY);
		context.fillStyle=this.colour;
		context.beginPath(); 
		context.arc(x, y, this.radius, 0, 2 * Math.PI, false); 
		context.fill();

	}
}
class Enemy extends Ball {
	constructor(stage, position, velocity, colour, radius, type){
		super(stage, position, velocity, colour, radius);
		this.type=type;
		this.health=5;
		this.weapon='none';
		if(this.type=='level1'){
			this.weapon='rifle';
		}
	
		this.aim_target = new Pair(0, 0);  // Aim position which indicates the map position 
										   // where the aim crosshair is pointed at. 
		this.beingHit = false;
		this.fireCD=50+randint(20);
		this.deathCD=0;
	}
	aim(target){
		var x=this.position.x;
		var y=this.position.y;
		if(target.x==x&&target.y==y){
			this.aim_target = new Pair(x, y-1);
		}else{
			this.aim_target = target;
		}	
	}
	fireWeapon() {
		var x1=this.position.x;
		var y1=this.position.y;
		if(this.weapon=='none'){
			var distX=this.stage.player.position.x-x1;
			var distY=this.stage.player.position.y-y1;
			if(Math.sqrt(distX*distX+distY*distY)<=this.radius+this.stage.player.radius){
				if(this.stage.player.health>0){
					this.stage.player.beingHit=true;
					this.stage.player.health--;
				}
			}
			return;
		}
		var targetX = this.aim_target.x;
		var targetY = this.aim_target.y;
		if(this.weapon=='rifle'){
			var x2=(25*(targetX-x1)/Math.sqrt((targetX-x1)*(targetX-x1)+(targetY-y1)*(targetY-y1)))+x1;
			var y2=(25*(targetY-y1)/Math.sqrt((targetX-x1)*(targetX-x1)+(targetY-y1)*(targetY-y1)))+y1;
			var position = new Pair(x2,y2);
			var x3=12*(targetX-position.x)/Math.sqrt((targetX-position.x)*(targetX-position.x)
				+(targetY-position.y)*(targetY-position.y));
			var y3=12*(targetY-position.y)/Math.sqrt((targetX-position.x)*(targetX-position.x)
				+(targetY-position.y)*(targetY-position.y));
			var velocity=new Pair(x3, y3);
			var colour='rgba(221,60,12,1)';
			var radius=5;
			var fireFrom=this;
			var type='level1';
			this.stage.addActor(new Bullet(this.stage, position, velocity, colour, radius, type, fireFrom));
		}
	}
	step(){
		if(this.health>0){
			this.position.x+=this.velocity.x;
			this.position.y+=this.velocity.y;

			for(var i=0;i<this.stage.actors.length;i++){
				if(this.stage.actors[i] instanceof Obstacle){
					var x=this.stage.actors[i].position.x;
					var y=this.stage.actors[i].position.y;
					var xRange=x+this.stage.actors[i].width;
					var yRange=y+this.stage.actors[i].height;
					if((y-this.radius<this.position.y&&this.position.y<yRange+this.radius)&&
						(x-this.radius<this.position.x&&this.position.x<xRange+this.radius)){
						if(this.position.y>yRange){
							this.position.y=yRange+this.radius;
							this.velocity.y=Math.abs(this.velocity.y);
						}else if(this.position.y<y){
							this.position.y=y-this.radius;
							this.velocity.y=-Math.abs(this.velocity.y);
						}else if(this.position.x>xRange){
							this.position.x=xRange+this.radius;
							this.velocity.x=Math.abs(this.velocity.x);
						}else if(this.position.x<x){
							this.position.x=x-this.radius;
							this.velocity.x=-Math.abs(this.velocity.x);
						}	
					}
				}
			}
			// bounce off the walls
			if(this.position.x<0){
				this.position.x=0;
				this.velocity.x=Math.abs(this.velocity.x);
			}
			if(this.position.x>this.stage.mapWidth){
				this.position.x=this.stage.mapWidth;
				this.velocity.x=-Math.abs(this.velocity.x);
			}
			if(this.position.y<0){
				this.position.y=0;
				this.velocity.y=Math.abs(this.velocity.y);
			}
			if(this.position.y>this.stage.mapHeight){
				this.position.y=this.stage.mapHeight;
				this.velocity.y=-Math.abs(this.velocity.y);
			}

			var distX=this.stage.player.position.x-this.position.x;
			var distY=this.stage.player.position.y-this.position.y;
			var dist=Math.sqrt(distX*distX+distY*distY);
			// update fireCD
			this.fireCD--;
			if(this.fireCD<0){
				this.fireCD=0;
			}
			if(dist<=400&&this.stage.player.health>0){	// player within the enemy's dectect range
				// aim to the player
				this.aim(this.stage.player.position);
				// move towards the player
				this.headTo(this.stage.player.position);
				// if fireCD is down to zero, fire weapon
				if(this.fireCD==0){
					this.fireWeapon();
					this.fireCD=50+randint(20);
				}
			}
		}
	}
	draw(context){
		if(this.beingHit){  // being hit
			context.fillStyle = 'rgba(174,0,0,1)';
			this.beingHit=false;
		}else if(this.health==0){ // being dying
			if(this.deathCD%2==0){
				context.fillStyle='rgba(111,221,91, 0)';
			}else{
				context.fillStyle='rgba(111,221,91, 1)';
			}
			this.deathCD++;
			if(this.deathCD==20){ // dying period ends, remove this actor
				this.stage.removeActor(this);
				this.stage.enemNum--;
				if(this.type=='level1'){
					this.stage.player.points+=2;
				}
			}
		}else{  // otherwise
			context.fillStyle=this.colour;
		}
		var stageX=this.getStagePositionX(this.position.x);
		var stageY=this.getStagePositionY(this.position.y);
		var x = Math.round(stageX);
		var y = Math.round(stageY);
		/*
		if(this.type=='ammo'){
			context.beginPath();
			context.lineWidth=2;
			context.moveTo(x, y);
			context.lineTo(x+30, y);
			context.lineTo(x+30, y-30);
			context.lineTo(x+25, y-35);
			context.lineTo(x+20, y-30);
			context.lineTo(x+15, y-35);
			context.lineTo(x+10, y-30);
			context.lineTo(x+5, y-35);
			context.lineTo(x, y-30);
			context.lineTo(x, y);
			context.moveTo(x, y-30);
			context.lineTo(x+30, y-30);
			context.moveTo(x+10, y-30);
			context.lineTo(x+10, y);
			context.moveTo(x+20, y-30);
			context.lineTo(x+20, y);
			context.stroke();
		*/
		
			context.beginPath(); 
			context.arc(x, y, this.radius, 0, 2 * Math.PI, false); 
			context.fill();
			context.lineWidth=2;
			context.stroke();
			if(this.weapon=='rifle'){
				var x1=this.getStagePositionX(this.aim_target.x);
				var y1=this.getStagePositionY(this.aim_target.y);
				var x2=(25*(x1-stageX)/Math.sqrt((x1-stageX)*(x1-stageX)+(y1-stageY)*(y1-stageY)))+stageX;
				var y2=(25*(y1-stageY)/Math.sqrt((x1-stageX)*(x1-stageX)+(y1-stageY)*(y1-stageY)))+stageY;
				context.lineWidth = 6;
				context.beginPath();
				context.moveTo(x, y);
				context.lineTo(Math.round(x2), Math.round(y2));
				context.stroke();
				
			}
	}
}
class Player extends Ball {
	constructor(stage, position, velocity, colour, radius){
		super(stage, position, velocity, colour, radius);
		this.health=1115;
		this.weapon = 'rifle';
		this.aim_target = new Pair(0, 0);
		this.beingHit = false;
		this.ammo=300;
		this.points=0;
		this.deathCD=0;
	}
	aim(target){
		var x=this.getStagePositionX(this.position.x);
		var y=this.getStagePositionY(this.position.y);
		if(target.x==x&&target.y==y){
			this.aim_target = new Pair(x, y-1);
		}else{
			this.aim_target = target;
		}	
	}
	fireWeapon() {
		var x1=this.position.x;
		var y1=this.position.y;
		if(this.weapon=='none'){
			return;
		}
		var targetX=this.aim_target.x-(this.stage.width/2-this.stage.camera.x);
		var targetY=this.aim_target.y-(this.stage.height/2-this.stage.camera.y);
		if(this.weapon=='rifle'){
			if(this.ammo>0){
				var x2=(25*(targetX-x1)/Math.sqrt((targetX-x1)*(targetX-x1)+(targetY-y1)*(targetY-y1)))+x1;
				var y2=(25*(targetY-y1)/Math.sqrt((targetX-x1)*(targetX-x1)+(targetY-y1)*(targetY-y1)))+y1;
				var position = new Pair(x2,y2);
				var x3=12*(targetX-position.x)/Math.sqrt((targetX-position.x)*(targetX-position.x)
					+(targetY-position.y)*(targetY-position.y));
				var y3=12*(targetY-position.y)/Math.sqrt((targetX-position.x)*(targetX-position.x)
					+(targetY-position.y)*(targetY-position.y));
				var velocity=new Pair(x3, y3);
				var colour='rgba(221,60,12,1)';
				var radius=5;
				var fireFrom=this;
				var type='level1';
				this.stage.addActor(new Bullet(this.stage, position, velocity, colour, radius, type, fireFrom));
				this.ammo--;
			}
			
		}
	}
	step(){
		this.position.x+=this.velocity.x;
		this.position.y+=this.velocity.y;
		for(var i=0;i<this.stage.actors.length;i++){
			if(this.stage.actors[i] instanceof Obstacle){
				var x=this.stage.actors[i].position.x;
				var y=this.stage.actors[i].position.y;
				var xRange=x+this.stage.actors[i].width;
				var yRange=y+this.stage.actors[i].height;
				if((y-this.radius<this.position.y&&this.position.y<yRange+this.radius)&&
					(x-this.radius<this.position.x&&this.position.x<xRange+this.radius)){
					if(this.position.y>yRange){
						this.position.y=yRange+this.radius;
					}else if(this.position.y<y){
						this.position.y=y-this.radius;
					}else if(this.position.x>xRange){
						this.position.x=xRange+this.radius;
					}else if(this.position.x<x){
						this.position.x=x-this.radius;
					}	
				}
				
			}
		}
		if(this.position.x<0){
			this.position.x=0;
		}
		if(this.position.x>this.stage.mapWidth){
			this.position.x=this.stage.mapWidth;
		}
		if(this.position.y<0){
			this.position.y=0;
		}
		if(this.position.y>this.stage.mapHeight){
			this.position.y=this.stage.mapHeight;
		}
	}
	draw(context){
		//context.fillStyle = this.colour;
   		//context.fillRect(this.x, this.y, this.radius,this.radius);
		if(this.beingHit){
			context.fillStyle = 'rgba(174,0,0,1)';
			this.beingHit=false;
		}else if(this.health==0){
			if(this.deathCD%2==0){
				context.fillStyle='rgba(217,189,164,0)';
			}else{
				context.fillStyle='rgba(217,189,164,1)';
			}
			this.deathCD++;
			if(this.deathCD==20){
				this.stage.removeActor(this);
			}

		}else{
			context.fillStyle=this.colour;
		}
		var x1=this.getStagePositionX(this.position.x);
		var y1=this.getStagePositionY(this.position.y);
		var x = Math.round(x1);
		var y = Math.round(y1);
		context.beginPath(); 
		context.arc(x, y, this.radius, 0, 2 * Math.PI, false); 
		context.fill();
		context.lineWidth=2;
		
		context.stroke();
		if(this.weapon=='rifle'){
			var x2=(25*(this.aim_target.x-x1)/Math.sqrt((this.aim_target.x-x1)*(this.aim_target.x-x1)
				+(this.aim_target.y-y1)*(this.aim_target.y-y1)))+x1;
			var y2=(25*(this.aim_target.y-y1)/Math.sqrt((this.aim_target.x-x1)*(this.aim_target.x-x1)
				+(this.aim_target.y-y1)*(this.aim_target.y-y1)))+y1;
			context.lineWidth = 6;
			context.beginPath();
	
			context.moveTo(Math.round(x1), Math.round(y1));
			context.lineTo(Math.round(x2), Math.round(y2));
			context.stroke();
		}
		
		/**
		context.beginPath(); 
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); 
		context.stroke();   
		**/
	}
}
