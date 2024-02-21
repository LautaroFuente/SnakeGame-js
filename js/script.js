const $play = document.getElementById('play');
const $snake = document.getElementById('snake');
const $stage = document.getElementById('stage');
const $points = document.getElementById('points');
const $modal = document.getElementById('modal');
const $continue = document.getElementById('continue');
const $totalPoints = document.getElementById('total-points');

let pointCont = 0;
let x = 0;
let y = 0;
let direc = 'right';

document.addEventListener('keydown', function(event) {
  const key = event.key;

  if (key === 'ArrowUp') {
    direc = 'top';
  } else if (key === 'ArrowDown') {
    direc = 'down';
  } else if (key === 'ArrowLeft') {
    direc = 'left';
  } else if (key === 'ArrowRight') {
    direc = 'right';
  }
});

function move(){
  const limitStage = $stage.getBoundingClientRect();
  const moving = setInterval(function() {
    let limitSnake = $snake.getBoundingClientRect();
    pointCont++;
    $points.textContent = `Puntuacion: ${pointCont}`;
    if (direc === 'top') {
      if(limitSnake.top > limitStage.top){
        y--;
      }else{
        clearInterval(moving);
        clearInterval(foodInterval);
        clearInterval(obstacleInterval);
        gameOver();
      }
      } 
      
      else if (direc === 'down') {
        if(limitSnake.bottom < limitStage.bottom){
          y++;
        }else{
          clearInterval(moving);
          clearInterval(foodInterval);
          clearInterval(obstacleInterval);
          gameOver();
        }
      } 
      
      else if (direc === 'left') {
        if(limitSnake.left > limitStage.left){
          x--;
        }else{
          clearInterval(moving);
          clearInterval(foodInterval);
          clearInterval(obstacleInterval);
          gameOver();
        }
      } 
      
      else if (direc === 'right') {
        if(limitSnake.right < limitStage.right){
          x++;
        }else{
          clearInterval(moving);
          clearInterval(foodInterval);
          clearInterval(obstacleInterval);
          gameOver();
        }
      }
 
      $snake.style.transform = `translate(${x}px, ${y}px)`;
      detectColisionFood();
      detectColisionObstacle(moving, foodInterval, obstacleInterval);
  
  }, 7);
  const foodInterval = foodGenerator();
  const obstacleInterval = obstacleGenerator();
  obstacleInterval();
  foodInterval();
  moving();
}

$play.addEventListener('click', function(){
    $play.classList.remove('show');
    $play.classList.add('hide');
    $snake.classList.add('show');
    $snake.classList.remove('hide');
    disableScroll();
    move();
});

function gameOver(){
    direc = 'right';
    $snake.style.transform = `translate(${x * -1}px, ${y * -1}px)`;
    x = 0;
    y = 0;
    deleteElems();
    $play.classList.remove('hide');
    $play.classList.add('show');
    $snake.classList.add('hide');
    $snake.classList.remove('show');
    $modal.style.display = 'inherit';
    $totalPoints.textContent = `Puntuacion: ${pointCont}`;
    enableScroll();
}

$continue.addEventListener('click', function(){
  pointCont = 0;
  $modal.style.display = 'none';
});

function generateFood() {
  const dimensions = $stage.getBoundingClientRect();
  const width = dimensions.width;
  const height = dimensions.height;
  
  const posX = Math.floor(Math.random() * (width - 0 + 1)) + 1;
  const posY = Math.floor(Math.random() * (height - 0 + 1)) + 1;

  if(posX + 20 > width){
    posX -= 20;
  }
  if(posY + 35 > height){
    posY -= 20;
  }
  
  const elem = document.createElement('p');
  elem.classList.add('delete');
  elem.classList.add('food');
  elem.innerHTML = '<i class="bi bi-egg-fill"></i>';
  elem.style.position = 'absolute';
  elem.style.left = (posX - 1) + 'px';
  elem.style.top = (posY - 1) + 'px';
  
  $stage.appendChild(elem);
}

function foodGenerator(){
  return foodInterval = setInterval(function(){
    generateFood();
  },2000);
}

function obstacleGenerator(){
  return obstacleInterval = setInterval(function(){
    generateObstacle();
  },10000);
}

function generateObstacle() {
  const dimensions = $stage.getBoundingClientRect();
  const width = dimensions.width;
  const height = dimensions.height;
  
  const posX = Math.floor(Math.random() * (width - 0 + 1)) + 1;
  const posY = Math.floor(Math.random() * (height - 0 + 1)) + 1;

  if(posX + 20 > width){
    posX -= 20;
  }
  if(posY + 35 > height){
    posY -= 20;
  }
  
  const elem = document.createElement('p');
  elem.classList.add('delete');
  elem.classList.add('obstacle');
  elem.innerHTML = '<i class="bi bi-exclamation-square-fill"></i>';
  elem.style.position = 'absolute';
  elem.style.left = (posX -1) + 'px';
  elem.style.top = (posY -1) + 'px';
  
  $stage.appendChild(elem);
}

function deleteElems() {
  const elems = $stage.querySelectorAll('.delete');
  
  elems.forEach(function(elem) {
    elem.remove();
  });
}

function detectColisionFood() {
  const foods = document.querySelectorAll('.food');

  const snakePlace = $snake.getBoundingClientRect();

  foods.forEach(function(elem) {

    elemPlace = elem.getBoundingClientRect();
    if (
      snakePlace.left < elemPlace.right &&
      snakePlace.right > elemPlace.left &&
      snakePlace.top < elemPlace.bottom &&
      snakePlace.bottom > elemPlace.top
    ){
      elem.remove();
      generateObstacle();
      pointCont += 10000;
    }
  });
}

function detectColisionObstacle(inter1, inter2, inter3) {
  const obstacles = document.querySelectorAll('.obstacle');

  const snakePlace = $snake.getBoundingClientRect();

  obstacles.forEach(function(elem) {

    elemPlace = elem.getBoundingClientRect();
    if (
      snakePlace.left < elemPlace.right &&
      snakePlace.right > elemPlace.left &&
      snakePlace.top < elemPlace.bottom &&
      snakePlace.bottom > elemPlace.top
    ){
      clearInterval(inter1);
      clearInterval(inter2);
      clearInterval(inter3);
      gameOver();
    }
  });


}

/* fix scrolling with playing */

function disableScroll() {
  document.body.style.overflow = 'hidden';
}

function enableScroll() {
  document.body.style.overflow = '';
}

/* mobile */
function emulateArrow(direccion) {

  let event = new KeyboardEvent('keydown', {
      key: direccion,
      bubbles: true,
      cancelable: true,
  });

  document.dispatchEvent(event);
}