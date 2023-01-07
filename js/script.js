const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

const canvasW = canvas.width;
const canvasH = canvas.height;
const particles = [];

class Particle {
  constructor(x, y, radius, vx, vy, index, life, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.vx = vx;
    this.vy = vy;
    this.index = index;
    this.life = life;
    this.color = color;
  }

  render() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.globalAlpha = 0.7;
    ctx.globalCompositeOperation = "lighter";
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    this.vy += 0.05; //縦方向の重力
    this.vy *= 0.95; // 縦方向の摩擦係数
    this.vx += 0.001; //横方向の重力
    this.vx *= 0.99; //横方向の摩擦係数
    this.y += this.vy;
    this.x += this.vx;
    this.life -= 0.5; //1ループ毎に寿命を-1
    this.radius *= 0.992//半径を徐々に小さくする
    //パーティクルy座標が下端より大きくなったら
    if (this.y > canvasH - this.radius) {
      this.y = canvasH - this.radius; //
      this.vy *= -1; //物理演算ナンモワカラン
      this.vx = 0;
    }
    //寿命が0以下の時
    if (this.radius <= 2) {
      this.radius = 0; //半径消滅
      particles.splice(this.index - 1, 5); //配列の後側をひとつ削除
    }
    this.render();
  }
}

let vx = 0;
let vy = 0;
let x, y, color, radius;
let i = 5;
let maxLife = 100;

addEventListener("mousemove", function (e) {
  x = e.clientX;
  y = e.clientY;
  i++;
  radius = Math.floor(Math.random() * 80);
  if (i > 10) {
    emitParticles(i / 2);
  }
});
function emitParticles() {
  life = maxLife;
  vx = 10 * (Math.random() - 0.5);
  vy = 10 * (Math.random() - 0.5);
  const hue = 360 * Math.random();
  color = "hsl(" + hue + ",90%,60%)";
  const particle = new Particle(
    x,
    y,
    radius,
    vx,
    vy,
    i,
    life,
    color,
  );
  particles.unshift(particle);
}

function updateParticles() {
  ctx.clearRect(0, 0, canvasW, canvasH);
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
  }
  requestAnimationFrame(updateParticles);
}
updateParticles();

