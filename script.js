const canvas = document.getElementById('bouncingBalls');
const ctx = canvas.getContext('2d');

// Définir la taille du canvas
canvas.width = 800;
canvas.height = 500;

// Classe pour les particules
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 6 - 3;
        this.lifetime = 1; // Durée de vie entre 0 et 1
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.lifetime -= 0.02;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.getRGBValues()}, ${this.lifetime})`;
        ctx.fill();
    }

    getRGBValues() {
        switch(this.color) {
            case 'red': return '255, 0, 0';
            case 'blue': return '0, 0, 255';
            case 'orange': return '255, 165, 0';
            case 'black': return '0, 0, 0';
            default: return '255, 255, 255';
        }
    }
}

// Tableau pour stocker les particules
let particles = [];

// Classe pour les balles
class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.mass = radius; // La masse est proportionnelle au rayon
        this.dx = (Math.random() - 0.5) * 8; // Vitesse horizontale
        this.dy = (Math.random() - 0.5) * 8; // Vitesse verticale
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    createCollisionParticles() {
        for(let i = 0; i < 8; i++) {
            particles.push(new Particle(this.x, this.y, this.color));
        }
    }

    update(balls) {
        // Rebond sur les bords horizontaux
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        
        // Rebond sur les bords verticaux
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        // Vérifier les collisions avec les autres balles
        balls.forEach(ball => {
            if (ball === this) return;

            const dx = ball.x - this.x;
            const dy = ball.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.radius + ball.radius) {
                // Effet de particules
                this.createCollisionParticles();
                ball.createCollisionParticles();

                const angle = Math.atan2(dy, dx);
                
                const thisNewDx = ((this.mass - ball.mass) * this.dx + 2 * ball.mass * ball.dx) / (this.mass + ball.mass);
                const thisNewDy = ((this.mass - ball.mass) * this.dy + 2 * ball.mass * ball.dy) / (this.mass + ball.mass);
                const ballNewDx = ((ball.mass - this.mass) * ball.dx + 2 * this.mass * this.dx) / (this.mass + ball.mass);
                const ballNewDy = ((ball.mass - this.mass) * ball.dy + 2 * this.mass * this.dy) / (this.mass + ball.mass);

                this.dx = thisNewDx;
                this.dy = thisNewDy;
                ball.dx = ballNewDx;
                ball.dy = ballNewDy;

                const overlap = (this.radius + ball.radius - distance) / 2;
                const moveX = overlap * Math.cos(angle);
                const moveY = overlap * Math.sin(angle);
                
                this.x -= moveX;
                this.y -= moveY;
                ball.x += moveX;
                ball.y += moveY;
            }
        });

        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }
}

// Créer les balles avec les couleurs spécifiées
const balls = [
    new Ball(100, 100, 20, 'red'),
    new Ball(200, 200, 20, 'blue'),
    new Ball(300, 300, 20, 'orange'),
    new Ball(400, 200, 20, 'black')
];

// Fonction d'animation
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Mettre à jour et dessiner les particules
    particles = particles.filter(particle => particle.lifetime > 0);
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Mettre à jour et dessiner les balles
    balls.forEach(ball => {
        ball.update(balls);
    });

    requestAnimationFrame(animate);
}

// Démarrer l'animation
animate(); 