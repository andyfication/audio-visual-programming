// Waiting for the DOM to be fully loaded
window.addEventListener('load', function () {
  console.log('DOM has fully loaded');
  init();
});

// Main function which executes as soon as the DOM is fully loaded
function init() {
  console.log('Calling the init function');

  // --------------------------Canvas2D and Context--------------------------
  const canvas = document.getElementById('page-canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext('2d');
  // ------------------------------------------------------------------------

  // --------------------------Title Class-----------------------------------
  class Title {
    constructor(x, y, text) {
      this.x = x;
      this.y = y;
      this.text = text;
    }

    display() {
      ctx.font = `${innerWidth / 10}px Ranchers `;
      ctx.fillStyle = 'rgb(255,255,255,1)';
      ctx.fillText(
        this.text,
        this.x - ctx.measureText(this.text).width / 2,
        this.y + parseInt(ctx.font) / 2.5
      );
    }
  }
  // ------------------------------------------------------------------------

  // ----------------------------Box Class-----------------------------------
  class Box {
    constructor(x, y, width, height, type) {
      this.width = width;
      this.height = height;
      this.x = x;
      this.y = y;
      this.color = `rgba(${Math.floor(Math.random() * 255)},${Math.floor(
        Math.random() * 255
      )},${Math.floor(Math.random() * 255)},0.5)`;
      this.type = type;
      this.active = false;
      this.angle = 0;
    }

    display() {
      ctx.fillStyle = this.color;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
      ctx.restore();
    }

    update() {
      if (this.active) {
        switch (this.type) {
          case 'spinner':
            this.angle += 0.05;
            break;
          case 'reverse-spinner':
            this.angle -= 0.08;
            break;
        }
      }
    }

    setActive(x, y) {
      if (
        x > this.x - this.width / 2 &&
        x < this.x - this.width / 2 + this.width &&
        y > this.y - this.height / 2 &&
        y < this.y - this.height / 2 + this.height
      ) {
        this.active = !this.active;
      }
    }
  }

  // ------------------------------------------------------------------------

  // ----------------------------Circle Class--------------------------------
  class Circle {
    constructor(x, y, radius) {
      this.x = x;
      this.y = y;
      this.radius = radius * Math.random();
      this.velocityX = Math.random() * Math.round(Math.random()) * 2 - 1;
      this.velocityY = Math.random() * Math.round(Math.random()) * 2 - 1;
      this.color = `rgba(${Math.floor(Math.random() * 255)},${Math.floor(
        Math.random() * 255
      )},${Math.floor(Math.random() * 255)},${Math.random()})`;
    }

    display() {
      ctx.strokeStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.stroke();
    }

    update() {
      this.x += this.velocityX;
      this.y += this.velocityY;
    }
  }

  // ------------------------------------------------------------------------

  // Variable declaration and initialisation
  const title = new Title(innerWidth / 2, innerHeight / 2, 'CANVAS2D');
  const listOfBoxes = [];
  const listOfCircles = [];

  // Arrange the squares evenly around the central text
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
      listOfBoxes.push(
        new Box(
          (innerWidth / 2) * col + innerWidth / 4,
          (innerHeight / 2) * row + innerHeight / 4,
          innerWidth / 10,
          innerWidth / 10,
          row == 0 ? 'spinner' : 'reverse-spinner'
        )
      );
    }
  }

  // Call this function 60 times per second
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    title.display();

    for (let count = 0; count < listOfBoxes.length; count++) {
      listOfBoxes[count].display();
      listOfBoxes[count].update();
    }

    for (let count = 0; count < listOfCircles.length; count++) {
      listOfCircles[count].display();
      listOfCircles[count].update();
    }

    for (let count = 0; count < listOfCircles.length; count++) {
      if (listOfCircles.length > 100) {
        listOfCircles.splice(0, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  // Initialise the animation
  animate();

  //--------------------Event Listeners-----------------------------------

  // Fired when the mouse is moved
  canvas.addEventListener('mousemove', (event) => {
    const x = event.clientX;
    const y = event.clientY;
    let emit = true;

    for (let count = 0; count < listOfBoxes.length; count++) {
      if (listOfBoxes[count].active) {
        emit = true;
      } else {
        emit = false;
        break;
      }
    }
    if (emit) {
      listOfCircles.push(new Circle(x, y, 30));
    }
  });

  // Fired when the mouse is clicked
  canvas.addEventListener('click', (event) => {
    const x = event.clientX;
    const y = event.clientY;
    for (let count = 0; count < listOfBoxes.length; count++) {
      listOfBoxes[count].setActive(x, y);
    }
  });
}
// ------------------------------------------------------------------------
