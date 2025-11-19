// Auto Rush - 3D Endless Runner Game
// Main Game Class

class AutoRush {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.player = null;
        this.obstacles = [];
        this.coins = [];
        this.powerUpObjects = [];
        this.road = [];

        // Game state
        this.gameState = 'menu'; // menu, playing, paused, gameover
        this.score = 0;
        this.currentCoins = 0;
        this.speed = 0.1;
        this.baseSpeed = 0.1;
        this.distance = 0;
        this.lives = 3;

        // Player progress
        this.totalCoins = this.loadProgress('totalCoins') || 0;
        this.highScore = this.loadProgress('highScore') || 0;
        this.isPremium = this.loadProgress('isPremium') || false;
        this.ownedCars = this.loadProgress('ownedCars') || ['car_classic'];
        this.currentCar = this.loadProgress('currentCar') || 'car_classic';
        this.ownedPowerUps = this.loadProgress('ownedPowerUps') || {};

        // Power-ups
        this.activePowerUps = {};

        // Controls
        this.keys = {};
        this.playerLane = 1; // 0 = left, 1 = middle, 2 = right
        this.isJumping = false;
        this.jumpVelocity = 0;
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        // Settings
        this.settings = {
            sfx: true,
            music: true,
            quality: 'medium',
            sensitivity: 1
        };

        // Animation
        this.animationId = null;
        this.lastTime = Date.now();

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUI();

