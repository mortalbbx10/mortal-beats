document.addEventListener('DOMContentLoaded', function() {
    // Clear old localStorage data to fix cart issues
    if (localStorage.getItem('beatMarketCart')) {
        localStorage.removeItem('beatMarketCart');
    }
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Shopping Cart Functionality
    const cartCount = document.querySelector('.cart-count');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    // Initialize cart from localStorage or create empty cart
    let cart = JSON.parse(localStorage.getItem('mortalBeatsCart')) || [];
    updateCartCount();
    
    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const beatId = this.getAttribute('data-id');
            const beatCard = this.closest('.beat-card');
            const beatName = beatCard.querySelector('h3').textContent;
            const beatProducer = beatCard.querySelector('.producer').textContent.replace('By ', '');
            const beatPrice = beatCard.querySelector('.price').textContent;
            const beatImage = beatCard.querySelector('img').getAttribute('src');
            
            // Check if item is already in cart
            const existingItem = cart.find(item => item.id === beatId);
            
            if (existingItem) {
                showNotification('This beat is already in your cart!', 'info');
            } else {
                // Add item to cart
                cart.push({
                    id: beatId,
                    name: beatName,
                    producer: beatProducer,
                    price: beatPrice,
                    image: beatImage,
                    quantity: 1
                });
                
                // Save cart to localStorage
                localStorage.setItem('mortalBeatsCart', JSON.stringify(cart));
                
                // Update cart count
                updateCartCount();
                
                // Show notification
                showNotification('Beat added to cart!', 'success');
                
                // Animate cart icon
                animateCartIcon();
            }
        });
    });
    
    // Update cart count function
    function updateCartCount() {
        if (cartCount) {
            cartCount.textContent = cart.length;
        }
    }
    
    // Notification function
    function showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                <p>${message}</p>
            </div>
        `;
        
        // Add notification to DOM
        document.body.appendChild(notification);
        
        // Add active class after a small delay (for animation)
        setTimeout(() => {
            notification.classList.add('active');
        }, 10);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('active');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Animate cart icon
    function animateCartIcon() {
        const cartIcon = document.querySelector('.cart-icon');
        cartIcon.classList.add('bounce');
        
        setTimeout(() => {
            cartIcon.classList.remove('bounce');
        }, 1000);
    }
    
    // Add CSS for notifications and animations
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: white;
            border-radius: 5px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
            padding: 15px 20px;
            z-index: 1000;
            transform: translateX(120%);
            transition: transform 0.3s ease;
        }
        
        .notification.active {
            transform: translateX(0);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
        }
        
        .notification i {
            margin-right: 10px;
            font-size: 1.2rem;
        }
        
        .notification.success i {
            color: #28a745;
        }
        
        .notification.info i {
            color: #17a2b8;
        }
        
        .notification.error i {
            color: #dc3545;
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
            40% {transform: translateY(-10px);}
            60% {transform: translateY(-5px);}
        }
        
        .cart-icon.bounce {
            animation: bounce 1s;
        }
    `;
    
    document.head.appendChild(style);
});