(function (window) {

    
    
	function Ship() {
        this.view = new createjs.Bitmap("flight_test/images/ship.png");
        this.view.regX = 70 / 2;
        this.view.regY = 136 / 2;
        
        var fixDef = new box2d.b2FixtureDef();
        fixDef.density = 0.95;
        fixDef.friction = 0.6;
        fixDef.restitution = 0.0;
        var bodyDef = new box2d.b2BodyDef();
        bodyDef.type = box2d.b2Body.b2_dynamicBody;
        bodyDef.angle = 0;
        bodyDef.angularDamping = 0.1;
        bodyDef.position.x = 500 / SCALE;
        bodyDef.position.y = 500 / SCALE;
        fixDef.shape = new box2d.b2PolygonShape;
        fixDef.shape.SetAsBox((70 / 2 / SCALE), (136 / 2 / SCALE));
        fixDef.filter.categoryBits = 0x0002;
        fixDef.filter.maskBits = 0x0001;
        this.view.body = world.CreateBody(bodyDef);
        this.view.body.CreateFixture(fixDef);
        this.view.onTick = tick;
        
	}

/*
// public properties:
	Ship.TOGGLE = 60;
	Ship.MAX_THRUST = 2;
	Ship.MAX_VELOCITY = 5;

// public properties:
	var shipFlame;
	var shipBody;

	var timeout;
	var thrust;

	var vX;
	var vY;

	var bounds;
	var hit;
*/


	function tick(event) {
        var angle = this.body.GetAngle();
        if (keys[38] | keys[104]){
            console.log("up pulse. angle=", angle);
            this.body.ApplyForce(new box2d.b2Vec2(
                                    Math.cos(angle+Math.PI/2) * -3,
                                    Math.sin(angle+Math.PI/2) * -3),
                                 this.body.GetWorldCenter()
                                 );
            new Exhaust(0,50,3,this.body.GetAngle(),10);
        }
        if (keys[37] | keys[100]){
            console.log("left transverse pulse");
            this.body.ApplyForce(new box2d.b2Vec2(
                                    Math.cos(angle) * -3,
                                    Math.sin(angle) * -3), this.body.GetWorldCenter());
            new Exhaust(39,17,3,this.body.GetAngle()-Math.PI/2,10);
            new Exhaust(20,-38,3,this.body.GetAngle()-Math.PI/2,10);
        }
        if (keys[103]){
            console.log("left pulse");
            this.body.ApplyTorque( -10 );
            new Exhaust(20,-38,3,this.body.GetAngle()-Math.PI/2,10);
        }
        if (keys[99]){
            console.log("left pulse");
            this.body.ApplyTorque( -10 );
            new Exhaust(-39,17,3,this.body.GetAngle()+Math.PI/2,10);
        }
        if (keys[39] | keys[102]){
            console.log("right transverse pulse");
            this.body.ApplyForce(new box2d.b2Vec2(
                                    Math.cos(angle) * 3,
                                    Math.sin(angle) * 3), this.body.GetWorldCenter());
            new Exhaust(-39,17,3,this.body.GetAngle()+Math.PI/2,10);
            new Exhaust(-20,-38,3,this.body.GetAngle()+Math.PI/2,10);
        }
        if (keys[105]){
            console.log("right pulse");
            this.body.ApplyTorque( 10 );
            new Exhaust(-20,-38,3,this.body.GetAngle()+Math.PI/2,10);
        }
        if (keys[97]){
            console.log("right pulse");
            this.body.ApplyTorque( 10 );
            new Exhaust(39,17,3,this.body.GetAngle()-Math.PI/2,10);
        }
        if (keys[40] | keys[101]){
            console.log("reverse pulse");
            this.body.ApplyForce(new box2d.b2Vec2(
                                    Math.cos(angle+Math.PI/2) * 3,
                                    Math.sin(angle+Math.PI/2) * 3), this.body.GetWorldCenter());
            new Exhaust(0,-57,3,this.body.GetAngle()+Math.PI,10);
        }
        if (keys[107]){
            thrust += 0.1;
        }
        if (keys[109]){
            thrust -= 0.1;
            if (thrust < 0) thrust = 0;
        }
        if (thrust > 0){
            console.log(thrust);
            this.body.ApplyForce(new box2d.b2Vec2(
                                Math.cos(angle-Math.PI/2) * thrust,
                                Math.sin(angle-Math.PI/2) * thrust),
                             this.body.GetWorldCenter()
                             );
                             
//            drawMainExhaust(10);
            var angle = this.body.GetAngle();
            new Exhaust(22,68,thrust*.2,angle,15);
            new Exhaust(-22,68,thrust*.2,angle,15);
            new Exhaust(22,68,thrust*.2,angle,15);
            new Exhaust(-22,68,thrust*.2,angle,15);
        } 
        
        deleteExhaust();
        
        // Update the image position by the box2d physics body position
        this.x = this.body.GetPosition().x * SCALE;
        this.y = this.body.GetPosition().y * SCALE;
        this.rotation = this.body.GetAngle() * (180/Math.PI);
	}
    
    function drawMainExhaust(nParticles){
        //for (var i = 0; nParticles; i++ ){
        var angle = player.view.body.GetAngle();
        
    }
    
    function deleteExhaust(){
        for (var i=0; i<particlesToRemove.length; i++){
            //p = particlesToRemove.shift();
            world.DestroyBody(particlesToRemove[i].body);
            stage.removeChild(particlesToRemove[i]);
        };
        particlesToRemove = [];
    }
    

     // Instantiate object from root scope
	window.Ship = Ship;

}(window));