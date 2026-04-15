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

function updateQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartUI();
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
    
    const form = event.target;
    const btn = form.querySelector('.btn-primary');
    const originalText = btn.textContent;
    btn.textContent = 'Envoi en cours...';
    btn.disabled = true;

    const formData = {
        nom: form.nom.value,
        telephone: form.telephone.value,
        date: form.date.value,
        heure: form.heure.value,
        personnes: form.personnes.value,
        table: form.table.value,
        paiement: form.payment_method.value || 'Non sélectionné'
    };

    const templateParams = {
        from_name: formData.nom,
        phone: formData.telephone,
        date: formData.date,
        time: formData.heure,
        guests: formData.personnes,
        table: formData.table,
        payment: formData.paiement,
        to_email: 'hotelintsika@gmail.com'
    };

    emailjs.send('service_7u4ygxd', 'template_h48k8v6', templateParams)
        .then(() => {
            alert('Votre réservation a été envoyée ! Nous vous confirmerons par email.');
            form.reset();
        })
        .catch((error) => {
            console.error('Erreur EmailJS:', error);
            alert('Erreur: ' + (error.text || 'Échec de l\'envoi. Vérifiez votre clé publique et vos IDs de service/template.'));
        })
        .finally(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        });
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

// ==================== CHATBOT ====================
// Enhanced bot responses with suggestions and special actions using regex for intent recognition
const botIntents = [
    {
        patterns: [/(bonjour|salut|hello|coucou)/i],
        response: {
            text: "Bonjour! Bienvenue chez Hotelintsika. Comment puis-je vous aider?",
            suggestions: [
                { label: "Voir le menu", value: "menu" },
                { label: "Réserver une table", value: "réservation" },
                { label: "Nos horaires", value: "horaire" },
                { label: "Nous contacter", value: "contact" }
            ]
        }
    },
    {
        patterns: [/(bonsoir|bonne soirée)/i],
        response: {
            text: "Bonsoir! Bienvenue chez Hotelintsika. Comment puis-je vous aider?",
            suggestions: [
                { label: "Voir le menu", value: "menu" },
                { label: "Réserver une table", value: "réservation" }
            ]
        }
    },
    {
        patterns: [/(dessert|sucré|gâteau|crêpe|brownie|cheesecake)/i],
        response: {
            text: "Nos délicieux desserts incluent le Fondant au Chocolat, la Crème Brûlée Vanille, et le Cheesecake aux Fruits rouges. Vous pouvez les commander directement depuis le menu.",
            suggestions: [
                { label: "Voir le menu", value: "menu" }
            ]
        }
    },
    {
        patterns: [/(boisson|boire|rafraîchissement|bière|jus|cocktail)/i],
        response: {
            text: "Nous avons une sélection de boissons rafraîchissantes. Consultez notre menu pour plus de détails.",
            suggestions: [
                { label: "Voir le menu", value: "menu" }
            ]
        }
    },
    {
        patterns: [/(menu|carte|plats|quoi manger)/i],
        response: {
            text: "Découvrez notre menu ici: <a href='menu.html' target='_blank'>Menu.html</a>. Nous proposons des plats traditionnels malgaches et des créations du chef.",
            suggestions: [
                { label: "Voir les desserts", value: "desserts" },
                { label: "Voir les boissons", value: "boissons" }
            ]
        }
    },
    {
        patterns: [/(réservation|réserver|table|chambre|disponibilité)/i],
        response: {
            text: "Pour réserver une table ou une chambre, vous pouvez utiliser notre formulaire de réservation ou nous appeler directement.",
            suggestions: [
                { label: "Faire une réservation", value: "ACTION_OPEN_RESERVATION_FORM" },
                { label: "Appeler l'hôtel", value: "ACTION_CALL_HOTEL" }
            ]
        }
    },
    {
        patterns: [/(horaire|ouverture|fermeture|quand ouvrez-vous|quand fermez-vous)/i],
        response: {
            text: "Nos horaires:<br>• Lundi - Samedi: 7h - 22h<br>• Dimanche: 8h - 21h<br>• Service 24/7 pour l'hébergement",
            suggestions: [
                { label: "Nous contacter", value: "contact" }
            ]
        }
    },
    {
        patterns: [/(adresse|où êtes-vous|localisation|plan)/i],
        response: {
            text: "Nous sommes situés à Andoharanofotsy, Madagascar. Vous pouvez nous trouver sur Google Maps.",
            suggestions: [
                { label: "Voir sur la carte", value: "ACTION_OPEN_MAP" }
            ]
        }
    },
    {
        patterns: [/(contact|appeler|téléphone|email|mail|nous joindre)/i],
        response: {
            text: "Contactez-nous:<br>• Téléphone: +261 34 12 345 67<br>• Email: contact@hotelintsika.mg<br>• Adresse: Andoharanofotsy, Madagascar",
            suggestions: [
                { label: "Appeler l'hôtel", value: "ACTION_CALL_HOTEL" },
                { label: "Envoyer un email", value: "ACTION_SEND_EMAIL" }
            ]
        }
    },
    {
        patterns: [/(prix|coût|combien coûte|tarif)/i],
        response: {
            text: "Nos plats varient entre 8 000 et 25 000 Ar. Le menu complet est disponible sur la page Menu.",
            suggestions: [
                { label: "Voir le menu", value: "menu" }
            ]
        }
    },
    {
        patterns: [/(spécialité|plat du chef|recommandation|meilleur plat)/i],
        response: {
            text: "Nos spécialités incluent le Ravitoto sy Henakisoa, Henomby Ritra, Poulet Frite et Côtelettes de Porc.",
            suggestions: [
                { label: "Voir le menu", value: "menu" }
            ]
        }
    },
    { // Default fallback response - should be last
        patterns: [/.*/i], // Matches any input if no specific intent is found
        response: {
            text: "Désolé, je n'ai pas bien compris. Pour une réponse plus précise, vous pouvez nous contacter directement.",
            suggestions: [
                { label: "Nous contacter", value: "contact" },
                { label: "Voir le menu", value: "menu" }
            ]
        }
    }
];

