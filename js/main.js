 let cart = JSON.parse(localStorage.getItem('cart')) || [];

function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('active');
    document.getElementById('hamburger').classList.toggle('active');
   */document.getElementById('close').classList.toggle('active');*/
}

function scrollToMenu() {
    document.getElementById('menu').scrollIntoView({
        behavior: 'smooth'
    });
}



function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name: name, price: price, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(name);
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}

function toggleCart() {
    alert('Contenu du panier: ' + cart.map(item => `${item.name} x${item.quantity} - ${item.price * item.quantity} Ar`).join('\n') + '\n\nTotal: ' + cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + ' Ar');
}

function showNotification(name) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = `${name} ajouté au panier`;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

updateCartCount();

