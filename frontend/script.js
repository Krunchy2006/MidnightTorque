// Products Data
const products = [
    { id: 1, name: 'Carbon Fiber Helmet', price: 6999, desc: 'Lightweight, aerodynamic, DOT certified', img: 'https://i.pinimg.com/1200x/26/d3/54/26d35452f486f46255f72ce83995fe84.jpg' },
    { id: 2, name: 'LED Headlight Upgrade Kit', price: 3499, desc: 'High-beam night riding visibility', img: 'https://i.pinimg.com/736x/52/30/78/52307855cce33da0350cb533f12e4f0c.jpg' },
    { id: 3, name: 'Riding Gloves (Armored)', price: 1899, desc: 'Knuckle protection, breathable material', img: 'https://i.pinimg.com/1200x/c7/22/8e/c7228e2f353f846f70eafc7108b16c3b.jpg' },
    { id: 4, name: 'Performance Exhaust (Slip-On)', price: 12999, desc: 'Enhanced sound and power output', img: 'https://i.pinimg.com/1200x/01/ff/86/01ff8602a0d453810addc29f5b1b2535.jpg' },
    { id: 5, name: 'Mobile Holder with USB Charger', price: 1499, desc: 'Waterproof, vibration resistant', img: 'https://i.pinimg.com/1200x/b8/75/e5/b875e5722821407406d60e8e73046514.jpg' },
    { id: 6, name: 'Frame Sliders', price: 2199, desc: 'Crash protection for bike body', img: 'https://i.pinimg.com/736x/26/61/0a/26610aa7e596cd6f499aeae6a6fc512e.jpg' },
    { id: 7, name: 'Tank Grip Pads', price: 999, desc: 'Improved cornering grip', img: 'https://i.pinimg.com/1200x/08/e6/01/08e601a6d5dc58a10193a4f53fa0614b.jpg' },
    { id: 8, name: 'Riding Jacket (All-Weather)', price: 5999, desc: 'CE certified armor protection', img: 'https://i.pinimg.com/736x/d0/16/41/d016411474e10819d202dc19f245f5ce.jpg' },
    { id: 9, name: 'Rear View Racing Mirrors', price: 1299, desc: 'Wide angle, anti-glare design', img: 'https://i.pinimg.com/736x/d0/3e/31/d03e31e09b59723d7f6b8606c9e58923.jpg' }
];

// Cart storage
let cart = [];

// Initialize page
window.onload = function() {
    loadProducts();
    initializeRating();
    updateCartCount();
};

// Navigation
function showPage(pageName) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    document.getElementById(pageName).classList.add('active');
    
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => btn.classList.remove('active'));
    
    if(event && event.target) {
        event.target.classList.add('active');
    }

    if (pageName === 'cart') {
        renderCart();
    }
}

// Load Products
function loadProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.img}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">₹${product.price.toLocaleString()}</p>
                <p class="product-desc">${product.desc}</p>
                <button class="btn-add-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        showToast('Item already in cart!');
        return;
    }
    
    cart.push({...product});
    updateCartCount();
    showToast('Added to cart successfully!');
}

// Update Cart Count
function updateCartCount() {
    document.getElementById('cartCount').textContent = cart.length;
}

