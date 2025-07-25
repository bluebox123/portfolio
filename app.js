// Initialize EmailJS
(function() {
    emailjs.init("LIYjIfgfc4MPlJg48");
})();

// Enhanced Background Animation System
class EnhancedBackgroundAnimation {
    constructor() {
        this.container = document.querySelector('.floating-shapes');
        this.shapes = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.init();
    }

    init() {
        this.createShapes();
        this.addMouseInteraction();
        this.animate();
    }

    createShapes() {
        // Create additional dynamic shapes
        for (let i = 0; i < 3; i++) {
            this.createDynamicShape();
        }
    }

    createDynamicShape() {
        const shape = document.createElement('div');
        shape.className = 'shape dynamic-shape';
        
        const size = Math.random() * 60 + 20;
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        shape.style.width = size + 'px';
        shape.style.height = size + 'px';
        shape.style.left = x + 'px';
        shape.style.top = y + 'px';
        shape.style.animationDelay = Math.random() * 5 + 's';
        shape.style.animationDuration = (Math.random() * 10 + 8) + 's';
        
        this.container.appendChild(shape);
        this.shapes.push({
            element: shape,
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: size
        });
    }

    addMouseInteraction() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        // Add parallax effect to shapes based on mouse position
        document.addEventListener('mousemove', (e) => {
            const shapes = document.querySelectorAll('.shape');
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;

            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.1;
                const x = (mouseX - 0.5) * speed * 20;
                const y = (mouseY - 0.5) * speed * 20;
                
                shape.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }

    animate() {
        // Animate dynamic shapes
        this.shapes.forEach(shape => {
            shape.x += shape.vx;
            shape.y += shape.vy;
            
            // Bounce off edges
            if (shape.x < 0 || shape.x > window.innerWidth - shape.size) {
                shape.vx *= -1;
            }
            if (shape.y < 0 || shape.y > window.innerHeight - shape.size) {
                shape.vy *= -1;
            }
            
            shape.element.style.left = shape.x + 'px';
            shape.element.style.top = shape.y + 'px';
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Particle System
class ParticleSystem {
    constructor() {
        this.container = document.getElementById('particles');
        this.particles = [];
        this.init();
    }

    init() {
        for (let i = 0; i < 50; i++) {
            this.createParticle();
        }
        this.animate();
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 1;
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const duration = Math.random() * 3 + 3;
        
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';
        
        this.container.appendChild(particle);
        this.particles.push({
            element: particle,
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
        });
    }

    animate() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
            if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;
            
            particle.element.style.left = particle.x + 'px';
            particle.element.style.top = particle.y + 'px';
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Trigger specific animations
            if (entry.target.classList.contains('about-stats')) {
                animateCounters();
            }
            
            if (entry.target.classList.contains('skills-grid')) {
                animateSkillBars();
            }
        }
    });
}, observerOptions);

// Animate counters
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        updateCounter();
    });
}

