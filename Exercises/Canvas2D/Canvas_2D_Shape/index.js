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

  // --------------------------Draw Rectangle--------------------------------
  ctx.rect(
    innerWidth / 2 - innerWidth / 2 / 2,
    innerHeight / 2 - innerHeight / 2 / 2,
    innerWidth / 2,
    innerHeight / 2
  );
  ctx.fillStyle = '#ff0000';
  ctx.fill();
  // ------------------------------------------------------------------------
}
