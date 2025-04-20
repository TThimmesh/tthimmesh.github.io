// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar transparency effect on scroll
const navbar = document.querySelector('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('nav-scrolled');
    } else {
        navbar.classList.remove('nav-scrolled');
    }
});

// Typing animation for subtitle
const subtitle = document.querySelector('.subtitle');
const text = subtitle.textContent;
subtitle.textContent = '';
let i = 0;

function typeWriter() {
    if (i < text.length) {
        subtitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
    }
}

// Start typing animation when page loads
window.addEventListener('load', typeWriter);

// Fade-in animation for sections
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.classList.add('hidden');
    observer.observe(section);
});

// Project card hover effect
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Network constellation animation
const createConstellation = () => {
    const hero = document.querySelector('.hero');
    const canvas = document.createElement('canvas');
    canvas.className = 'constellation';
    hero.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let width, height;

    // Function to update canvas dimensions
    const updateDimensions = () => {
        const rect = hero.getBoundingClientRect();
        width = canvas.width = rect.width;
        height = canvas.height = rect.height;
        
        // Update configuration based on new dimensions
        config.position.x = width * 0.5;
        config.position.y = height * 0.5;
        config.mouse.x = width * 0.5;
        config.mouse.y = height * 0.5;
        
        // Adjust number of points based on screen size with higher density
        config.length = Math.floor((width * height) / 8000); // Reduced divisor for more points
        config.distance = Math.min(width, height) * 0.15; // Increased connection distance
    };

    // Configuration
    const config = {
        star: {
            color: 'rgba(96, 165, 250, 0.8)',
            width: 2.5 // Slightly smaller dots for more refined look
        },
        line: {
            color: 'rgba(96, 165, 250, 0.15)',
            width: 0.2
        },
        position: {
            x: 0,
            y: 0
        },
        mouse: {
            x: 0,
            y: 0,
            down: false
        },
        touches: [],
        velocity: 0.08, // Slightly slower movement
        length: 250,    // More points
        distance: 120,  // Longer connection distance
        radius: 150,
        points: []
    };

    class Point {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * config.velocity;
            this.vy = (Math.random() - 0.5) * config.velocity;
            this.radius = Math.random() * 1.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx = -this.vx;
            if (this.y < 0 || this.y > height) this.vy = -this.vy;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = config.star.color;
            ctx.fill();
            ctx.closePath();
        }
    }

    const initPoints = () => {
        for (let i = 0; i < config.length; i++) {
            config.points.push(new Point());
        }
    };

    const drawLines = (p) => {
        config.points.forEach(point => {
            const dist = Math.sqrt(Math.pow(p.x - point.x, 2) + Math.pow(p.y - point.y, 2));
            if (dist < config.distance) {
                ctx.beginPath();
                ctx.strokeStyle = config.line.color;
                ctx.lineWidth = config.line.width;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(point.x, point.y);
                ctx.stroke();
                ctx.closePath();
            }
        });
    };

    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        
        config.points.forEach(point => {
            point.update();
            point.draw();
            drawLines(point);
        });

        // Draw lines to mouse/touch position
        const mousePoint = { x: config.mouse.x, y: config.mouse.y };
        drawLines(mousePoint);
        
        requestAnimationFrame(animate);
    };

    // Update mouse position relative to hero section
    const handleMouseMove = (e) => {
        const rect = hero.getBoundingClientRect();
        config.mouse.x = e.clientX - rect.left;
        config.mouse.y = e.clientY - rect.top;
    };

    // Initialize dimensions
    updateDimensions();

    // Event listeners
    window.addEventListener('resize', () => {
        updateDimensions();
        config.points = [];
        initPoints();
    });
    
    hero.addEventListener('mousemove', handleMouseMove);

    // Initialize
    initPoints();
    animate();
};

// Add this function to create floating dots in the about section
const createBackgroundDots = () => {
    const about = document.querySelector('.about');
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'background-dots';
    about.appendChild(dotsContainer);

    const createDot = () => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        
        // Random position and animation
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = 15 + Math.random() * 15;
        const delay = Math.random() * -20;
        
        dot.style.left = `${x}%`;
        dot.style.top = `${y}%`;
        dot.style.animation = `float ${duration}s ${delay}s infinite linear`;
        
        dotsContainer.appendChild(dot);
    };

    // Create multiple dots
    for (let i = 0; i < 50; i++) {
        createDot();
    }
};

// Update the cursor trail function
const createCursorTrail = () => {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    document.body.appendChild(trail);

    document.addEventListener('mousemove', (e) => {
        // Check if the mouse is over the hero section
        const heroSection = document.querySelector('.hero');
        const heroRect = heroSection.getBoundingClientRect();
        const isOverHero = e.clientY >= heroRect.top && 
                          e.clientY <= heroRect.bottom &&
                          e.clientX >= heroRect.left && 
                          e.clientX <= heroRect.right;

        // Only show the trail when not over hero section
        trail.style.opacity = isOverHero ? '0' : '0.6';
        trail.style.left = e.pageX + 'px';
        trail.style.top = e.pageY + 'px';
    });
};

// Update the load event listener
window.addEventListener('load', () => {
    createConstellation();
    createBackgroundDots();
    createCursorTrail();
    // ... rest of your existing load event handlers
});

// Add smooth parallax scrolling
const addParallaxEffect = () => {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
};

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
}); 