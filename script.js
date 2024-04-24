document.addEventListener("DOMContentLoaded", function() {
  const container = document.getElementById("container");
  const ballCount = document.getElementById("ballCount");
  let isDragging = false;
  let selectedBall = null;
  let offsetX, offsetY;

  container.addEventListener("mousedown", function(event) {
    const target = event.target;
    if (target.classList.contains("ball")) {
      isDragging = true;
      selectedBall = target;
      offsetX = event.clientX - selectedBall.getBoundingClientRect().left;
      offsetY = event.clientY - selectedBall.getBoundingClientRect().top;
    }
  });

  container.addEventListener("mousemove", function(event) {
    if (isDragging && selectedBall) {
      selectedBall.style.left = `${event.clientX - offsetX}px`;
      selectedBall.style.top = `${event.clientY - offsetY}px`;
    }
  });

  container.addEventListener("mouseup", function() {
    if (isDragging) {
      isDragging = false;
      selectedBall = null;
    }
  });

  const balls = [];
  let count = 0;

  container.addEventListener("click", function(event) {
    if (!isDragging && event.target === container) {
      createBall(event.clientX, event.clientY);
    }
  });

  function createBall(x, y) {
    count++;
    const ball = document.createElement("div");
    ballCount.textContent = count;
    ball.classList.add("ball");
    ball.style.left = `${x - 15}px`;
    ball.style.top = `${y - 15}px`;
    container.appendChild(ball);
    balls.push({ element: ball, velocity: { x: Math.random() * 4 - 2, y: Math.random() * 4 - 2 } });
  }

  // Update ball positions and handle collisions
  setInterval(() => {
    balls.forEach(ball => {
      const velocity = ball.velocity;
      const ballElement = ball.element;

      if (!isDragging || ballElement !== selectedBall) {
        velocity.y += 0.5 ; // Apply gravity

        // Update ball position
        const newX = parseInt(ballElement.style.left) + velocity.x;
        const newY = parseInt(ballElement.style.top) + velocity.y;
        ballElement.style.left = `${newX}px`;
        ballElement.style.top = `${newY}px`;

        // Check collision with container walls
        if (newX <= 0 || newX + ballElement.offsetWidth >= container.offsetWidth) {
          velocity.x *= -0.9; // Reverse horizontal velocity with damping
        }
        if (newY <= 0 || newY + ballElement.offsetHeight >= container.offsetHeight) {
          velocity.y *= -0.9; // Reverse vertical velocity with damping
        }

        // Check ball-to-ball collisions
        balls.forEach(otherBall => {
          if (otherBall !== ball) {
            const dx = parseInt(ballElement.style.left) - parseInt(otherBall.element.style.left);
            const dy = parseInt(ballElement.style.top) - parseInt(otherBall.element.style.top);
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 30) {
              // Adjust the collision radius as needed
              const collisionNormalX = dx / distance;
              const collisionNormalY = dy / distance;

              const relativeVelocityX = velocity.x - otherBall.velocity.x;
              const relativeVelocityY = velocity.y - otherBall.velocity.y;

              const dotProduct = relativeVelocityX * collisionNormalX + relativeVelocityY * collisionNormalY;

              // Elastic collision
              if (dotProduct < 0) {
                const impulse = (2 * dotProduct) / 2;

                velocity.x -= impulse * collisionNormalX;
                velocity.y -= impulse * collisionNormalY;

                otherBall.velocity.x += impulse * collisionNormalX;
                otherBall.velocity.y += impulse * collisionNormalY;
              }
            }
          }
        });
      }
    });
  }, 20);
});
