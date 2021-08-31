var waitImage, backgroundImage, helpPage;
var startButtonImage, helpButtonImage, exitButtonImage, titleImage;
var bg, bgend, bgendimg, bgwinimg, startButton, helpButton, exitButton, title, loseImage, winImage;
var gameState = "START";

var bear, bearWalkImage, bearJumpImage;
var obstacle, penguinImage, sealImage;
var Group;
var obstaclesGroup;
var ground, score, fishCount;
var yellowFish, orangeFish, fishGroup;
var eatsound, backgroundSound;

function preload(){
  waitImage = loadImage("wait.png");
  backgroundImage = loadImage("background.jpeg");
  startButtonImage = loadImage("playButton.png");
  helpButtonImage = loadImage("helpButton.png");
  exitButtonImage = loadImage("exitButton.png");
  titleImage = loadImage("gameTitle.png");
  helpPage = loadImage("helpBackground.png");
  bearWalkImage = loadImage("bear.gif");
  penguinImage = loadImage("penguin.gif");
  sealImage = loadImage("seal.gif");
  orangeFish = loadImage("orangeFish.gif");
  yellowFish = loadImage("yellowFish.gif");
  bgendimg=loadImage("bgend.gif");
  loseImage = loadImage("gameOver.png");
  winImage = loadImage("gameWin.png");
  bearJumpImage = loadImage("iceBearDance.gif");
    bgwinimg = loadImage("winBG.gif");
  eatsound=loadSound("eatingNoise.mp3");
  backgroundSound = loadSound("BackgroundMusic.mp3");
  diesound=loadSound("dieSound.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  bg = createSprite(windowWidth/2, windowHeight/2);
  bg.addImage(waitImage);
  bg.scale = 4.95;

  bgend = createSprite(windowWidth/2, windowHeight/2);
  bgend.visible = false

  startButton = createSprite(windowWidth/2,  windowHeight - 125);
  startButton.addImage(startButtonImage);
  startButton.scale = 1;

  helpButton = createSprite(windowWidth/2 - windowHeight/2, windowHeight - 125);
  helpButton.addImage(helpButtonImage);
  helpButton.scale = 1;

  exitButton = createSprite(windowWidth/2 + windowHeight/2,  windowHeight - 125);
  exitButton.addImage(exitButtonImage);
  exitButton.scale = 1;

  title = createSprite(windowWidth/2, windowHeight/6);
  title.addImage(titleImage);
  title.scale = 0.5;

  bear = createSprite(200, windowHeight - 300);
  bear.addImage(bearWalkImage);
  bear.scale = 1.75;
  bear.visible = false;
  bear.debug=true
  bear.setCollider("rectangle",0,50,150,80)

  obstaclesGroup = new Group();
  fishGroup = new Group()
  score = 0;
  fishCount = 0;
  backgroundSound.loop()
}

function draw() {
  background(173, 216, 230);
  
  if (gameState == "PLAY"){ 
  
    score = score + Math.round(getFrameRate()/60);
    spawnObstacles();

    

    if(bg.x<windowWidth/2 - 200){
      bg.x=windowWidth/2;
    }

    if (bear.y < windowHeight-windowHeight/2){
      bear.y = windowHeight - 300;
    }
    if (bear.y > windowHeight){
      bear.y = windowHeight - 300;
    }

    if(keyDown("up") ) {
      bear.y = bear.y - 10;
    }
    if(keyDown("down") ) {
      bear.y = bear.y + 10;
    }

    if (bear.isTouching(obstaclesGroup)){
      endFunc();
      gameState = "END";  
    }

    if (score > 50){
      gameState="level2"
    }
  }

  if (gameState == "level2"){

    if (keyDown("space") && bear.isTouching(fishGroup)){
      //bear.addImage(bearJumpImage);
      eatsound.play()
      fishCount++; 
      fishGroup.setVelocityXEach(0); 
      fishGroup.destroyEach()
    } else {
      bear.addImage(bearWalkImage);
    }

    spawnFish();
    spawnObstacles();

    if(bg.x<windowWidth/2 - 200){
      bg.x=windowWidth/2;
    }

    if (bear.y < windowHeight-windowHeight/2){
      bear.y = windowHeight - 300;
    }
    if (bear.y > windowHeight){
      bear.y = windowHeight - 300;
    }
    if (bear.x < 0){
      bear.x = 200;
    }
    if (bear.x > windowWidth){
      bear.x = 200;
    }

    if (bear.isTouching(obstaclesGroup)){
      endFunc();
      gameState = "END"; 
    }

    if(keyDown("right") ) {
      bear.x = bear.x + 10;
    }
    if(keyDown("left") ) {
      bear.x = bear.x - 10;
    }
    if(keyDown("up") ) {
      bear.y = bear.y - 10;
    }
    if(keyDown("down") ) {
      bear.y = bear.y + 10;
    }

    if(fishCount == 2){
      endFunc(); 
      gameState = "WIN-END";
    }
  }
 
  if (mousePressedOver(startButton)){
    restartFunc();
    startButton.scale = 0.75;
    helpButton.scale = 0.75;
    exitButton.scale = 0.75;
    startButton.y = windowHeight -75;
    helpButton.y = windowHeight -75;
    exitButton.y = windowHeight -75;

    bg.addImage(backgroundImage);
    bg.scale = 1.5;
    bg.x=windowWidth/2;
    bg.velocityX=-4;

    bear.visible = true;
    title.visible = false;

    console.log(gameState);
    gameState = "PLAY";
    console.log(gameState);
  } else if (mousePressedOver(helpButton)){
    endFunc();
    restartFunc();
    bg.addImage(helpPage);
    bg.scale = 1.1;
    title.visible = false;
  } else if (mousePressedOver(exitButton)){
    endFunc();
    restartFunc();
    //gameState="START"
    bg.addImage(waitImage);
    bg.scale = 5;
    title.visible = true;
  }
  drawSprites();

  if (gameState == "PLAY"){
    textSize(40);
    stroke("blue");
    fill("blue");
    text("Score: "+ score, windowWidth - 300, 100);
  }
  if (gameState == "level2"){
    textSize(30);
    stroke("blue");
    fill("blue");
    text("You have successfully passed round one!", 100, 100);
    text("Now, the bear is very hungry...", 100, 150);
    text("To win, collect 20 fish!", 100, 200);
    textSize(40);
    text("Fish Eaten: "+ fishCount, windowWidth - 300, 100);  
  }
  if (gameState == "END"){
    bgend.addImage(bgendimg);
    bgend.scale = 4;
    diesound.play()
   // backgroundSound.stop()
    bg.visible = false;
    bgend.visible = true;
    bear.visible = false;

    textSize(100)
    fill("blue")
    text("YOU LOST",windowWidth/2,windowHeight/2) 
  } 
  if (gameState == "WIN-END"){
    bgend.addImage(bgwinimg);
    bgend.scale = 10;

    bg.visible=false;
    bgend.visible=true;
    bear.visible=false;

    textSize(100)
    fill("blue")
    text("YOU WON",windowWidth/2,windowHeight/2)  
  }
}

function spawnObstacles() {
  if(frameCount % 180 === 0) {
    var obstacle = createSprite(windowWidth + 200, windowHeight - 300,10,40);
    obstacle.scale = 0.2;
    obstacle.debug = true;
    obstacle.y=Math.round(random((windowHeight-windowHeight/3),windowHeight-100))
    //obstacle.setCollider("rectangle",0,0,400,440)  
    obstacle.velocityX = -8;
    obstacle.visible = true;
    
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(sealImage);
              obstacle.scale = 0.5;
              obstacle.setCollider("rectangle",0,0,400,100)  
              break;
      case 2: obstacle.addImage(penguinImage);
              obstacle.scale = 0.4;
              obstacle.setCollider("rectangle",0,0,400,440)  
              break;
      default: break;
    }
     
    obstacle.lifetime = windowWidth/obstacle.x;
     
    obstaclesGroup.add(obstacle);
  }
}

