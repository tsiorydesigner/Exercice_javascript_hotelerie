let cart = JSON.parse(localStorage.getItem('cart')) || [];

function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('active');
    document.getElementById('hamburger').classList.toggle('active');
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
    const existingModal = document.getElementById('cartModal');
    if (existingModal) {
        existingModal.remove();
        const overlay = document.getElementById('cartOverlay');
        if (overlay) overlay.remove();
        document.body.style.overflow = '';
        return;
    }
    renderCartModal();
}

function renderCartModal() {
    const modal = document.createElement('div');
    modal.id = 'cartModal';
    modal.className = 'cart-modal';

    modal.innerHTML = `
        <div class="cart-header">
            <h2>Votre Panier</h2>
            <button class="cart-close" onclick="closeCart()">&times;</button>
        </div>
        <div class="cart-items">
            ${cart.length === 0 ? `
                <div class="cart-empty">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <p>Votre panier est vide</p>
                    <a href="Menu.html" style="display: inline-block; margin-top: 1rem; color: var(--primary); text-decoration: none; font-weight: 600;">Voir le menu</a>
                </div>
            ` : cart.map((item, index) => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${item.price.toLocaleString()} Ar</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                        <span class="cart-item-qty">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${index})">&times;</button>
                </div>
            `).join('')}
        </div>
        ${cart.length > 0 ? `
            <div class="cart-footer">
                <div class="cart-summary">
                    <div class="cart-summary-row">
                        <span>Sous-total</span>
                        <span>${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()} Ar</span>
                    </div>
                    <div class="cart-summary-row total">
                        <span>Total</span>
                        <span>${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()} Ar</span>
                    </div>
                </div>
                <div class="cart-actions">
                    <button class="cart-clear" onclick="clearCart()">Vider le panier</button>
                    <button class="cart-checkout" onclick="checkout()">Passer la commande</button>
                </div>
            </div>
        ` : ''}
    `;

    const overlay = document.createElement('div');
    overlay.id = 'cartOverlay';
    overlay.className = 'cart-overlay';
    overlay.onclick = closeCart;

    document.body.appendChild(overlay);
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    const modal = document.getElementById('cartModal');
    const overlay = document.getElementById('cartOverlay');
    if (modal) modal.remove();
    if (overlay) overlay.remove();
    document.body.style.overflow = '';
}

function updateQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartModal();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartModal();
}

function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartModal();
}

function checkout() {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    closeCart();
    showPaymentModal(total);
}

function showPaymentModal(total) {
    const modal = document.createElement('div');
    modal.id = 'paymentModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.6);
        z-index: 4000;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.3s ease;
    `;

    const subtotal = total;
    const deliveryFee = 0;
    const discount = 0;

    modal.innerHTML = `
        <div style="background: #fff; border-radius: 16px; padding: 0; max-width: 500px; width: 95%; max-height: 95vh; overflow-y: auto; animation: slideUp 0.3s ease;">
            <div style="background: linear-gradient(135deg, var(--secondary), var(--secondary-light)); padding: 1.5rem; border-radius: 16px 16px 0 0; text-align: center;">
                <h2 style="color: #fff; margin: 0 0 0.5rem 0; font-size: 1.3rem;">Finaliser votre commande</h2>
                <p style="color: rgba(255,255,255,0.7); margin: 0; font-size: 0.9rem;">Complétez les informations ci-dessous</p>
            </div>

            <div style="padding: 1.5rem;">
                <div style="background: var(--surface-alt); border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem;">
                    <h3 style="color: var(--secondary); margin: 0 0 1rem 0; font-size: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                        Récapitulatif (${cart.length} article${cart.length > 1 ? 's' : ''})
                    </h3>
                    <div style="max-height: 150px; overflow-y: auto;">
                        ${cart.map(item => `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid var(--border);">
                                <div>
                                    <span style="color: var(--secondary); font-weight: 500;">${item.name}</span>
                                    <span style="color: var(--text-light); font-size: 0.85rem;"> x${item.quantity}</span>
                                </div>
                                <span style="color: var(--primary); font-weight: 600;">${(item.price * item.quantity).toLocaleString()} Ar</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div style="margin-bottom: 1.5rem;">
                    <h3 style="color: var(--secondary); margin: 0 0 1rem 0; font-size: 1rem;">Vos coordonnées</h3>
                    <div style="display: grid; gap: 0.75rem;">
                        <input type="text" id="customerName" placeholder="Nom complet *" required style="padding: 0.75rem; border: 2px solid var(--border); border-radius: 8px; font-size: 0.95rem;">
                        <input type="tel" id="customerPhone" placeholder="Numéro téléphone * (ex: 0341234567)" required style="padding: 0.75rem; border: 2px solid var(--border); border-radius: 8px; font-size: 0.95rem;">
                    </div>
                </div>

                <div style="margin-bottom: 1.5rem;">
                    <h3 style="color: var(--secondary); margin: 0 0 1rem 0; font-size: 1rem;">Mode de retrait</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                        <label style="cursor: pointer;">
                            <input type="radio" name="deliveryType" value="pickup" checked onchange="updateDeliveryFee(0, ${subtotal})" style="display: none;">
                            <div id="pickupOption" style="padding: 1rem; border: 2px solid var(--primary); border-radius: 10px; text-align: center; background: rgba(201, 162, 39, 0.1);">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" style="margin-bottom: 0.5rem;"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                                <p style="margin: 0; font-weight: 600; color: var(--secondary); font-size: 0.9rem;">Sur place</p>
                                <p style="margin: 0; font-size: 0.8rem; color: #22c55e;">Gratuit</p>
                            </div>
                        </label>
                        <label style="cursor: pointer;">
                            <input type="radio" name="deliveryType" value="delivery" onchange="updateDeliveryFee(3000, ${subtotal})" style="display: none;">
                            <div id="deliveryOption" style="padding: 1rem; border: 2px solid var(--border); border-radius: 10px; text-align: center; background: var(--surface);">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" stroke-width="2" style="margin-bottom: 0.5rem;"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                                <p style="margin: 0; font-weight: 600; color: var(--secondary); font-size: 0.9rem;">Livraison</p>
                                <p style="margin: 0; font-size: 0.8rem; color: var(--text-light);">+3 000 Ar</p>
                            </div>
                        </label>
                    </div>
                    <div id="deliveryAddress" style="display: none; margin-top: 0.75rem;">
                        <input type="text" id="deliveryLocation" placeholder="Adresse de livraison *" style="width: 100%; padding: 0.75rem; border: 2px solid var(--border); border-radius: 8px; font-size: 0.95rem;">
                    </div>
                </div>

                <div style="background: var(--surface-alt); border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="color: var(--text-light);">Sous-total</span>
                        <span style="color: var(--secondary);" id="subtotalDisplay">${subtotal.toLocaleString()} Ar</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="color: var(--text-light);">Frais de livraison</span>
                        <span style="color: var(--secondary);" id="deliveryDisplay">0 Ar</span>
                    </div>
                    <div style="border-top: 2px solid var(--border); margin-top: 0.75rem; padding-top: 0.75rem; display: flex; justify-content: space-between;">
                        <span style="color: var(--secondary); font-weight: 700;">TOTAL</span>
                        <span style="color: var(--primary); font-size: 1.25rem; font-weight: 700;" id="totalDisplay">${total.toLocaleString()} Ar</span>
                    </div>
                </div>

                <h3 style="color: var(--secondary); margin: 0 0 1rem 0; font-size: 1rem;">Choisir le mode de paiement</h3>
                <div style="display: grid; gap: 0.75rem; margin-bottom: 1.5rem;">
                    <button onclick="processPayment('mvola', getFinalTotal())" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #fff; border: 2px solid #ff6b00; border-radius: 12px; cursor: pointer; transition: all 0.3s;">
                        <div style="width: 45px; height: 45px; background: linear-gradient(135deg, #ff6b00, #ff9500); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 0.75rem;">Mvola</div>
                        <div style="text-align: left; flex: 1;">
                            <p style="margin: 0; font-weight: 600; color: var(--secondary); font-size: 0.95rem;">Mvola</p>
                            <p style="margin: 0; font-size: 0.75rem; color: var(--text-light);">Paiement via Telma</p>
                        </div>
                        <span style="color: #ff6b00;">&rarr;</span>
                    </button>

                    <button onclick="processPayment('orange', getFinalTotal())" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #fff; border: 2px solid #ff6600; border-radius: 12px; cursor: pointer; transition: all 0.3s;">
                        <div style="width: 45px; height: 45px; background: linear-gradient(135deg, #ff6600, #ff9933); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 0.7rem;">OM</div>
                        <div style="text-align: left; flex: 1;">
                            <p style="margin: 0; font-weight: 600; color: var(--secondary); font-size: 0.95rem;">Orange Money</p>
                            <p style="margin: 0; font-size: 0.75rem; color: var(--text-light);">Paiement via Orange</p>
                        </div>
                        <span style="color: #ff6600;">&rarr;</span>
                    </button>

                    <button onclick="processPayment('airtel', getFinalTotal())" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #fff; border: 2px solid #c41e3a; border-radius: 12px; cursor: pointer; transition: all 0.3s;">
                        <div style="width: 45px; height: 45px; background: linear-gradient(135deg, #c41e3a, var(--accent-light)); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 0.7rem;">AM</div>
                        <div style="text-align: left; flex: 1;">
                            <p style="margin: 0; font-weight: 600; color: var(--secondary); font-size: 0.95rem;">Airtel Money</p>
                            <p style="margin: 0; font-size: 0.75rem; color: var(--text-light);">Paiement via Airtel</p>
                        </div>
                        <span style="color: #c41e3a;">&rarr;</span>
                    </button>
                </div>

                <button onclick="closePaymentModal()" style="width: 100%; padding: 0.75rem; background: var(--surface-alt); border: none; border-radius: 8px; color: var(--text-light); font-weight: 600; cursor: pointer;">Retour au panier</button>
            </div>
        </div>
    `;

    modal.onclick = (e) => {
        if (e.target === modal) closePaymentModal();
    };

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    document.querySelectorAll('input[name="deliveryType"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const pickupDiv = document.getElementById('pickupOption');
            const deliveryDiv = document.getElementById('deliveryOption');
            const addressDiv = document.getElementById('deliveryAddress');
            
            if (e.target.value === 'pickup') {
                pickupDiv.style.borderColor = 'var(--primary)';
                pickupDiv.style.background = 'rgba(201, 162, 39, 0.1)';
                deliveryDiv.style.borderColor = 'var(--border)';
                deliveryDiv.style.background = 'var(--surface)';
                addressDiv.style.display = 'none';
                document.getElementById('deliveryLocation').required = false;
            } else {
                deliveryDiv.style.borderColor = 'var(--primary)';
                deliveryDiv.style.background = 'rgba(201, 162, 39, 0.1)';
                pickupDiv.style.borderColor = 'var(--border)';
                pickupDiv.style.background = 'var(--surface)';
                addressDiv.style.display = 'block';
                document.getElementById('deliveryLocation').required = true;
            }
        });
    });
}

let currentDeliveryFee = 0;
let currentDiscount = 0;
let currentSubtotal = 0;

function updateDeliveryFee(fee, subtotal) {
    currentDeliveryFee = fee;
    currentSubtotal = subtotal;
    const total = subtotal + fee - currentDiscount;
    
    document.getElementById('deliveryDisplay').textContent = fee.toLocaleString() + ' Ar';
    document.getElementById('totalDisplay').textContent = total.toLocaleString() + ' Ar';
}

function getFinalTotal() {
    return currentSubtotal + currentDeliveryFee - currentDiscount;
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) modal.remove();
    document.body.style.overflow = '';
}

function processPayment(operator, amount) {
    closePaymentModal();

    const operatorNames = {
        'mvola': 'Mvola',
        'orange': 'Orange Money',
        'airtel': 'Airtel Money'
    };

    const ussdCodes = {
        'mvola': '*444#',
        'orange': '#150#',
        'airtel': '*200#'
    };

    const modal = document.createElement('div');
    modal.id = 'processingModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        z-index: 5000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    modal.innerHTML = `
        <div style="background: #fff; border-radius: 16px; padding: 2rem; max-width: 400px; width: 90%; text-align: center;">
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, var(--primary), var(--primary-light)); border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M9 12l2 2 4-4"/>
                </svg>
            </div>
            <h3 style="color: var(--secondary); margin-bottom: 1rem;">Confirmation de paiement</h3>
            <p style="color: var(--text-light); margin-bottom: 1.5rem; line-height: 1.6;">
                Pour finaliser votre commande de <strong style="color: var(--primary);">${amount.toLocaleString()} Ar</strong> via <strong>${operatorNames[operator]}</strong> :
            </p>
            <div style="background: var(--surface-alt); border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem; text-align: left;">
                <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: var(--text-light);">1. Composez le code USSD :</p>
                <p style="margin: 0 0 1rem 0; font-size: 1.3rem; font-weight: 700; color: var(--secondary); text-align: center; background: #fff; padding: 0.5rem; border-radius: 6px;">${ussdCodes[operator]}</p>
                <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: var(--text-light);">2. Suivez les instructions</p>
                <p style="margin: 0; font-size: 0.9rem; color: var(--text-light);">3. Numéro marchand : <strong>034 12 345 67</strong></p>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <button onclick="closeProcessingModal()" style="padding: 0.75rem; background: var(--surface-alt); border: none; border-radius: 8px; color: var(--text-light); font-weight: 600; cursor: pointer;">Annuler</button>
                <button onclick="confirmPayment(${amount})" style="padding: 0.75rem; background: var(--primary); border: none; border-radius: 8px; color: #fff; font-weight: 700; cursor: pointer;">J'ai payé</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function closeProcessingModal() {
    const modal = document.getElementById('processingModal');
    if (modal) modal.remove();
}

