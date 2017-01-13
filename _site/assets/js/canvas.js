$(function () {
  var canvas = document.querySelector('canvas'), ctx = canvas.getContext('2d'), color = '#19B5FE';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = 'block';
  ctx.fillStyle = color;
  ctx.lineWidth = .1;
  ctx.strokeStyle = color;
  var mousePosition = {x: 30 * canvas.width / 100, y: 30 * canvas.height / 100};
  var dots = {nb: 500, distance: 80, d_radius: 150, array: []};

  function Dot() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = -.5 + Math.random();
    this.vy = -.5 + Math.random();
    this.radius = Math.random();
  }

  Dot.prototype = {
    create: function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.fill();
    }, animate: function () {
      for (i = 0; i < dots.nb; i++) {
        var dot = dots.array[i];
        if (dot.y < 0 || dot.y > canvas.height) {
          dot.vx = dot.vx;
          dot.vy = -dot.vy;
        }
        else if (dot.x < 0 || dot.x > canvas.width) {
          dot.vx = -dot.vx;
          dot.vy = dot.vy;
        }
        dot.x += dot.vx;
        dot.y += dot.vy;
      }
    }, line: function () {
      for (i = 0; i < dots.nb; i++) {
        for (j = 0; j < dots.nb; j++) {
          i_dot = dots.array[i];
          j_dot = dots.array[j];
        }
      }
    }
  };
  function createDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (i = 0; i < dots.nb; i++) {
      dots.array.push(new Dot());
      dot = dots.array[i];
      dot.create();
    }
    dot.line();
    dot.animate();
  }

  $('canvas').on('mousemove mouseleave', function (e) {
    if (e.type == 'mousemove') {
      mousePosition.x = e.pageX;
      mousePosition.y = e.pageY;
    }
    if (e.type == 'mouseleave') {
      mousePosition.x = canvas.width / 2;
      mousePosition.y = canvas.height / 2;
    }
  });
  setInterval(createDots, 1000 / 30);
});