// Animate skill bars
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-fill');
    
    skillBars.forEach((bar, index) => {
        const width = bar.getAttribute('data-width');
        setTimeout(() => {
            bar.style.setProperty('--width', width + '%');
        }, index * 100);
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Contact form handling
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.btn-submit');
    const successDiv = document.getElementById('contactSuccess');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            // Check if EmailJS is loaded
            if (typeof emailjs === 'undefined') {
                throw new Error('EmailJS library not loaded');
            }
            
            // Debug: Log form data
            const formData = new FormData(form);
            console.log('Form data check:');
            console.log('Name:', formData.get('name'));
            console.log('Email:', formData.get('email'));
            console.log('Title:', formData.get('title'));
            console.log('Message:', formData.get('message'));
            
            console.log('Attempting to send email...');
            console.log('Service ID:', "service_pyewugk");
            console.log('Template ID:', "template_6h9b1uk");
            console.log('Public Key:', "LIYjIfgfc4MPlJg48");
            
            // Method 1: Try sendForm first (simpler approach)
            try {
                const result = await emailjs.sendForm("service_pyewugk", "template_6h9b1uk", form, "LIYjIfgfc4MPlJg48");
                console.log('Email sent successfully with sendForm:', result);
                
                // Show success message
                form.style.display = 'none';
                successDiv.classList.remove('hidden');
                
                // Reset form after 5 seconds
                setTimeout(() => {
                    form.style.display = 'block';
                    successDiv.classList.add('hidden');
                    form.reset();
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }, 5000);
                
            } catch (sendFormError) {
                console.log('sendForm failed, trying send method...', sendFormError);
                
                // Method 2: Try send method with explicit parameters
                const templateParams = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    title: formData.get('title'),
                    message: formData.get('message')
                };
                
                console.log('Sending with explicit params:', templateParams);
                
                const result = await emailjs.send(
                    "service_pyewugk", 
                    "template_6h9b1uk", 
                    templateParams,
                    "LIYjIfgfc4MPlJg48"
                );
                
                console.log('Email sent successfully with send:', result);
                
                // Show success message
                form.style.display = 'none';
                successDiv.classList.remove('hidden');
                
                // Reset form after 5 seconds
                setTimeout(() => {
                    form.style.display = 'block';
                    successDiv.classList.add('hidden');
                    form.reset();
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }, 5000);
            }
            
        } catch (error) {
            console.error('Error sending email:', error);
            console.error('Error details:', {
                message: error.message,
                status: error.status,
                response: error.response,
                text: error.text
            });
            
            // More specific error handling
            if (error.status === 412) {
                alert('Configuration error: Please check EmailJS template variables. The template might expect different field names.');
            } else if (error.status === 400) {
                alert('Bad request: Please check your EmailJS service and template configuration.');
            } else {
                alert('Sorry, there was an error sending your message. Please try again or contact me directly via email.');
            }
            
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
}

// Alternative simplified contact form (uncomment if main one doesn't work)
/*
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.btn-submit');
    const successDiv = document.getElementById('contactSuccess');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(form);
            
            // Convert to plain object
            const params = {
                name: formData.get('name'),
                email: formData.get('email'),
                title: formData.get('title'),
                message: formData.get('message')
            };
            
            console.log('Sending email with params:', params);
            
            const result = await emailjs.send(
                "service_pyewugk",
                "template_6h9b1uk", 
                params,
                "LIYjIfgfc4MPlJg48"
            );
            
            console.log('Success:', result);
            form.style.display = 'none';
            successDiv.classList.remove('hidden');
            
            setTimeout(() => {
                form.style.display = 'block';
                successDiv.classList.add('hidden');
                form.reset();
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }, 5000);
            
        } catch (error) {
            console.error('Error:', error);
            alert('Error sending message. Please try again.');
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
}
*/

// Add form field animations
function initFormAnimations() {
    const formInputs = document.querySelectorAll('.form-input');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
}