function toggleChat() {
    const container = document.getElementById('chatContainer');
    const toggle = document.getElementById('chatToggle');
    container.classList.toggle('active');
    toggle.classList.toggle('active');
    // Initial bot message when chat opens for the first time
    if (container.classList.contains('active') && document.getElementById('chatMessages').children.length === 0) {
        showTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            addBotMessage(getBotResponse('bonjour')); 
        }, 800);
    }
}

function handleChatKeypress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;

    addUserMessage(message);
    input.value = '';

    showTypingIndicator();

    setTimeout(() => {
        removeTypingIndicator();
        const response = getBotResponse(message); // Now returns an object
        addBotMessage(response);
    }, 1000);
}

function sendQuickMessage(value) { // Renamed 'message' to 'value' for clarity
    if (value.startsWith('ACTION_')) {
        handleSpecialBotAction(value);
        return;
    }

    // If it's not a special action, treat it as if the user typed it.
    addUserMessage(value);
    showTypingIndicator();

    setTimeout(() => {
        removeTypingIndicator();
        const response = getBotResponse(value);
        addBotMessage(response);
    }, 1000);
}

function addUserMessage(message) {
    const messages = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-message user animate-in';
    msgDiv.innerHTML = `
        <div class="chat-message-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
        </div>
        <div class="chat-message-content">${escapeHtml(message)}</div> <!-- User input always escaped -->
    `;
    messages.appendChild(msgDiv);
    messages.scrollTo({
        top: messages.scrollHeight,
        behavior: 'smooth'
    });
}

function addBotMessage(response) { // response can be string or object
    const messages = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-message bot animate-in';

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'chat-message-avatar';
    avatarDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>`;
    msgDiv.appendChild(avatarDiv);

    const contentDiv = document.createElement('div');
    contentDiv.className = 'chat-message-content';

    let suggestionsDiv = null;

    if (typeof response === 'string') {
        contentDiv.textContent = response; // Use textContent for plain strings
    } else {
        contentDiv.innerHTML = response.text; // Use innerHTML for bot's pre-defined HTML
        if (response.suggestions && response.suggestions.length > 0) {
            suggestionsDiv = document.createElement('div');
            suggestionsDiv.className = 'chat-suggestions';
            response.suggestions.forEach(sug => {
                const btn = document.createElement('button');
                btn.className = 'chat-suggestion-btn';
                btn.textContent = sug.label; // Label is plain text
                btn.onclick = () => sendQuickMessage(sug.value); // Value is also plain text/command
                suggestionsDiv.appendChild(btn);
            });
        }
    }
    msgDiv.appendChild(contentDiv);
    if (suggestionsDiv) {
        msgDiv.appendChild(suggestionsDiv);
    }

    messages.appendChild(msgDiv);
    messages.scrollTo({
        top: messages.scrollHeight,
        behavior: 'smooth'
    });
}

function getBotResponse(message) {
    const lower = message.toLowerCase();
    for (const intent of botIntents) {
        for (const pattern of intent.patterns) {
            if (pattern.test(lower)) {
                return intent.response;
            }
        }
    }
    // Fallback to the last intent (which should be the default one) if no specific pattern matches
    return botIntents[botIntents.length - 1].response;
}

function handleSpecialBotAction(action) {
    switch (action) {
        case 'ACTION_OPEN_RESERVATION_FORM':
            addBotMessage({ text: "Ouverture du formulaire de réservation..." });
            const reservationSection = document.getElementById('reservation-section');
            if (reservationSection) {
                reservationSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.location.href = 'index.html#reservation';
            }
            break;
        case 'ACTION_CALL_HOTEL':
            addBotMessage({ text: "Vous pouvez nous appeler au <a href='tel:+261341234567'>+261 34 12 345 67</a>." });
            window.open('tel:+261341234567');
            break;
        case 'ACTION_SEND_EMAIL':
            addBotMessage({ text: "Envoyez-nous un email à <a href='mailto:contact@hotelintsika.mg'>contact@hotelintsika.mg</a>." });
            window.open('mailto:contact@hotelintsika.mg');
            break;
        case 'ACTION_OPEN_MAP':
            addBotMessage({ text: "Voici notre emplacement sur Google Maps." });
            window.open('https://www.google.com/maps/search/?api=1&query=Hotelintsika+Andoharanofotsy+Madagascar', '_blank');
            break;
        default:
            addBotMessage({ text: "Action non reconnue." });
            break;
    }
}

function showTypingIndicator() {
    const messages = document.getElementById('chatMessages');
    const indicatorDiv = document.createElement('div');
    indicatorDiv.id = 'typingIndicator';
    indicatorDiv.className = 'chat-message bot animate-in';
    indicatorDiv.innerHTML = `
        <div class="chat-message-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 0 0 1 2-2h14a2 0 0 1 2 2z"></path>
            </svg>
        </div>
        <div class="chat-message-content typing-dots">
            <span></span><span></span><span></span>
        </div>
    `;
    messages.appendChild(indicatorDiv);
    messages.scrollTo({ top: messages.scrollHeight, behavior: 'smooth' });
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