function spawnFish() {
  if(frameCount % 20 === 0) {
    var fish = createSprite(windowWidth/2, 0,40,40);
    fish.debug=true;

    fish.x=Math.round(random(windowWidth/10 ,windowWidth- 50))
    //obstacle.setCollider("rectangle",0,0,400,440)  
    fish.velocityY = 4;
    fish.visible = true;
    
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1:
              fish.addImage(orangeFish)
              fish.scale = 0.5;
              fish.setCollider("rectangle",0,0,200,200)  
              break;
      case 2: fish.addImage(yellowFish);
              fish.scale = 0.5;
              fish.setCollider("rectangle",0,0,200,200)  
              break;
      default: break;
    }
    
    fishGroup.add(fish);
    fish.lifetime = windowHeight/fish.x;
     
  
  }
}

function endFunc(){
  obstaclesGroup.setVelocityXEach(0);
  obstaclesGroup.destroyEach()
  fishGroup.setVelocityXEach(0); 
  fishGroup.destroyEach();
  bg.velocityX = 0;
  bear.velocityX = 0;
}

function restartFunc(){
  startButton.scale = 1;
  helpButton.scale = 1;
  exitButton.scale = 1;
  startButton.y = windowHeight - 125;
  helpButton.y = windowHeight - 125;
  exitButton.y = windowHeight - 125;

  bgend.visible = false;
  bg.visible = true;
  bg.x = windowWidth/2;
  bg.y = windowHeight/2;
  bg.velocityX = 0;
  //bg.scale=5;

  bear.visible = false;
  bear.x = 200;
  bear.y = windowHeight - 300;
  bear.velocityX = 0;

  score = 0;
  fishCount = 0;
  obstaclesGroup = new Group();
  fishGroup = new Group();
  score=0

gameState = "START";
}