// Render Cart
function renderCart() {
    const cartContent = document.getElementById('cartContent');
    
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started!</p>
                <button class="btn-primary" onclick="showPage('products')" style="max-width: 300px; margin: 2rem auto;">Shop Now</button>
            </div>
        `;
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    let discount = 0;
    if (subtotal > 1000) discount = subtotal * 0.10;
    const total = subtotal - discount;

    cartContent.innerHTML = `
        <div class="cart-container">
            <div class="cart-items">
                <h3 style="color: #c084fc; margin-bottom: 1.5rem;">Cart Items (${cart.length})</h3>
                ${cart.map((item, index) => `
                    <div class="cart-item">
                        <img src="${item.img}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
                        </div>
                        <button class="btn-remove" onclick="removeFromCart(${index})">Remove</button>
                    </div>
                `).join('')}
            </div>
            <div class="cart-summary">
                <h3>Order Summary</h3>
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>₹${subtotal.toLocaleString()}</span>
                </div>
                ${discount > 0 ? `
                    <div class="summary-row">
                        <span>Discount (10%): <span class="discount-badge">AUTO APPLIED</span></span>
                        <span style="color: #10b981;">-₹${discount.toLocaleString()}</span>
                    </div>
                ` : ''}
                <div class="summary-row total">
                    <span>Total:</span>
                    <span>₹${total.toLocaleString()}</span>
                </div>
                <button class="btn-primary" onclick="showCheckoutForm()" style="margin-top: 1.5rem;">Proceed to Checkout</button>
            </div>
        </div>
    `;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    renderCart();
    showToast('Item removed from cart');
}

function showCheckoutForm() {
    const cartContent = document.getElementById('cartContent');
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const discount = subtotal > 1000 ? subtotal * 0.10 : 0;
    const total = subtotal - discount;

    cartContent.innerHTML = `
        <div class="form-container">
            <h3>Checkout - Delivery Information</h3>
            <form id="checkoutForm" onsubmit="submitCheckout(event)">
                <div class="form-group">
                    <label>Full Name *</label>
                    <input type="text" id="checkoutName" required>
                    <span class="error-msg" id="checkoutNameError"></span>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Email *</label>
                        <input type="email" id="checkoutEmail" required>
                        <span class="error-msg" id="checkoutEmailError"></span>
                    </div>
                    <div class="form-group">
                        <label>Phone (10 digits) *</label>
                        <input type="tel" id="checkoutPhone" required>
                        <span class="error-msg" id="checkoutPhoneError"></span>
                    </div>
                </div>
                <div class="form-group">
                    <label>Address Line 1 *</label>
                    <input type="text" id="checkoutAddress1" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>City *</label>
                        <input type="text" id="checkoutCity" required>
                    </div>
                    <div class="form-group">
                        <label>PIN Code (6 digits) *</label>
                        <input type="text" id="checkoutPincode" required>
                        <span class="error-msg" id="checkoutPincodeError"></span>
                    </div>
                </div>
                <button type="submit" class="btn-primary">Place Order</button>
                <button type="button" class="btn-secondary" onclick="renderCart()">Back to Cart</button>
            </form>
        </div>
    `;
}

function submitCheckout(event) {
    event.preventDefault();
    clearErrors('checkout');

    const name = document.getElementById('checkoutName').value.trim();
    const email = document.getElementById('checkoutEmail').value.trim();
    const phone = document.getElementById('checkoutPhone').value.trim();
    const pincode = document.getElementById('checkoutPincode').value.trim();

    let isValid = true;
    if (!email.includes('@')) { showError('checkoutEmailError', 'Valid email required'); isValid = false; }
    if (!/^\d{10}$/.test(phone)) { showError('checkoutPhoneError', 'Phone must be 10 digits'); isValid = false; }
    if (!/^\d{6}$/.test(pincode)) { showError('checkoutPincodeError', 'PIN must be 6 digits'); isValid = false; }

    if (!isValid) return;

    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const discount = subtotal > 1000 ? subtotal * 0.10 : 0;

    sendToBackend({
        type: 'ORDER',
        customerInfo: { 
            name, 
            email, 
            phone,
            address: {
                line1: document.getElementById('checkoutAddress1').value,
                city: document.getElementById('checkoutCity').value,
                pincode: pincode,
                state: "Karnataka", // Example default
                country: "India"
            }
        },
        items: cart.map(i => ({ name: i.name, price: i.price })),
        subtotal: subtotal,
        discount: discount,
        total: subtotal - discount,
        timestamp: new Date().toLocaleString()
    });

    cart = [];
    updateCartCount();
    setTimeout(() => showPage('home'), 2000);
}

function submitContact(event) {
    event.preventDefault();
    clearErrors('contact');
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const phone = document.getElementById('contactPhone').value;
    const message = document.getElementById('contactMessage').value;

    if (!/^\d{10}$/.test(phone)) { showError('contactPhoneError', '10 digits required'); return; }

    sendToBackend({ type: 'CONTACT', name, email, phone, message, timestamp: new Date().toLocaleString() });
    document.getElementById('contactForm').reset();
}

function submitFeedback(event) {
    event.preventDefault();
    clearErrors('feedback');
    const name = document.getElementById('feedbackName').value;
    const email = document.getElementById('feedbackEmail').value;
    const rating = document.getElementById('feedbackRating').value;
    const message = document.getElementById('feedbackMessage').value;

    if (!email.endsWith('@gmail.com')) { showError('feedbackEmailError', 'Use @gmail.com only'); return; }

    sendToBackend({ type: 'FEEDBACK', name, email, rating, message, timestamp: new Date().toLocaleString() });
    document.getElementById('feedbackForm').reset();
    initializeRating();
}

// Rating System
function initializeRating() {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < 5) star.classList.add('active');
        else star.classList.remove('active');
    });
}

function setRating(rating) {
    document.getElementById('feedbackRating').value = rating;
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) star.classList.add('active');
        else star.classList.remove('active');
    });
}

function showError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) el.textContent = message;
}

function clearErrors(formType) {
    const errorElements = document.querySelectorAll('.error-msg');
    errorElements.forEach(el => el.textContent = '');
}

function showToast(message) {
    const toast = document.getElementById('successToast');
    document.getElementById('toastMessage').textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function sendToBackend(data) {
    fetch('http://localhost:3000/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(result => showToast(result.success ? 'Success!' : 'Error: ' + result.message))
    .catch(err => {
        console.error(err);
        showToast('Server connection failed');
    });
}