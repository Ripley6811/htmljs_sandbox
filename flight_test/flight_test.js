
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
    b2CircleShape : Box2D.Collision.Shapes.b2CircleShape,
    b2DebugDraw : Box2D.Dynamics.b2DebugDraw
};


var size = {
  width: window.innerWidth || document.body.clientWidth,
  height: window.innerHeight || document.body.clientHeight
}

// Add canvas to HTML document
var body = document.getElementById("body");
var canvas = document.createElement("canvas");
canvas.id = "canvas";
canvas.width = size.width;
canvas.height = size.height;
canvas.backgroundColor = "#fff";
canvas.position = "absolute";
body.appendChild(canvas);
document.documentElement.style.overflow = 'hidden';
var ctx = canvas.getContext("2d");


var debug = document.createElement("canvas");
debug.id = "debug";
debug.width = size.width;
debug.height = size.height;
debug.position = "absolute";
body.appendChild(debug);
var dctx = debug.getContext("2d");

var keys = [];
var world, stage, debug;
var SCALE = 30;

var player;
var thrust = 0;

var particles = [];
var particlesToRemove = [];

console.log(size.width, size.height);
    
function init(){
    stage = new createjs.Stage(document.getElementById("canvas"));
    debug = document.getElementById("debug");

    setupPhysics();

    

    function handleKeyDown(evt){
        keys[evt.keyCode] = true;
        //console.log("+", keys);
    }
    function handleKeyUp(evt){
        keys[evt.keyCode] = false;
        //console.log("-", keys);
    }
    function handleWheel(evt){
        // Accelerate or decelerate main engines
        console.log(evt.wheelDelta, thrust);
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
    

    
    createjs.Ticker.addListener(this);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.useRAD = true;
}; // init()


function setupPhysics() {

    world = new box2d.b2World(
                       new box2d.b2Vec2(0, 5), // Gravity in physics world
                       true                  // Sleeping enabled
                  );
                  
                  
    // CREATE GROUND
    var fixDef = new box2d.b2FixtureDef();
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    fixDef.shape = new box2d.b2PolygonShape;
    fixDef.shape.SetAsBox((canvas.width / SCALE) / 2, (10/SCALE) / 2);
    fixDef.filter.categoryBits = 0x0001;
    
    var bodyDef = new box2d.b2BodyDef();
    bodyDef.type = box2d.b2Body.b2_staticBody;
    bodyDef.angle = 0;
    bodyDef.position.x = canvas.width / 2 / SCALE;
    bodyDef.position.y = canvas.height / SCALE;
    
    world.CreateBody( bodyDef ).CreateFixture(fixDef);
    //---
    var fixDef = new box2d.b2FixtureDef();
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    fixDef.shape = new box2d.b2PolygonShape;
    fixDef.shape.SetAsBox((10 / SCALE) / 2, (1000/SCALE) / 2);
    fixDef.filter.categoryBits = 0x0001;
    
    var bodyDef = new box2d.b2BodyDef();
    bodyDef.type = box2d.b2Body.b2_staticBody;
    bodyDef.angle = 0;
    bodyDef.position.x = 0 / 2 / SCALE;
    bodyDef.position.y = canvas.height / 2 / SCALE;
    
    world.CreateBody( bodyDef ).CreateFixture(fixDef);
    //---
    var fixDef = new box2d.b2FixtureDef();
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    fixDef.shape = new box2d.b2PolygonShape;
    fixDef.shape.SetAsBox((10 / SCALE) / 2, (1000/SCALE) / 2);
    fixDef.filter.categoryBits = 0x0001;
    
    var bodyDef = new box2d.b2BodyDef();
    bodyDef.type = box2d.b2Body.b2_staticBody;
    bodyDef.angle = 0;
    bodyDef.position.x = canvas.width / SCALE;
    bodyDef.position.y = canvas.height / 2 / SCALE;
    
    world.CreateBody( bodyDef ).CreateFixture(fixDef);
    
    
    // CREATE PLAYER
    player = new Ship();
    stage.addChild(player.view);
    
    
    
    //setup debug draw
    var debugDraw = new box2d.b2DebugDraw();
    debugDraw.SetSprite(dctx);
    debugDraw.SetDrawScale(SCALE);
    debugDraw.SetFillAlpha(0.3);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(box2d.b2DebugDraw.e_shapeBit | box2d.b2DebugDraw.e_jointBit);
    world.SetDebugDraw(debugDraw);

} // setupPhysics()


function tick(){
    //player.ApplyImpulse(new 
    stage.update();
    
    
    //world.DrawDebugData();
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
    var pbody = player.view.body;
    ctx.fillText(pbody.GetLinearVelocity().x.toFixed(2), pbody.GetPosition().x * SCALE+80, pbody.GetPosition().y * SCALE);
    ctx.textBaseline = "top";
    ctx.fillText(pbody.GetLinearVelocity().y.toFixed(2), pbody.GetPosition().x * SCALE+80, pbody.GetPosition().y * SCALE);
    ctx.textBaseline = "center";
    ctx.fillText(thrust.toFixed(2), pbody.GetPosition().x * SCALE+120, pbody.GetPosition().y * SCALE);
    
    //dctx.translate(-1,0);
    //ctx.translate(-1,0);
    //console.log('------');
    //for (var bb = world.m_bodyList; bb; bb = bb.m_next)
    //    console.log(bb.IsAwake());
    
    
    //call sub ticks
    //ship.tick();
    //stage.update();
} // tick()


init();