function confirmPayment(amount) {
    closeProcessingModal();
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        z-index: 6000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    modal.innerHTML = `
        <div style="background: #fff; border-radius: 16px; padding: 2rem; max-width: 350px; width: 90%; text-align: center;">
            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #22c55e, #34ce57); border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; animation: scaleIn 0.3s ease;">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
            </div>
            <h3 style="color: var(--secondary); margin-bottom: 0.5rem;">Paiement confirmé !</h3>
            <p style="color: var(--text-light); margin-bottom: 1.5rem;">Votre commande de ${amount.toLocaleString()} Ar a été enregistrée.</p>
            <button onclick="this.parentElement.parentElement.remove(); document.body.style.overflow = '';" style="padding: 0.75rem 2rem; background: #22c55e; border: none; border-radius: 8px; color: #fff; font-weight: 700; cursor: pointer;">OK</button>
        </div>
    `;

    document.body.appendChild(modal);
}

function showNotification(name) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
        </svg>
        ${name} ajouté au panier
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Données des desserts - Les IDs correspondent aux noms des fichiers dans /image/dessert/
const dessertItems = [
    { name: 'Fondant au Chocolat', price: 15000, id: 'fondant-chocolat' },
    { name: 'Mousse au Chocolat noir', price: 12000, id: 'mousse-chocolat' },
    { name: 'Crème Brûlée Vanille', price: 14000, id: 'creme-brulee' },
    { name: 'Tarte au Citron Meringuée', price: 13000, id: 'tarte-citron' },
    { name: 'Salade de Fruits frais', price: 10000, id: 'salade-fruits' }
];

// Données des boissons - Les IDs correspondent aux noms des fichiers dans /image/boisson/
const boissonItems = [
    { name: 'Jus de Fruits Naturel', price: 8000, id: 'jus-fruits-naturel' },
    { name: 'Coca-Cola', price: 5000, id: 'coca-cola' }
];

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
