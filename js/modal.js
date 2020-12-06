const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let ballRadius = 20; // размер шарика
let color = randColor();
let paddleHeight = 10; // размер ракетки высота
let paddleWidth = 100; // размер ракетки длина
let paddleX = (canvas.width - paddleWidth) / 2; // ракетка по центру поля
let rightPressed = false;
let leftPressed = false;

let brickRowCount = 3; //определили количество строк
let brickColumnCount = 12; // столбцов кирпичей
let brickWidth = 75; // их ширину
let brickHeight = 20; // и высоту
let brickPadding = 10; //прокладку между кирпичами
let brickOffsetTop = 25; //верхнее и
let brickOffsetLeft = 25; //левое смещение
let score = 0;

let bricks = [];

let lives = 3;

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
}
function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
}
// function keyDownHandler(e) {
//   if (e.key == 'Right' || e.key == 'ArrowRight') {
//     rightPressed = true;
//   } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
//     leftPressed = true;
//   }
// }

// function keyUpHandler(e) {
//   if (e.key == 'Right' || e.key == 'ArrowRight') {
//     rightPressed = false;
//   } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
//     leftPressed = false;
//   }
// }

function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft; // relativeX, которое равно горизонтальному положению мыши в окне браузера (e.clientX) минус расстояние между левым краем canvas и левым краем окна браузера (canvas.offsetLeft) - фактически это равно расстоянию между левым краем canvas и указателем мыши.
  if (relativeX > 0 && relativeX < canvas.width) {
    //Если относительный указатель позиции X больше нуля и меньше, чем ширина Canvas, указатель находится в пределах границы Canvas, и paddleX установки (крепится на левый край ракетки) - устанавливается на relativeX значение минус половина ширины ракетки, так что движение будет по отношению к середине ракетки.
    paddleX = relativeX - paddleWidth / 2; //; можно не делить на 2
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status == 1) {
        // удары об блоки
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0; // удары об блоки
          score++;
          // score += 2; // начислять баллы каждый раз при ударе кирпича
          if (score == brickRowCount * brickColumnCount) {
            alert(`'YOU WIN, CONGRATULATIONS! score: ${score}'`); // отобразить сообщение о победе (выводить набранные очки)
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = color; // цвет шарика
  ctx.fill();
  ctx.closePath();
}
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = color; // цвет платформы
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  // управление кирпичами
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        // удары об блоки
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}
function drawScore() {
  // для создания и обновления отображения оценки.
  ctx.font = '16px Arial'; //размер и тип шрифта
  ctx.fillStyle = '#0095DD';
  ctx.fillText('Score: ' + score, 8, 20); // Первым параметром является сам текст - приведенный выше код показывает текущее количество точек, а два последних параметра - это координаты, в которых текст будет помещен на канву.
}

function drawLives() {
  // Отрисовка счетчика жизни
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives(); // жизни Визуализация дисплея жизней
  collisionDetection(); // удары об кирпичи

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    // условия касания стенок, правая и левая. если коорд "х" мяча + шаг dx > чем ширина рамки - радиус шарика || lheufz cntyrf
    dx = -dx; // меняем направление движения на противоположное
    color = randColor();
  }
  if (y + dy < ballRadius) {
    // условия касания стенок, верхняя
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius - paddleHeight) {
    // если касание нижней стенки то проверяем платформу
    if (x > paddleX && x < paddleX + paddleWidth) {
      // если на платформе
      dy = -dy; // если на платформе меняем направление
      // dy = -2 * dy; // ускорение
    } else {
      // alert('GAME OVER');
      // document.location.reload();
      // clearInterval(interval); // Needed for Chrome to end game
      lives--; //  когда мяч попадает в нижний край экрана, мы вычитаем одну жизнь из переменной lives
      if (!lives) {
        alert('GAME OVER'); //  Если жизней не осталось, игра проиграна
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width - paddleWidth) / 2; // если осталось еще несколько жизней, то положение мяча и биты сбрасываются вместе с движением мяча
      }
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7; // кол-во пикселей для перемещения, (чем больше тем быстрее движется платформа)
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
  x += dx;
  y += dy;
  requestAnimationFrame(draw); // заставляет функцию draw() вызывать себя снова и снова
}

function randColor() {
  let r = Math.floor(Math.random() * 256),
    g = Math.floor(Math.random() * 256),
    b = Math.floor(Math.random() * 256);
  return '#' + r.toString(16) + g.toString(16) + b.toString(16);
}

//let interval = setInterval(draw, 10); // скорость шарика
draw();
