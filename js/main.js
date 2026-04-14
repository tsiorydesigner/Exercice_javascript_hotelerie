// Redirection automatique vers HTTPS (SSL)
const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' || 
                    window.location.hostname.startsWith('192.168.');

if (window.location.protocol === 'http:' && !isLocalhost) {
    window.location.href = window.location.href.replace('http:', 'https:');
}

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ==================== NAVIGATION ====================
function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('active');
    document.getElementById('hamburger').classList.toggle('active');
}

function scrollToMenu() {
    document.getElementById('menu').scrollIntoView({
        behavior: 'smooth'
    });
}

// ==================== LOGIQUE PANIER ====================
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
    const modal = document.getElementById('cartModal');
    const overlay = document.getElementById('cartOverlay');
    const isActive = modal.classList.toggle('hidden');
    overlay.classList.toggle('hidden');
    
    if (!isActive) {
        updateCartUI();
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function updateCartUI() {
    const list = document.getElementById('cartItemsList');
    const totalDisplay = document.getElementById('cartTotalDisplay');
    if (!list) return;

    list.textContent = ''; // Sécurité : on vide proprement sans innerHTML

    if (cart.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'cart-empty';
        empty.textContent = 'Votre panier est vide';
        list.appendChild(empty);
        totalDisplay.textContent = '0 Ar';
        return;
    }

    let total = 0;
    cart.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'cart-item';
        
        const info = document.createElement('div');
        info.className = 'cart-item-info';
        info.textContent = `${item.name} - ${item.price.toLocaleString()} Ar (x${item.quantity})`;
        
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '×';
        removeBtn.onclick = () => removeFromCart(index);
        
        row.appendChild(info);
        row.appendChild(removeBtn);
        list.appendChild(row);
        total += item.price * item.quantity;
    });

    totalDisplay.textContent = `${total.toLocaleString()} Ar`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartUI();
}

// ==================== PAIEMENT ET MODALES ====================
function checkout() {
    if (cart.length === 0) return;
    toggleCart();
    document.getElementById('paymentModal').classList.add('active');
}

function processPayment(operator) {
    const codes = { 'mvola': '*444#', 'orange': '#150#', 'airtel': '*200#' };
    document.getElementById('paymentModal').classList.remove('active');
    document.getElementById('ussdModal').classList.add('active');
    document.getElementById('ussdOperator').textContent = operator.toUpperCase();
    document.getElementById('ussdCode').textContent = codes[operator];
}

function confirmFinalPayment() {
    document.getElementById('ussdModal').classList.remove('active');
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert("Paiement reçu ! Votre commande est en préparation.");
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// ==================== NOTIFICATIONS ====================
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

// ==================== GESTION DES FILTRES (MENU) ====================
let currentCategory = 'all';
let currentMaxPrice = 25000;

function resetFilters() {
    currentCategory = 'all';
    currentMaxPrice = 25000;
    
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(b => b.classList.remove('active'));
    const allBtn = document.querySelector('.filter-btn[onclick*="all"]');
    if (allBtn) allBtn.classList.add('active');
    
    const rangeInput = document.getElementById('priceRange');
    const priceVal = document.getElementById('priceValue');
    if (rangeInput) rangeInput.value = 25000;
    if (priceVal) priceVal.textContent = '25 000';
    
    applyFilters();
}

function filterMenu(category, btn) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    
    currentCategory = category;
    applyFilters();
}

function updatePrice(value) {
    currentMaxPrice = parseInt(value);
    const priceVal = document.getElementById('priceValue');
    if (priceVal) priceVal.textContent = currentMaxPrice.toLocaleString();
    applyFilters();
}

function applyFilters() {
    const cards = document.querySelectorAll('.menu-card');
    cards.forEach(card => {
        const priceEl = card.querySelector('.menu-card-price');
        if (!priceEl) return;
        
        const priceText = priceEl.innerText;
        const price = parseInt(priceText.replace(/[^0-9]/g, ''));
        const category = card.dataset.category;

        const categoryMatch = (currentCategory === 'all' && category !== 'boisson') || category === currentCategory;
        const priceMatch = price <= currentMaxPrice;

        if (categoryMatch && priceMatch) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
}

// ==================== FORMULAIRES ET INTERACTIONS ====================
function submitContact(event) {
    event.preventDefault();
    const btn = event.target.querySelector('.btn-primary');
    const originalText = btn.textContent;
    btn.textContent = 'Envoi en cours...';
    btn.disabled = true;

    setTimeout(() => {
        alert('Votre message a été envoyé! Nous vous répondrons dans les plus brefs délais.');
        event.target.reset();
        btn.textContent = originalText;
        btn.disabled = false;
    }, 1000);
}

function submitReservation(event) {
    event.preventDefault();
    alert('Votre demande de réservation a été envoyée !');
    event.target.reset();
}

// ==================== INITIALISATION GLOBALE ====================
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Initialiser les filtres si on est sur la page menu
    if (document.querySelector('.menu-grid')) {
        applyFilters();
    }

    // Gestion des modes de paiement (Réservation)
    const paymentRadios = document.querySelectorAll('input[name="payment_method"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.querySelectorAll('.payment-card').forEach(card => {
                card.style.borderColor = 'var(--border)';
                card.style.background = 'transparent';
                card.style.transform = 'scale(1)';
            });
            if (e.target.checked) {
                const card = e.target.nextElementSibling;
                card.style.borderColor = 'var(--primary)';
                card.style.background = 'rgba(201, 162, 39, 0.05)';
                card.style.transform = 'scale(1.02)';
            }
        });
    });
});

// Données des desserts - Les IDs correspondent aux noms des fichiers dans /image/dessert/
const dessertItems = [
    { name: 'Fondant au Chocolat', price: 15000, id: 'fondant-chocolat' },
    { name: 'Mousse au Chocolat noir', price: 12000, id: 'mousse-chocolat' },
    { name: 'Crème Brûlée Vanille', price: 14000, id: 'creme-brulee' },
    { name: 'Tarte au Citron Meringuée', price: 13000, id: 'tarte-citron' },
    { name: 'Salade de Fruits frais', price: 10000, id: 'salade-fruits' },
    { name: 'Cheesecake aux Fruits rouges', price: 16000, id: 'cheesecake' },
];

// Données des boissons - Les IDs correspondent aux noms des fichiers dans /image/boisson/
const boissonItems = [];

/**
 * Initialise la section des desserts dans la page menu.
 * Utilise l'ID (nom du fichier image) comme classe CSS pour chaque carte.
 */
function loadDessertMenu() {
    const dessertGrid = document.getElementById('dessert-grid');
    if (!dessertGrid) return;

    dessertGrid.innerHTML = dessertItems.map(item => `
        <div class="menu-card dessert ${item.id}">
            <img src="image/dessert/${item.id}.jpg" alt="${item.name}" class="menu-img">
            <div class="menu-card-content">
                <h3>${item.name}</h3>
                <p class="price">${item.price.toLocaleString()} Ar</p>
                <button class="btn-order" onclick="addToCart('${item.name}', ${item.price})">
                    Commander
                </button>
            </div>
        </div>
    `).join('');
}

updateCartCount();
loadDessertMenu();
