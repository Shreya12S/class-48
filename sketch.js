var bg,bgImg;
var shooter,shooterImg
var shootingImg;
var zombie,zombieImg;
var zombieGroup;
var bullet;
var bulletGroup;
var bullets=70;
var heart1,heart2,heart3;
var heart1Img,heart2Img,heart3Img;
var score=0;
var life=3;
var lose,winning,explosionSound;
var gameState="fight";

function preload(){
  bgImg= loadImage("assets/bg.jpeg")
  shooterImg= loadImage("assets/shooter_2.png")
  shootingImg= loadImage("assets/shooter_3.png")
  zombieImg= loadImage("assets/zombie.png")
  heart1Img= loadImage("assets/heart_1.png")
  heart2Img= loadImage("assets/heart_2.png")
  heart3Img= loadImage("assets/heart_3.png")
  lose= loadSound("assets/lose.mp3")
  winning= loadSound("assets/win.mp3")
  explosionSound= loadSound("assets/explosion.mp3")
}
function setup(){
  createCanvas(windowWidth,windowHeight)
  //adding the background and its image
  bg=createSprite(displayWidth/2,displayHeight/2)
  bg.addImage(bgImg)
  shooter=createSprite(70,470,50,50)
  shooter.scale=0.3
  shooter.addImage(shooterImg)
  //creating zombieGroup
  zombieGroup=new Group()
  shooter.debug=true;
  shooter.setCollider("rectangle",0,0,300,300)
  //creating bulletGroup
  bulletGroup= new Group()
  heart1=createSprite(displayWidth-150,40,20,20)
  heart1.visible=false;
  heart1.addImage("heart1",heart1Img)
  heart1.scale=0.4
  heart2=createSprite(displayWidth-100,40,20,20)
  heart2.visible=false;
  heart2.addImage("heart2",heart2Img)
  heart2.scale=0.4
  heart3=createSprite(displayWidth-170,40,20,20)
  heart3.addImage("heart3",heart3Img)
  heart3.scale=0.4

}
function draw(){
  background("black")
  if(gameState== "fight"){
    //displaying appropriate image acc lives remaining
    if(life==3){
      heart3.visible=true;
      heart1.visible=false;
      heart2.visible=false;
    }
    if(life==2){
      heart3.visible=false;
      heart1.visible=false;
      heart2.visible=true;
    }
    if(life==1){
      heart3.visible=false;
      heart1.visible=true;
      heart2.visible=false;
    }
    //go to gamestate lost if life is 0
    if(life==0){
      gameState="lost"
    }
    //go to gamestate won if score is 100
    if(score==100){
      gameSate="won"
      winning.play();
    }
    //moving the player in directions during fight state
    if(keyDown("left")&& shooter.x>25){
      shooter.x -= 5
  
    }
    if(keyDown("right")){
      shooter.x += 5
    }
    if(keyDown("up")&& shooter.y>70){
      shooter.y -= 5
    }
    if(keyDown("down")&& shooter.y<500){
      shooter.y += 5
    }
    //release bullets and change animation of  shooter to shooting when space is pressed
    if(keyWentDown("space")){
      shooter.addImage(shootingImg)
      bullet=createSprite(displayWidth-1150,shooter.y-30,20,10)
      bulletGroup.add(bullet)
      bullet.velocityX=20;
      shooter.depth=bullet.depth
      shooter.depth= shooter.depth+1   
      bullets=bullets-1
    }
    //player go back to original image once we stop pressing space bar

    else if(keyWentUp("space")){
      shooter.addImage(shooterImg)
    }
    //go to gamestate bullet when player run out of bullet
    if(bullets==0){
      gameState="bullet"
      lose.play();
    }
      //destroy zombie when player touches it and reduce life
    if(zombieGroup.isTouching(shooter)){
      lose.play();
      
      for(var i=0;i<zombieGroup.length;i++){
        if(zombieGroup[i].isTouching(shooter)){
          zombieGroup[i].destroy()
          life=life-1
        }
      }
    }
    //destroy zombie when bullet touches it and update score
    if(zombieGroup.isTouching(bulletGroup)){
      for(var i=0;i<zombieGroup.length;i++){
        if(zombieGroup[i].isTouching(bulletGroup)){
          zombieGroup[i].destroy()
          bulletGroup.destroyEach();
          explosionSound.play()
          score=score+5
        }
      }
    }
    //creating zombies
    enemy();
  }
  
  
  drawSprites()
  //display score and remaining bulletes and lives
  textSize(20)
  fill("white")
  text("Bullets="+bullets,displayWidth-210,displayHeight/2-250)
  text("Lives="+life,displayWidth-200,displayHeight/2-280)
  text("Score="+score,displayWidth-200,displayHeight/2-220)
  //destroy zombie and player and display a message in gamestate lost
  if(gameState=="lost"){
    textSize(100)
    fill("yellow")
    text("You Lost",400,400)
    zombieGroup.destroyEach()
    shooter.destroy()
  }
  //destroy zombie player and bullet when gamestate is bullet
  else if(gameState=="bullet"){
    zombieGroup.destroyEach()
    shooter.destroy()
    bulletGroup.destroyEach()
    fill("yellow")
    textSize(50)
    text("You Ran Out Of Bullets",470,410)
  }
  //gameState won
  else if(gameState=="won"){
    zombieGroup.destroyEach()
    shooter.destroy()
    fill("yellow")
    textSize(50)
    text("You WON",400,400)
  }

}

function enemy(){
  if(frameCount%50==0){
    zombie= createSprite(random(500,1100),random(100,500),50,50)
    zombie.addImage(zombieImg)
    zombie.scale=0.15
    zombie.velocityX= -3;
    zombie.lifetime=width/3;
    zombieGroup.add(zombie)
    zombie.debug=true;
    zombie.setCollider("rectangle",0,0,400,400)
  }
  
}