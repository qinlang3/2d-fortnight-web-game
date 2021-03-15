function randint(n){ return Math.round(Math.random()*n); }
function rand(n){ return Math.random()*n; }

class Stage {
	constructor(canvas){
		this.canvas = canvas;
	
		this.actors=[]; // all actors on this stage (monsters, player, boxes, ...)
		this.player=null; // a special actor, the player
	
		// the logical width and height of the stage
		this.width=canvas.width;
		this.height=canvas.height;

		// Add the player to the center of the stage
		var velocity = new Pair(0,0);
		var radius = 15;
		var colour= 'rgba(217,189,164,1)';
		var position = new Pair(Math.floor(this.width/2), Math.floor(this.height/2));
		var type = 'player';
		this.addPlayer(new Player(this, position, velocity, colour, radius, type));
	
		// Add in some Balls
		var total=5;
		this.oppoNum=0;
		this.pickup=0;
		while(total>0){
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
				total--;
			}
		}
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
		if(actor.type=='enemy'){
			this.oppoNum++;
		}
		if(actor.type=='ammo'){
			this.pickup++;
		}
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

	// Take one step in the animation of the game.  Do this by asking each of the actors to take a single step. 
	// NOTE: Careful if an actor died, this may break!
	step(){
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
		}
		for(var i=0;i<this.actors.length;i++){
			this.actors[i].step();
		}
	}

	draw(){
		var context = this.canvas.getContext('2d');
		context.clearRect(0, 0, this.width, this.height);
		for(var i=0;i<this.actors.length;i++){
			this.actors[i].draw(context);
		}
		context.fillStyle = 'rgba(0,0,0,1)';
		context.font = '23px serif';
		context.fillText('Health:', 600, 30);
		context.fillText(this.player.health, 700, 30);
		context.fillText('Ammo:', 600, 60);
		context.fillText(this.player.ammo, 700, 60);
		context.fillText('Points:', 600, 90);
		context.fillText(this.player.points, 700, 90);
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
		this.x=this.x/magnitude;
		this.y=this.y/magnitude;
	}
}

