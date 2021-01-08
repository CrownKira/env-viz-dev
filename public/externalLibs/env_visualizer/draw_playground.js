/*
 * DRAW ON THE PLAYGROUND CANVAS HERE
 */
(function () {
  const canvas = document.querySelector('#playground-container canvas');
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'green';
  ctx.fillRect(10, 10, 100, 100);
})();