        // Show mobile controls if on mobile
        if (this.isMobile) {
            document.getElementById('mobileControls').style.display = 'flex';
        }
    }

    setupEventListeners() {
        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;

            if (this.gameState === 'playing') {
                if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                    this.moveLeft();
                } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                    this.moveRight();
                } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
                    this.jump();
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        // Window resize
        window.addEventListener('resize', () => {
            if (this.camera && this.renderer) {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            }
        });
    }

    setupThreeJS() {
        const container = document.getElementById('gameContainer');

        // Scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x1a1a2e, 10, 50);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 3, 5);
        this.camera.lookAt(0, 0, -10);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        container.appendChild(this.renderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        const neonLight1 = new THREE.PointLight(0x00d4ff, 2, 50);
        neonLight1.position.set(-5, 3, 0);
        this.scene.add(neonLight1);

        const neonLight2 = new THREE.PointLight(0xff0080, 2, 50);
        neonLight2.position.set(5, 3, 0);
        this.scene.add(neonLight2);

        // Create player car
        this.createPlayer();

        // Create road
        this.createRoad();

        // Start game loop
        this.animate();
    }

    createPlayer() {
        // Car body
        const bodyGeometry = new THREE.BoxGeometry(0.8, 0.4, 1.5);
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0x00d4ff,
            emissive: 0x00d4ff,
            emissiveIntensity: 0.2
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;

        // Car roof
        const roofGeometry = new THREE.BoxGeometry(0.6, 0.3, 0.8);
        const roof = new THREE.Mesh(roofGeometry, bodyMaterial);
        roof.position.y = 0.35;
        roof.position.z = -0.1;

        // Wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.15, 16);
        const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });

        const wheels = [];
        const wheelPositions = [
            [-0.4, -0.2, 0.5],
            [0.4, -0.2, 0.5],
            [-0.4, -0.2, -0.5],
            [0.4, -0.2, -0.5]
        ];

        wheelPositions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(pos[0], pos[1], pos[2]);
            wheels.push(wheel);
        });

        // Group everything
        this.player = new THREE.Group();
        this.player.add(body);
        this.player.add(roof);
        wheels.forEach(wheel => this.player.add(wheel));

        this.player.position.set(0, 0, 0);
        this.scene.add(this.player);
    }

    createRoad() {
        const roadWidth = 6;
        const roadLength = 100;
        const segmentLength = 10;

        for (let i = 0; i < roadLength / segmentLength; i++) {
            const roadGeometry = new THREE.PlaneGeometry(roadWidth, segmentLength);
            const roadMaterial = new THREE.MeshPhongMaterial({
                color: 0x2a2a3e,
                side: THREE.DoubleSide
            });
            const roadSegment = new THREE.Mesh(roadGeometry, roadMaterial);
            roadSegment.rotation.x = -Math.PI / 2;
            roadSegment.position.z = -i * segmentLength - segmentLength / 2;
            roadSegment.receiveShadow = true;
            this.scene.add(roadSegment);
            this.road.push(roadSegment);

            // Lane markings
            for (let j = 0; j < 3; j++) {
                const lineGeometry = new THREE.PlaneGeometry(0.1, segmentLength);
                const lineMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    side: THREE.DoubleSide
                });
                const line = new THREE.Mesh(lineGeometry, lineMaterial);
                line.rotation.x = -Math.PI / 2;
                line.position.set((j - 1) * 2, 0.01, -i * segmentLength - segmentLength / 2);
                this.scene.add(line);
                this.road.push(line);
            }
        }
    }

    spawnObstacle() {
        const lane = Math.floor(Math.random() * 3) - 1; // -1, 0, 1 (left, middle, right)
        const types = ['box', 'cone', 'barrier'];
        const type = types[Math.floor(Math.random() * types.length)];

        let geometry, material, obstacle;

        switch (type) {
            case 'box':
                geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
                material = new THREE.MeshPhongMaterial({ color: 0xff0080 });
                obstacle = new THREE.Mesh(geometry, material);
                break;
            case 'cone':
                geometry = new THREE.ConeGeometry(0.4, 1, 8);
                material = new THREE.MeshPhongMaterial({ color: 0xffaa00 });
                obstacle = new THREE.Mesh(geometry, material);
                obstacle.position.y = 0.5;
                break;
            case 'barrier':
                geometry = new THREE.BoxGeometry(1.5, 0.5, 0.3);
                material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
                obstacle = new THREE.Mesh(geometry, material);
                obstacle.position.y = 0.25;
                break;
        }

        obstacle.position.set(lane * 2, 0, -30);
        obstacle.castShadow = true;
        this.scene.add(obstacle);
        this.obstacles.push(obstacle);
    }

    spawnCoin() {
        const lane = Math.floor(Math.random() * 3) - 1;

        const geometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16);
        const material = new THREE.MeshPhongMaterial({
            color: 0xffd700,
            emissive: 0xffd700,
            emissiveIntensity: 0.5
        });
        const coin = new THREE.Mesh(geometry, material);
        coin.rotation.x = Math.PI / 2;
        coin.position.set(lane * 2, 0.5, -30);

        this.scene.add(coin);
        this.coins.push(coin);
    }

    spawnPowerUp() {
        const lane = Math.floor(Math.random() * 3) - 1;
        const types = ['shield', 'speed', 'magnet', 'double'];
        const type = types[Math.floor(Math.random() * types.length)];

        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        let color;

        switch (type) {
            case 'shield': color = 0x0088ff; break;
            case 'speed': color = 0xff00ff; break;
            case 'magnet': color = 0x00ff88; break;
            case 'double': color = 0xffff00; break;
        }

        const material = new THREE.MeshPhongMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.5
        });
        const powerUp = new THREE.Mesh(geometry, material);
        powerUp.position.set(lane * 2, 0.5, -30);
        powerUp.userData.type = type;

        this.scene.add(powerUp);
        this.powerUpObjects.push(powerUp);
    }

    moveLeft() {
        if (this.playerLane > 0) {
            this.playerLane--;
        }
    }

    moveRight() {
        if (this.playerLane < 2) {
            this.playerLane++;
        }
    }

    stopMove() {
        // For mobile controls
    }

    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.jumpVelocity = 0.2;
        }
    }

    activatePowerUp(type) {
        const duration = 10000; // 10 seconds
        this.activePowerUps[type] = Date.now() + duration;

        this.updatePowerUpDisplay();
        this.showNotification(`Power-up: ${type.toUpperCase()} activated!`);
    }

    updatePowerUpDisplay() {
        const display = document.getElementById('powerUpsDisplay');
        display.innerHTML = '';

        for (const [type, endTime] of Object.entries(this.activePowerUps)) {
            if (Date.now() < endTime) {
                const remaining = Math.ceil((endTime - Date.now()) / 1000);
                const indicator = document.createElement('div');
                indicator.className = 'power-up-indicator';

                let emoji;
                switch (type) {
                    case 'shield': emoji = '🛡️'; break;
                    case 'speed': emoji = '⚡'; break;
                    case 'magnet': emoji = '🧲'; break;
                    case 'double': emoji = '✖️2'; break;
                }

                indicator.innerHTML = `<span>${emoji}</span><span>${remaining}s</span>`;
                display.appendChild(indicator);
            } else {
                delete this.activePowerUps[type];
            }
        }
    }

    checkCollisions() {
        const playerPos = this.player.position;
        const playerLaneX = (this.playerLane - 1) * 2;

        // Check obstacle collisions
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            const distance = playerPos.distanceTo(obstacle.position);

            if (distance < 1.2 && Math.abs(playerPos.y - obstacle.position.y) < 0.5) {
                if (this.activePowerUps.shield) {
                    // Shield protects
                    delete this.activePowerUps.shield;
                    this.updatePowerUpDisplay();
                    this.showNotification('Shield absorbed hit!');
                } else {
                    // Take damage
                    this.lives--;
                    this.showNotification('Hit! Lives: ' + this.lives);

                    if (this.lives <= 0) {
                        this.gameOver();
                    }
                }

                this.scene.remove(obstacle);
                this.obstacles.splice(i, 1);
            }
        }

        // Check coin collisions
        for (let i = this.coins.length - 1; i >= 0; i--) {
            const coin = this.coins[i];
            let distance = playerPos.distanceTo(coin.position);

            // Magnet effect
            if (this.activePowerUps.magnet && distance < 5) {
                const dir = playerPos.clone().sub(coin.position).normalize();
                coin.position.add(dir.multiplyScalar(0.3));
            }

            if (distance < 1) {
                const coinValue = this.activePowerUps.double ? 2 : 1;
                if (this.isPremium) {
                    this.currentCoins += coinValue * 2; // Premium doubles coins
                } else {
                    this.currentCoins += coinValue;
                }
                this.updateUI();

                this.scene.remove(coin);
                this.coins.splice(i, 1);
            }
        }

        // Check power-up collisions
        for (let i = this.powerUpObjects.length - 1; i >= 0; i--) {
            const powerUp = this.powerUpObjects[i];
            const distance = playerPos.distanceTo(powerUp.position);

            if (distance < 1) {
                this.activatePowerUp(powerUp.userData.type);
                this.scene.remove(powerUp);
                this.powerUpObjects.splice(i, 1);
            }
        }
    }

    updateGame() {
        if (this.gameState !== 'playing') return;

        const currentTime = Date.now();
        const deltaTime = (currentTime - this.lastTime) / 16; // Normalize to ~60fps
        this.lastTime = currentTime;

        // Update score and speed
        this.distance += this.speed * deltaTime;
        this.score = Math.floor(this.distance * 10);
        this.speed = this.baseSpeed + Math.floor(this.distance / 100) * 0.01;

        // Move player to target lane
        const targetX = (this.playerLane - 1) * 2;
        this.player.position.x += (targetX - this.player.position.x) * 0.2 * this.settings.sensitivity;

        // Handle jumping
        if (this.isJumping) {
            this.player.position.y += this.jumpVelocity * deltaTime;
            this.jumpVelocity -= 0.015 * deltaTime;

            if (this.player.position.y <= 0) {
                this.player.position.y = 0;
                this.isJumping = false;
                this.jumpVelocity = 0;
            }
        }

        // Rotate player wheels
        this.player.children.forEach((child, index) => {
            if (index >= 2) { // Wheels
                child.rotation.x += this.speed * 2;
            }
        });

        // Speed boost effect
        const speedMultiplier = this.activePowerUps.speed ? 2 : 1;
        const effectiveSpeed = this.speed * speedMultiplier * deltaTime;

        // Move obstacles
        this.obstacles.forEach(obstacle => {
            obstacle.position.z += effectiveSpeed;
            if (obstacle.position.z > 5) {
                this.scene.remove(obstacle);
                this.obstacles.splice(this.obstacles.indexOf(obstacle), 1);
            }
        });

        // Move coins
        this.coins.forEach(coin => {
            coin.position.z += effectiveSpeed;
            coin.rotation.y += 0.05 * deltaTime;
            if (coin.position.z > 5) {
                this.scene.remove(coin);
                this.coins.splice(this.coins.indexOf(coin), 1);
            }
        });

        // Move power-ups
        this.powerUpObjects.forEach(powerUp => {
            powerUp.position.z += effectiveSpeed;
            powerUp.rotation.y += 0.05 * deltaTime;
            if (powerUp.position.z > 5) {
                this.scene.remove(powerUp);
                this.powerUpObjects.splice(this.powerUpObjects.indexOf(powerUp), 1);
            }
        });

        // Move road
        this.road.forEach(segment => {
            segment.position.z += effectiveSpeed;
            if (segment.position.z > 10) {
                segment.position.z -= 100;
            }
        });

        // Spawn new objects
        if (Math.random() < 0.01) {
            this.spawnObstacle();
        }
        if (Math.random() < 0.03) {
            this.spawnCoin();
        }
        if (Math.random() < 0.005) {
            this.spawnPowerUp();
        }

        // Check collisions
        this.checkCollisions();

        // Update power-ups
        this.updatePowerUpDisplay();

        // Update UI
        document.getElementById('score').textContent = this.score;
        document.getElementById('coins').textContent = this.currentCoins;
        document.getElementById('speed').textContent = Math.floor(this.speed * 100);
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        this.updateGame();

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    // UI Functions
    showScreen(screenId) {
        document.querySelectorAll('.screen, .overlay').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.currentCoins = 0;
        this.speed = this.baseSpeed;
        this.distance = 0;
        this.lives = 3;
        this.playerLane = 1;
        this.activePowerUps = {};

        // Clear objects
        this.obstacles.forEach(obj => this.scene.remove(obj));
        this.coins.forEach(obj => this.scene.remove(obj));
        this.powerUpObjects.forEach(obj => this.scene.remove(obj));
        this.obstacles = [];
        this.coins = [];
        this.powerUpObjects = [];

        if (!this.scene) {
            this.setupThreeJS();
        }

        this.showScreen('gameScreen');
        this.lastTime = Date.now();
    }

    pauseGame() {
        this.gameState = 'paused';
        document.getElementById('pauseMenu').classList.add('active');
    }

    resumeGame() {
        this.gameState = 'playing';
        document.getElementById('pauseMenu').classList.remove('active');
        this.lastTime = Date.now();
    }

    restartGame() {
        document.getElementById('pauseMenu').classList.remove('active');
        document.getElementById('gameOverScreen').classList.remove('active');
        this.startGame();
    }

    backToMenu() {
        this.gameState = 'menu';
        document.getElementById('pauseMenu').classList.remove('active');
        document.getElementById('gameOverScreen').classList.remove('active');
        this.showScreen('mainMenu');
    }

    gameOver() {
        this.gameState = 'gameover';

        // Update stats
        this.totalCoins += this.currentCoins;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.showNotification('New High Score!');
        }

        this.saveProgress();
        this.updateUI();

        // Show game over screen
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('coinsEarned').textContent = this.currentCoins;
        document.getElementById('finalHighScore').textContent = this.highScore;
        document.getElementById('gameOverScreen').classList.add('active');
    }

    // Shop Functions
    showShop() {
        this.showScreen('mainMenu');
        document.getElementById('shopScreen').classList.add('active');
        this.updateShopUI();
    }

    closeShop() {
        document.getElementById('shopScreen').classList.remove('active');
    }

    showShopTab(tabName) {
        document.querySelectorAll('.shop-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        event.target.classList.add('active');
    }

    updateShopUI() {
        // Update owned items display
        // This would be more complex in a real implementation
    }

    buyItem(itemId, cost) {
        if (this.totalCoins >= cost) {
            this.totalCoins -= cost;

            if (itemId.startsWith('car_')) {
                this.ownedCars.push(itemId);
                this.currentCar = itemId;
            }

            this.saveProgress();
            this.updateUI();
            this.showNotification(`Purchased ${itemId}!`);
        } else {
            this.showNotification('Not enough coins!');
        }
    }

    buyPowerUp(type, cost) {
        if (this.totalCoins >= cost) {
            this.totalCoins -= cost;

            if (!this.ownedPowerUps[type]) {
                this.ownedPowerUps[type] = 0;
            }
            this.ownedPowerUps[type]++;

            this.saveProgress();
            this.updateUI();
            this.showNotification(`Purchased ${type} power-up!`);
        } else {
            this.showNotification('Not enough coins!');
        }
    }

    purchaseCoins(amount, price) {
        // In a real implementation, this would integrate with payment provider
        this.showNotification(`Payment integration required: $${price} for ${amount} coins`);

        // For demo purposes, just add the coins
        this.totalCoins += amount;
        this.saveProgress();
        this.updateUI();
    }

    // Premium Functions
    showPremium() {
        this.showScreen('mainMenu');
        document.getElementById('premiumScreen').classList.add('active');
    }

    closePremium() {
        document.getElementById('premiumScreen').classList.remove('active');
    }

    purchasePremium() {
        // In a real implementation, this would integrate with payment provider
        this.showNotification('Payment integration required: $4.99 for Premium');

        // For demo purposes
        this.isPremium = true;
        this.saveProgress();
        this.closePremium();
        this.showNotification('Premium activated! Enjoy your benefits!');
    }

    // Ad Functions
    watchAd() {
        // In a real implementation, this would show an actual ad
        this.showNotification('Ad played! +50 coins');
        this.totalCoins += 50;
        this.saveProgress();
        this.updateUI();
    }

    watchAdRevive() {
        // In a real implementation, this would show an actual ad
        this.showNotification('Ad played! Reviving...');
        document.getElementById('gameOverScreen').classList.remove('active');
        this.lives = 1;
        this.gameState = 'playing';
        this.lastTime = Date.now();
    }

    // Settings Functions
    showSettings() {
        this.showScreen('mainMenu');
        document.getElementById('settingsScreen').classList.add('active');
    }

    closeSettings() {
        document.getElementById('settingsScreen').classList.remove('active');
    }

    toggleSFX() {
        this.settings.sfx = document.getElementById('sfxToggle').checked;
    }

    toggleMusic() {
        this.settings.music = document.getElementById('musicToggle').checked;
    }

    changeQuality() {
        this.settings.quality = document.getElementById('qualitySelect').value;
        // Would adjust renderer settings in real implementation
    }

    changeSensitivity() {
        this.settings.sensitivity = parseFloat(document.getElementById('sensitivitySlider').value);
    }

    resetProgress() {
        if (confirm('Are you sure you want to reset all progress?')) {
            localStorage.clear();
            this.totalCoins = 0;
            this.highScore = 0;
            this.isPremium = false;
            this.ownedCars = ['car_classic'];
            this.currentCar = 'car_classic';
            this.ownedPowerUps = {};
            this.updateUI();
            this.showNotification('Progress reset!');
        }
    }

    // Utility Functions
    updateUI() {
        document.getElementById('totalCoins').textContent = this.totalCoins;
        document.getElementById('highScore').textContent = this.highScore;
    }

    showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    saveProgress() {
        localStorage.setItem('totalCoins', this.totalCoins);
        localStorage.setItem('highScore', this.highScore);
        localStorage.setItem('isPremium', this.isPremium);
        localStorage.setItem('ownedCars', JSON.stringify(this.ownedCars));
        localStorage.setItem('currentCar', this.currentCar);
        localStorage.setItem('ownedPowerUps', JSON.stringify(this.ownedPowerUps));
    }

    loadProgress(key) {
        const value = localStorage.getItem(key);
        if (value === null) return null;

        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    }
}

// Initialize game
const game = new AutoRush();