class Ball {
	constructor(stage, position, velocity, colour, radius, type){
		this.stage = stage;
		this.position=position;
		this.intPosition(); // this.x, this.y are int version of this.position

		this.velocity=velocity;
		this.colour = colour;
		this.radius = radius;
		this.type = type;
		this.aim_target = new Pair(0, 0);
		if(this.type=='player'){
			this.weapon = 'rifle';
		}
		if(this.type=='enemy'){
			var gen=randint(2);
			if(gen==1){
				this.weapon='rifle';
			}
		}
		
		this.health = 5;
		this.ammo = 30;
		this.beingHit = false;
		this.stepCount=0;
		this.fireCD=50+randint(20);
		this.points=0;
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
		if(this.type=='playerBullet'||this.type=='enemyBullet'){
			this.position.x=this.position.x+this.velocity.x;
			this.position.y=this.position.y+this.velocity.y;
			if(this.position.y<=0||this.position.y>=this.stage.height||this.position.x<=0||this.position.x>=this.stage.width){
				this.stage.removeActor(this);
			}
			var distX;
			var distY;
			for(var i=0;i<this.stage.actors.length;i++){
				if((this.stage.actors[i].type=='enemy'&&this.type=='playerBullet')||
				(this.stage.actors[i].type=='player'&&this.type=='enemyBullet')){
					distX=this.stage.actors[i].position.x-this.position.x;
					distY=this.stage.actors[i].position.y-this.position.y;
					if(Math.sqrt(distX*distX+distY*distY)<=this.radius+this.stage.actors[i].radius){
						this.stage.removeActor(this);
						if(this.stage.actors[i].health>0){
							this.stage.actors[i].beingHit=true;
							this.stage.actors[i].health--;
						}
						break;
					}
				}
			}
		}
		if(this.type=='enemy'&&this.stage.player.health>0){
			this.aim(this.stage.player.position);
			if(this.weapon=='rifle'){
				this.fireCD--;
				if(this.fireCD==0){
					this.fireWeapon();
					this.fireCD=50+randint(20);
				}
			}else{
				if(this.fireCD>0){
					this.fireCD--;
				}
				var distX=this.stage.player.position.x-this.position.x;
				var distY=this.stage.player.position.y-this.position.y;
				if(Math.sqrt(distX*distX+distY*distY)<=this.radius+this.stage.player.radius){
					if(this.stage.player.health>0&&this.fireCD==0){
						this.stage.player.beingHit=true;
						this.stage.player.health--;
						this.fireCD=50+randint(20);
					}
				}

			}
			
		}	
		if((this.type=='player'||this.type=='enemy')&&this.health>0){
			this.position.x=this.position.x+this.velocity.x;
			this.position.y=this.position.y+this.velocity.y;
			// bounce off the walls
			if(this.position.x<0){
				this.position.x=0;
				this.velocity.x=Math.abs(this.velocity.x);
			}
			if(this.position.x>this.stage.width){
				this.position.x=this.stage.width;
				this.velocity.x=-Math.abs(this.velocity.x);
			}
			if(this.position.y<0){
				this.position.y=0;
				this.velocity.y=Math.abs(this.velocity.y);
			}
			if(this.position.y>this.stage.height){
				this.position.y=this.stage.height;
				this.velocity.y=-Math.abs(this.velocity.y);
			}
			

		}
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
		//if(this.type=='enemy'){
			//this.headTo(this.stage.player.position);
		//}
		this.intPosition();
		
			
		
	}
	intPosition(){
		this.x = Math.round(this.position.x);
		this.y = Math.round(this.position.y);
	}
	draw(context){
		if(this.beingHit){
			context.fillStyle = 'rgba(174,0,0,1)';
			this.beingHit=false;
		}else if(this.health==0){
			if(this.stepCount%2==0){
				context.fillStyle='rgba(111,221,91, 0)';
			}else{
				context.fillStyle='rgba(111,221,91, 1)';
			}
			this.stepCount++;
			if(this.stepCount==20){
				this.stage.removeActor(this);
				this.stage.oppoNum--;
				if(this.weapon=='rifle'){
					if(this.stage.player.health>0){
						this.stage.player.health+=2;
					}
					this.stage.player.points+=2;
				}else{
					if(this.stage.player.health>0){
						this.stage.player.health++;
					}
					this.stage.player.points++;
				}
				if(this.stage.player.health>5){
					this.stage.player.health=5;
				}
			}
		}else{
			context.fillStyle=this.colour;
		}
		if(this.type=='ammo'){
			context.beginPath();
			context.lineWidth=2;
			context.moveTo(this.x, this.y);
			context.lineTo(this.x+30, this.y);
			context.lineTo(this.x+30, this.y-30);
			context.lineTo(this.x+25, this.y-35);
			context.lineTo(this.x+20, this.y-30);
			context.lineTo(this.x+15, this.y-35);
			context.lineTo(this.x+10, this.y-30);
			context.lineTo(this.x+5, this.y-35);
			context.lineTo(this.x, this.y-30);
			context.lineTo(this.x, this.y);
			context.moveTo(this.x, this.y-30);
			context.lineTo(this.x+30, this.y-30);
			context.moveTo(this.x+10, this.y-30);
			context.lineTo(this.x+10, this.y);
			context.moveTo(this.x+20, this.y-30);
			context.lineTo(this.x+20, this.y);
			context.stroke();

		}else{
			context.beginPath(); 
			context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); 
			context.fill();
			context.lineWidth=2;
			if(this.type!='playerBullet'&&this.type!='enemyBullet'){
				context.stroke();
				if(this.weapon=='rifle'){
					var x1=this.position.x;
					var y1=this.position.y;
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
			}
			
		}
		
		
			    
   		// context.fillRect(this.x, this.y, this.radius,this.radius);
		
	}
	setVelocityX(value){
		this.velocity.x=value;
	}
	setVelocityY(value){
		this.velocity.y=value;
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
		if(this.ammo>0||this.type=='enemy'){
			var x1=this.position.x;
			var y1=this.position.y;
			var x2=(25*(this.aim_target.x-x1)/Math.sqrt((this.aim_target.x-x1)*(this.aim_target.x-x1)
				+(this.aim_target.y-y1)*(this.aim_target.y-y1)))+x1;
			var y2=(25*(this.aim_target.y-y1)/Math.sqrt((this.aim_target.x-x1)*(this.aim_target.x-x1)
				+(this.aim_target.y-y1)*(this.aim_target.y-y1)))+y1;
			var position = new Pair(x2,y2);
			var x3=12*(this.aim_target.x-position.x)/Math.sqrt((this.aim_target.x-position.x)*(this.aim_target.x-position.x)
				+(this.aim_target.y-position.y)*(this.aim_target.y-position.y));
			var y3=12*(this.aim_target.y-position.y)/Math.sqrt((this.aim_target.x-position.x)*(this.aim_target.x-position.x)
				+(this.aim_target.y-position.y)*(this.aim_target.y-position.y));
			var velocity = new Pair(x3, y3);
			var colour= 'rgba(221,60,12,1)';
			var radius = 5;
			var type;
			if(this.type=='player'){
				type='playerBullet';
			}
			if(this.type=='enemy'){
				type='enemyBullet';
			}
			var b = new Ball(this.stage, position, velocity, colour, radius, type);
			this.stage.addActor(b);
			if(this.type=='player'){
				this.ammo--;
			}
		}
		
		
	}
}

class Player extends Ball {
	draw(context){
		//context.fillStyle = this.colour;
   		//context.fillRect(this.x, this.y, this.radius,this.radius);
		if(this.beingHit){
			context.fillStyle = 'rgba(174,0,0,1)';
			this.beingHit=false;
		}else if(this.health==0){
			if(this.stepCount%2==0){
				context.fillStyle='rgba(217,189,164,0)';
			}else{
				context.fillStyle='rgba(217,189,164,1)';
			}
			this.stepCount++;
			if(this.stepCount==20){
				this.stage.removeActor(this);
			}

		}else{
			context.fillStyle=this.colour;
		}
		context.beginPath(); 
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); 
		context.fill();
		context.lineWidth=2;
		
		context.stroke();
		if(this.weapon=='rifle'){
			var x1=this.position.x;
			var y1=this.position.y;
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
