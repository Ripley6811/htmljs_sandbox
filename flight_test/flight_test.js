
// Create a convenience namespace for box2d objects
var box2d = {
    b2Vec2 : Box2D.Common.Math.b2Vec2,
    b2AABB : Box2D.Collision.b2AABB,
    b2BodyDef : Box2D.Dynamics.b2BodyDef,
    b2Body : Box2D.Dynamics.b2Body,
    b2FixtureDef : Box2D.Dynamics.b2FixtureDef,
    b2Fixture : Box2D.Dynamics.b2Fixture,
    b2World : Box2D.Dynamics.b2World,
    b2PolygonShape : Box2D.Collision.Shapes.b2PolygonShape,
    b2DebugDraw : Box2D.Dynamics.b2DebugDraw
};


var size = {
  width: window.innerWidth || document.body.clientWidth,
  height: window.innerHeight || document.body.clientHeight
}

// Add canvas to HTML document
var body = document.getElementById("body");
var canvas = document.createElement("canvas");
canvas.width = size.width;
canvas.height = size.height;
body.appendChild(canvas);
document.documentElement.style.overflow = 'hidden';
var ctx = canvas.getContext("2d");

var keys = [];
var world, stage, player;
var SCALE = 30;

var player;
var thrust = 0;

console.log(size.width, size.height);
    
function init(){
    stage = new createjs.Stage(document.getElementById("canvas"));

    setupPhysics();
    
    createjs.Ticker.addListener(this);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.useRAD = true;


    
    //var canvasPosition = getElementPosition(c);

    

    function handleKeyDown(evt){
        keys[evt.keyCode] = true;
        console.log("+", keys);
    }
    function handleKeyUp(evt){
        keys[evt.keyCode] = false;
        console.log("-", keys);
    }
    function handleWheel(evt){
        // Accelerate or decelerate main engines
        console.log(evt.wheelDelta);
        if (evt.wheelDelta == 120) thrust += 1;
        if (evt.wheelDelta == -120) thrust -= 1;
        if (thrust < 0) thrust = 0;
    }
    document.addEventListener(
        "keydown", 
        handleKeyDown,
        true
    );
    document.addEventListener(
        "keyup", 
        handleKeyUp,
        true
    );
    document.addEventListener(
        "mousewheel", 
        handleWheel, 
        false
    );
    

    
    
    
    
    
    //setTimeout(init, 6000);
    
}; // init()


function setupPhysics() {

    world = new box2d.b2World(
                       new box2d.b2Vec2(0, 9.8), // Gravity in physics world
                       true                  // Sleeping enabled
                  );
                  
                  
    // CREATE GROUND
    var fixDef = new box2d.b2FixtureDef();
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    fixDef.shape = new box2d.b2PolygonShape;
    fixDef.shape.SetAsBox((1000 / SCALE) / 2, (10/SCALE) / 2);
    
    var bodyDef = new box2d.b2BodyDef();
    bodyDef.type = box2d.b2Body.b2_staticBody;
    bodyDef.angle = 0;
    bodyDef.position.x = canvas.width / 2 / SCALE;
    bodyDef.position.y = canvas.height / SCALE;
    
    world.CreateBody( bodyDef ).CreateFixture(fixDef);
    
    
    // CREATE PLAYER
    fixDef.shape.SetAsBox((30 / SCALE) / 2, (30/SCALE) / 2);
    
    bodyDef.type = box2d.b2Body.b2_dynamicBody;
    bodyDef.angle = -Math.PI/2;
    bodyDef.angularDamping = 0.6;
    bodyDef.position.x = 500 / SCALE;
    bodyDef.position.y = 500 / SCALE;
    player = world.CreateBody( bodyDef );
    player.CreateFixture( fixDef );

    
    //setup debug draw
    var debugDraw = new box2d.b2DebugDraw();
    debugDraw.SetSprite(ctx);
    debugDraw.SetDrawScale(SCALE);
    debugDraw.SetFillAlpha(0.3);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(box2d.b2DebugDraw.e_shapeBit | box2d.b2DebugDraw.e_jointBit);
    world.SetDebugDraw(debugDraw);
}


function tick(){
    var angle = player.GetAngle();
    if (keys[38] | keys[104]){
        console.log("up pulse. angle=", angle);
        player.ApplyForce(new box2d.b2Vec2(
                                Math.cos(angle) * 3,
                                Math.sin(angle) * 3),
                             player.GetWorldCenter()
                             );
    }
    if (keys[37] | keys[100]){
        console.log("left transverse pulse");
        player.ApplyForce(new box2d.b2Vec2(
                                Math.cos(angle+Math.PI/2) * -3,
                                Math.sin(angle+Math.PI/2) * -3), player.GetWorldCenter());
    }
    if (keys[103]){
        console.log("left pulse");
        player.ApplyTorque( -0.2 );
    }
    if (keys[39] | keys[102]){
        console.log("right transverse pulse");
        player.ApplyForce(new box2d.b2Vec2(
                                Math.cos(angle+Math.PI/2) * 3,
                                Math.sin(angle+Math.PI/2) * 3), player.GetWorldCenter());
    }
    if (keys[105]){
        console.log("right pulse");
        player.ApplyTorque( 0.2 );
    }
    if (keys[40] | keys[101]){
        console.log("reverse pulse");
        player.ApplyForce(new box2d.b2Vec2(
                                Math.cos(angle) * -3,
                                Math.sin(angle) * -3), player.GetWorldCenter());
    }
    if (keys[107]){
        thrust += 0.1;
    }
    if (keys[109]){
        thrust -= 0.1;
        if (thrust < 0) thrust = 0;
    }
    if (thrust > 0){
        player.ApplyForce(new box2d.b2Vec2(
                            Math.cos(angle) * thrust,
                            Math.sin(angle) * thrust),
                         player.GetWorldCenter()
                         );
    };
    //player.ApplyImpulse(new 
    //stage.update();
    
    world.DrawDebugData();
    world.Step(
         1 / 60   //frame-rate
      ,  10       //velocity iterations
      ,  10       //position iterations
    );
    world.ClearForces();
    
    // Display some text data
    ctx.font = "bold 15px sans-serif";
    ctx.fillStyle = "#000";
    ctx.textBaseline = "bottom";
    ctx.fillText(player.GetLinearVelocity().x.toFixed(2), player.GetPosition().x * SCALE, player.GetPosition().y * SCALE);
    ctx.textBaseline = "top";
    ctx.fillText(player.GetLinearVelocity().y.toFixed(2), player.GetPosition().x * SCALE, player.GetPosition().y * SCALE);
    
    //ctx.translate(-1,0);
    console.log('------');
    for (var bb = world.m_bodyList; bb; bb = bb.m_next)
        console.log(bb.IsAwake());
}


init();