// Navbar scroll effect
function initNavbarEffects() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(0, 0, 0, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(255, 215, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Add stagger animation delays
function addStaggerAnimations() {
    // Stagger timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.2}s`;
    });
    
    // Stagger project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.2}s`;
    });
    
    // Stagger achievement cards
    const achievementCards = document.querySelectorAll('.achievement-card');
    achievementCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.15}s`;
    });
    
    // Stagger skill categories
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach((category, index) => {
        category.style.transitionDelay = `${index * 0.1}s`;
    });
}

// Add ripple effect to buttons
function addRippleEffect() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        .btn {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
}

// Initialize typewriter effect
function initTypewriter() {
    const typewriterElement = document.querySelector('.typewriter');
    if (typewriterElement) {
        const text = typewriterElement.textContent;
        typewriterElement.textContent = '';
        typewriterElement.style.width = '0';
        
        setTimeout(() => {
            typewriterElement.style.width = 'auto';
            let i = 0;
            const typeInterval = setInterval(() => {
                typewriterElement.textContent += text.charAt(i);
                i++;
                if (i >= text.length) {
                    clearInterval(typeInterval);
                }
            }, 70);
        }, 500);
    }
}

// Test EmailJS configuration
function testEmailJSConfig() {
    console.log('=== EmailJS Configuration Test ===');
    console.log('EmailJS loaded:', typeof emailjs !== 'undefined');
    console.log('Service ID:', "service_pyewugk");
    console.log('Template ID:', "template_6h9b1uk");
    console.log('Public Key:', "LIYjIfgfc4MPlJg48");
    
    // Test with sample data
    const testParams = {
        name: "Test User",
        email: "test@example.com",
        title: "Test Subject",
        message: "This is a test message"
    };
    
    console.log('Test parameters:', testParams);
    
    // You can uncomment this to test the actual sending
    // emailjs.send("service_pyewugk", "template_6h9b1uk", testParams, "LIYjIfgfc4MPlJg48")
    //     .then(response => console.log('Test email sent:', response))
    //     .catch(error => console.error('Test email failed:', error));
}

// Debug EmailJS function - call this in browser console
window.debugEmailJS = async function() {
    console.log('🔍 Debugging EmailJS 412 error...');
    
    try {
        console.log('Testing with exact form data...');
        const result = await emailjs.send(
            "service_pyewugk",
            "template_6h9b1uk",
            {
                name: "Samarth",
                email: "samarthsaxena52@gmail.com",
                title: "Test Subject",
                message: "Test message"
            },
            "LIYjIfgfc4MPlJg48"
        );
        console.log('✅ EmailJS test successful:', result);
        alert('EmailJS is working! The issue is likely in your template variables.');
    } catch (error) {
        console.error('❌ EmailJS test failed:', error);
        console.error('Error details:', {
            status: error.status,
            message: error.message,
            text: error.text
        });
        alert('EmailJS test failed. Check your service/template configuration in the dashboard.');
    }
};

// Enhanced EmailJS testing and debugging functions
window.testEmailJS = function() {
    console.log('📧 Testing EmailJS...');
    debugEmailJS();
};

// Comprehensive EmailJS diagnostic function
window.diagnoseEmailJS = function() {
    console.log('🔧 EmailJS Diagnostic Report');
    console.log('============================');
    
    // Check if EmailJS is loaded
    console.log('1. EmailJS Library Status:');
    console.log('   - EmailJS loaded:', typeof emailjs !== 'undefined');
    console.log('   - EmailJS version:', emailjs ? emailjs.version : 'Not available');
    
    // Configuration check
    console.log('\n2. Configuration:');
    console.log('   - Service ID: service_pyewugk');
    console.log('   - Template ID: template_6h9b1uk');
    console.log('   - Public Key: LIYjIfgfc4MPlJg48');
    
    // Form field check
    console.log('\n3. Form Fields Check:');
    const form = document.getElementById('contactForm');
    if (form) {
        const formData = new FormData(form);
        console.log('   - name field:', formData.get('name') || 'Not found');
        console.log('   - email field:', formData.get('email') || 'Not found');
        console.log('   - title field:', formData.get('title') || 'Not found');
        console.log('   - message field:', formData.get('message') || 'Not found');
    } else {
        console.log('   - Contact form not found');
    }
    
    // Template variable suggestions
    console.log('\n4. Template Variable Check:');
    console.log('   ✅ Your form sends these EXACT variables:');
    console.log('      - {{name}}');
    console.log('      - {{email}}');
    console.log('      - {{title}}');
    console.log('      - {{message}}');
    console.log('\n   ❌ Common mistakes in EmailJS template:');
    console.log('      - {{subject}} (should be {{title}})');
    console.log('      - {{from_name}} (should be {{name}})');
    console.log('      - {{from_email}} (should be {{email}})');
    console.log('      - {{content}} (should be {{message}})');
    
    console.log('\n5. Next Steps:');
    console.log('   1. Go to EmailJS Dashboard');
    console.log('   2. Open template template_6h9b1uk');
    console.log('   3. Ensure it uses: {{name}}, {{email}}, {{title}}, {{message}}');
    console.log('   4. Make sure template is PUBLISHED');
    console.log('   5. Test the template in dashboard');
    console.log('   6. Run testEmailJS() after making changes');
};

// Quick template test with different variable names
window.testTemplateVariables = async function() {
    console.log('🧪 Testing different template variable combinations...');
    
    const testCases = [
        {
            name: 'Test with correct variables',
            params: { name: 'Test User', email: 'test@example.com', title: 'Test Subject', message: 'Test message' }
        },
        {
            name: 'Test with common wrong variables',
            params: { subject: 'Test Subject', from_name: 'Test User', from_email: 'test@example.com', content: 'Test message' }
        },
        {
            name: 'Test with mixed variables',
            params: { name: 'Test User', email: 'test@example.com', subject: 'Test Subject', message: 'Test message' }
        }
    ];
    
    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`\n${i + 1}. ${testCase.name}:`);
        console.log('   Variables:', testCase.params);
        
        try {
            const result = await emailjs.send(
                "service_pyewugk",
                "template_6h9b1uk",
                testCase.params,
                "LIYjIfgfc4MPlJg48"
            );
            console.log('   ✅ SUCCESS:', result);
        } catch (error) {
            console.log('   ❌ FAILED:', error.status, error.message);
        }
    }
};

// Add this to window for easy testing
window.testEmailJS = function() {
    console.log('📧 Testing EmailJS...');
    debugEmailJS();
};

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Test EmailJS configuration
    testEmailJSConfig();
    
    // Initialize particle system
    new ParticleSystem();

    // Initialize enhanced background animation
    new EnhancedBackgroundAnimation();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize contact form
    initContactForm();
    
    // Initialize form animations
    initFormAnimations();
    
    // Initialize navbar effects
    initNavbarEffects();
    
    // Add stagger animations
    addStaggerAnimations();
    
    // Add ripple effects
    addRippleEffect();
    
    // Initialize typewriter effect
    initTypewriter();
    
    // Set up intersection observers
    const elementsToObserve = [
        '.section-header',
        '.about-text',
        '.about-stats',
        '.timeline',
        '.projects-grid',
        '.skills-grid',
        '.achievements-grid',
        '.contact-info',
        '.contact-form-container'
    ];
    
    elementsToObserve.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            observer.observe(element);
        });
    });
    
    // Add active nav link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function highlightNavLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);
    
    // Add CSS for active nav link
    const activeNavStyle = document.createElement('style');
    activeNavStyle.textContent = `
        .nav-link.active {
            color: #FFD700 !important;
        }
        .nav-link.active::after {
            width: 100% !important;
        }
    `;
    document.head.appendChild(activeNavStyle);
});

// Handle window resize for particles
window.addEventListener('resize', () => {
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = Math.random() * window.innerHeight + 'px';
    });
});

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll events
const throttledScroll = throttle(() => {
    // Any scroll-based animations can be added here
}, 16); // ~60fps

window.addEventListener('scroll', throttledScroll);

// Add smooth entrance animation for page load
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Add CSS for loaded state
    const loadedStyle = document.createElement('style');
    loadedStyle.textContent = `
        body {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        body.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(loadedStyle);
});

// Add hover effects for project cards
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Add custom cursor effect (optional enhancement)
function addCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    const cursorStyle = document.createElement('style');
    cursorStyle.textContent = `
        .custom-cursor {
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, #FFD700, transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
            transform: translate(-50%, -50%);
        }
        
        @media (pointer: fine) {
            .custom-cursor {
                opacity: 0.7;
            }
        }
    `;
    document.head.appendChild(cursorStyle);
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
}