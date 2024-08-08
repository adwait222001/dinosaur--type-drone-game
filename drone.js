let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

let droneWidth = 150; // Set to 150 pixels
let droneHeight = 130; // Set to 130 pixels
let droneX = 50;
let droneY = boardHeight - droneHeight;
let droneimg;
let gameOverDroneimg;

let drone = {
  x: droneX,
  y: droneY,
  width: droneWidth,
  height: droneHeight
}

let buildingArray = [];
let building1Width = 29; // Reduced by 5 pixels
let building2Width = 64; // Reduced by 5 pixels
let building3Width = 97; // Reduced by 5 pixels
let buildingX = 700;
let buildingHeight = 60; // Reduced height to 60 pixels
let buildingY = boardHeight - buildingHeight;
let building1img;
let building2img;
let building3img;

let velocityx = -8;  // Movement speed for buildings
let velocityY = 0;   // Initial vertical velocity for the drone
let gravity = 0.4;   // Gravity effect on the drone
let gameover = false;
let score = 0;
let gameStarted = false; // Add a flag to track if the game has started
let jumpCount = 0; // Track the number of jumps

window.onload = function() {
  board = document.getElementById("board");
  board.height = boardHeight;  
  board.width = boardWidth;
  context = board.getContext("2d");

  // Set the background color to black
  context.fillStyle = "black";
  context.fillRect(0, 0, boardWidth, boardHeight);

  droneimg = new Image();
  droneimg.src = "C:/Users/Admin/Desktop/dronegame-1/Render v10.png"; // Updated path to new drone image
  droneimg.onload = function() {
    context.drawImage(droneimg, drone.x, drone.y, drone.width, drone.height);
  }

  gameOverDroneimg = new Image();
  gameOverDroneimg.src = "C:/Users/Admin/Desktop/dronegame-1/Pitch Forward.png"; // Updated path to crash image

  building1img = new Image();
  building1img.src = "C:/Users/Admin/Desktop/dronegame-1/final building-1.png"; // Path to building1 image

  building2img = new Image();
  building2img.src = "C:/Users/Admin/Desktop/dronegame-1/final building-2.png"; // Path to building2 image

  building3img = new Image();
  building3img.src = "C:/Users/Admin/Desktop/dronegame-1/final building-3.png"; // Path to building3 image

  document.addEventListener("keydown", movedrone);

  showStartMessage(); // Show the start message when the page loads
}

function update() {
  if (gameover) {
    // Clear the canvas and draw the crash image and final score
    context.fillStyle = "black";
    context.fillRect(0, 0, boardWidth, boardHeight); // Ensure the background remains black
    context.drawImage(gameOverDroneimg, drone.x, drone.y, drone.width, drone.height); // Display crash image
    
    // Display the "Game Over" message
    context.fillStyle = "white";
    context.font = "50px Arial"; // Font size for "Game Over"
    context.textAlign = "center";
    context.fillText("Game Over", boardWidth / 2, boardHeight / 2 - 50); // Display "Game Over" above the score

    // Display the final score
    context.font = "60px Arial"; // Font size for the score
    context.fillText("Score: " + score, boardWidth / 2, boardHeight / 2); // Display score in the center

    return;
  }
  
  velocityY += gravity;
  drone.y = Math.min(drone.y + velocityY, droneY); // Ensure the drone doesn’t go below the ground
  
  if (drone.y < 0) {
    drone.y = 0; // Ensure the drone doesn’t go above the top edge
  }
  
  context.clearRect(0, 0, boardWidth, boardHeight);
  context.fillStyle = "black";
  context.fillRect(0, 0, boardWidth, boardHeight);
  context.drawImage(droneimg, drone.x, drone.y, drone.width, drone.height);
  
  // Draw buildings
  for (let i = 0; i < buildingArray.length; i++) {
    let building = buildingArray[i];
    building.x += velocityx; // Move building
    context.drawImage(building.img, building.x, building.y, building.width, building.height);
    
    if (detectcollison(drone, building)) {
      gameover = true;
      // Clear the canvas, keep the background black, and draw the crash image and final score
      context.fillStyle = "black";
      context.fillRect(0, 0, boardWidth, boardHeight);
      context.drawImage(gameOverDroneimg, drone.x, drone.y, drone.width, drone.height); // Display crash image
      
      // Display the "Game Over" message
      context.fillStyle = "white";
      context.font = "50px Arial"; // Font size for "Game Over"
      context.textAlign = "center";
      context.fillText("Game Over", boardWidth / 2, boardHeight / 2 - 50); // Display "Game Over" above the score

      // Display the final score
      context.font = "60px Arial"; // Font size for the score
      context.fillText("Score: " + score, boardWidth / 2, boardHeight / 2); // Display score in the center
      return; // Stop updating further when game is over
    }
    
    // Remove building if it goes off-screen
    if (building.x + building.width < 0) {
      buildingArray.splice(i, 1);
      i--;
      score++; // Increase score when a building passes by
    }
  }

  // Display the score at the top center
  context.fillStyle = "white";
  context.font = "30px Arial";
  context.textAlign = "center";
  context.fillText("Score: " + score, boardWidth / 2, 30);

  requestAnimationFrame(update); 
}

function movedrone(e) {
  if (gameover) {
    return;
  }
  
  if (!gameStarted && (e.code == "Space" || e.code == "ArrowUp")) {
    gameStarted = true;
    hideStartMessage(); // Hide the start message
    requestAnimationFrame(update); // Start the game loop
    setInterval(placebuilding, 1000);
  }
  
  if (gameStarted && (e.code == "Space" || e.code == "ArrowUp")) {
    if (drone.y == droneY) {
      // First jump
      velocityY = -10;
      jumpCount = 1;
    } else if (jumpCount < 2) {
      // Double jump
      velocityY = -10;
      jumpCount++;
    }
  }
}

function placebuilding() {
  if (gameover) {
    return;
  }
  
  let building = {
    img: null,
    x: buildingX,
    y: buildingY,
    width: null,
    height: buildingHeight
  }
  
  let placebuildingchance = Math.random();
  if (placebuildingchance > 0.90) {
    building.img = building3img;
    building.width = building3Width;
  } else if (placebuildingchance > 0.70) {
    building.img = building2img;
    building.width = building2Width;
  } else if (placebuildingchance > 0.50) {
    building.img = building1img;
    building.width = building1Width;
  } else {
    return; // Do not add building if chance is less than 0.50
  }
  
  buildingArray.push(building);
}

function detectcollison(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

function showStartMessage() {
  // Set the box dimensions
  let boxWidth = 300;
  let boxHeight = 40;

  // Draw the box with the new dimensions
  context.fillStyle = "white";
  context.fillRect(boardWidth / 2 - boxWidth / 2, boardHeight / 2 - boxHeight / 2, boxWidth, boxHeight);

  // Set the text style and draw the message
  context.fillStyle = "black";
  context.font = "bold 20px Arial"; // Bold font
  context.textAlign = "center";
  context.fillText("Click Space Bar to Start", boardWidth / 2, boardHeight / 2 + 5); // Adjusted vertical position for centering
}

function hideStartMessage() {
  // Clear the canvas and redraw the game elements to hide the start message
  context.clearRect(0, 0, boardWidth, boardHeight);
  context.fillStyle = "black";
  context.fillRect(0, 0, boardWidth, boardHeight);
}
