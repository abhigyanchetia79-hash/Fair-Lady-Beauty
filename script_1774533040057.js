// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const adminModal = document.getElementById('admin-modal');
const adminPanel = document.getElementById('admin-panel');
const adminLoginForm = document.getElementById('admin-login-form');
const bookingForm = document.getElementById('booking-form');
const servicesGrid = document.getElementById('services-grid');
const serviceSelect = document.getElementById('service');
const menuCategories = document.getElementById('menu-categories');
const menuItems = document.getElementById('menu-items');

// Sample services data (will be replaced with backend data)
const defaultServices = [
    {
        id: 1,
        name: 'Haircut & Styling',
        description: 'Professional haircut and styling with premium products',
        price: '$45',
        icon: 'fa-cut'
    },
    {
        id: 2,
        name: 'Facial Treatment',
        description: 'Deep cleansing and rejuvenating facial treatment',
        price: '$65',
        icon: 'fa-spa'
    },
    {
        id: 3,
        name: 'Makeup Application',
        description: 'Professional makeup for any occasion',
        price: '$75',
        icon: 'fa-paint-brush'
    },
    {
        id: 4,
        name: 'Manicure & Pedicure',
        description: 'Complete nail care and polish application',
        price: '$55',
        icon: 'fa-hand-sparkles'
    },
    {
        id: 5,
        name: 'Hair Coloring',
        description: 'Professional hair coloring and highlights',
        price: '$85',
        icon: 'fa-palette'
    },
    {
        id: 6,
        name: 'Waxing Services',
        description: 'Full body waxing and hair removal',
        price: '$40',
        icon: 'fa-fire'
    }
];

// Sample menu data (will be replaced with backend data)
const defaultMenuCategories = [
    { id: 1, name: 'Hair Services', icon: 'fa-cut' },
    { id: 2, name: 'Facial & Skincare', icon: 'fa-spa' },
    { id: 3, name: 'Makeup', icon: 'fa-paint-brush' },
    { id: 4, name: 'Nail Services', icon: 'fa-hand-sparkles' },
    { id: 5, name: 'Body Treatments', icon: 'fa-heart' }
];

const defaultMenuItems = [
    {
        id: 1,
        name: 'Premium Hair Spa',
        description: 'Deep conditioning treatment with hair massage and aromatherapy',
        price: '$120',
        category: 'Hair Services',
        image: 'https://images.unsplash.com/photo-1560069007-67ba8b24a822?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        badge: 'featured'
    },
    {
        id: 2,
        name: 'Diamond Facial',
        description: 'Luxury anti-aging facial with diamond dust and collagen',
        price: '$200',
        category: 'Facial & Skincare',
        image: 'https://images.unsplash.com/photo-1610992015732-2d3b5e2fe2d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        badge: 'premium'
    },
    {
        id: 3,
        name: 'Bridal Makeup',
        description: 'Complete bridal makeup with trial session and on-site service',
        price: '$350',
        category: 'Makeup',
        image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        badge: 'featured'
    },
    {
        id: 4,
        name: 'Gel Nail Extensions',
        description: 'Premium gel nail extensions with custom nail art',
        price: '$80',
        category: 'Nail Services',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        badge: 'popular'
    },
    {
        id: 5,
        name: 'Full Body Massage',
        description: 'Relaxing full body massage with essential oils',
        price: '$150',
        category: 'Body Treatments',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd23ed8935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        badge: 'new'
    }
];

let currentCategory = 'All';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    loadServices();
    loadMenu();
    checkAdminAuth();
    setupSmoothScroll();
    setupNavbarScroll();
}

// Event Listeners
function setupEventListeners() {
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Admin login modal
    const adminLink = document.querySelector('.admin-only');
    if (adminLink) {
        adminLink.addEventListener('click', function(e) {
            e.preventDefault();
            adminModal.style.display = 'block';
        });
    }

    // Close modal
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            adminModal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === adminModal) {
            adminModal.style.display = 'none';
        }
    });

    // Admin login form
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }

    // Booking form
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBooking);
    }

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Add service button
    const addServiceBtn = document.getElementById('add-service-btn');
    if (addServiceBtn) {
        addServiceBtn.addEventListener('click', showAddServiceForm);
    }

    // Contact settings form
    const contactSettingsForm = document.getElementById('contact-settings-form');
    if (contactSettingsForm) {
        contactSettingsForm.addEventListener('submit', handleContactSettings);
    }

    // Menu management buttons
    const addMenuCategoryBtn = document.getElementById('add-menu-category-btn');
    if (addMenuCategoryBtn) {
        addMenuCategoryBtn.addEventListener('click', showAddMenuCategoryForm);
    }

    const addMenuItemBtn = document.getElementById('add-menu-item-btn');
    if (addMenuItemBtn) {
        addMenuItemBtn.addEventListener('click', showAddMenuItemForm);
    }
}

// Load services
function loadServices() {
    // Wait for Firebase to be ready
    window.addEventListener('firebaseReady', function() {
        if (window.firestoreDB) {
            firestoreDB.getCollection('services')
                .then(result => {
                    if (result.success) {
                        displayServices(result.data);
                        populateServiceSelect(result.data);
                    } else {
                        console.log('Using default services:', result.error);
                        displayServices(defaultServices);
                        populateServiceSelect(defaultServices);
                    }
                })
                .catch(error => {
                    console.log('Using default services:', error);
                    displayServices(defaultServices);
                    populateServiceSelect(defaultServices);
                });
        } else {
            // Fallback to default services
            displayServices(defaultServices);
            populateServiceSelect(defaultServices);
        }
    });
}

// Display services on the page
function displayServices(services) {
    if (!servicesGrid) return;
    
    servicesGrid.innerHTML = '';
    services.forEach(service => {
        const serviceCard = createServiceCard(service);
        servicesGrid.appendChild(serviceCard);
    });
}

// Create service card element
function createServiceCard(service) {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.innerHTML = `
        <div class="service-icon">
            <i class="fas ${service.icon || 'fa-spa'}"></i>
        </div>
        <h3>${service.name}</h3>
        <p>${service.description}</p>
        <div class="service-price">${service.price}</div>
        <button class="btn btn-primary" onclick="bookService(${service.id})">Book Now</button>
    `;
    return card;
}

// Populate service select dropdown
function populateServiceSelect(services) {
    if (!serviceSelect) return;
    
    serviceSelect.innerHTML = '<option value="">Select a Service</option>';
    services.forEach(service => {
        const option = document.createElement('option');
        option.value = service.id;
        option.textContent = `${service.name} - ${service.price}`;
        serviceSelect.appendChild(option);
    });
}

// Book a specific service
function bookService(serviceId) {
    if (serviceSelect) {
        serviceSelect.value = serviceId;
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    }
}

// Load menu
function loadMenu() {
    // Wait for Firebase to be ready
    window.addEventListener('firebaseReady', function() {
        if (window.firestoreDB) {
            // Load categories
            firestoreDB.getCollection('menuCategories')
                .then(result => {
                    if (result.success) {
                        displayMenuCategories(result.data);
                    } else {
                        displayMenuCategories(defaultMenuCategories);
                    }
                })
                .catch(() => {
                    displayMenuCategories(defaultMenuCategories);
                });

            // Load menu items
            firestoreDB.getCollection('menuItems')
                .then(result => {
                    if (result.success) {
                        displayMenuItems(result.data);
                    } else {
                        displayMenuItems(defaultMenuItems);
                    }
                })
                .catch(() => {
                    displayMenuItems(defaultMenuItems);
                });
        } else {
            // Fallback to default data
            displayMenuCategories(defaultMenuCategories);
            displayMenuItems(defaultMenuItems);
        }
    });
}

// Display menu categories
function displayMenuCategories(categories) {
    if (!menuCategories) return;
    
    menuCategories.innerHTML = '';
    
    // Add "All" category button
    const allBtn = document.createElement('button');
    allBtn.className = 'category-btn active';
    allBtn.textContent = 'All';
    allBtn.onclick = () => filterMenuItems('All');
    menuCategories.appendChild(allBtn);
    
    // Add category buttons
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.innerHTML = `<i class="fas ${category.icon || 'fa-spa'}"></i> ${category.name}`;
        btn.onclick = () => filterMenuItems(category.name);
        menuCategories.appendChild(btn);
    });
}

// Display menu items
function displayMenuItems(items) {
    if (!menuItems) return;
    
    menuItems.innerHTML = '';
    const filteredItems = currentCategory === 'All' 
        ? items 
        : items.filter(item => item.category === currentCategory);
    
    filteredItems.forEach(item => {
        const menuItem = createMenuItem(item);
        menuItems.appendChild(menuItem);
    });
}

// Create menu item element
function createMenuItem(item) {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    
    const badgeHtml = item.badge 
        ? `<span class="menu-item-badge ${item.badge}">${item.badge}</span>` 
        : '';
    
    menuItem.innerHTML = `
        <img src="${item.image || 'https://images.unsplash.com/photo-1560069007-67ba8b24a822?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'}" alt="${item.name}" class="menu-item-image">
        <div class="menu-item-content">
            <div class="menu-item-header">
                <h3 class="menu-item-title">${item.name}</h3>
                <span class="menu-item-category">${item.category}</span>
            </div>
            <p class="menu-item-description">${item.description}</p>
            <div class="menu-item-footer">
                <span class="menu-item-price">${item.price}</span>
                ${badgeHtml}
            </div>
        </div>
    `;
    
    return menuItem;
}

// Filter menu items by category
function filterMenuItems(category) {
    currentCategory = category;
    
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Reload menu items with filter
    window.addEventListener('firebaseReady', function() {
        if (window.firestoreDB) {
            firestoreDB.getCollection('menuItems')
                .then(result => {
                    if (result.success) {
                        displayMenuItems(result.data);
                    } else {
                        displayMenuItems(defaultMenuItems);
                    }
                })
                .catch(() => {
                    displayMenuItems(defaultMenuItems);
                });
        } else {
            displayMenuItems(defaultMenuItems);
        }
    });
}

// Handle admin login
function handleAdminLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    // Use Firebase Authentication
    if (window.firebaseAuth) {
        firebaseAuth.signIn(username + '@gmail.com', password)
            .then(result => {
                if (result.success) {
                    localStorage.setItem('adminToken', result.user.uid);
                    localStorage.setItem('adminEmail', result.user.email);
                    adminModal.style.display = 'none';
                    showAdminPanel();
                } else {
                    // Fallback to demo mode
                    if (username === 'fairlady45' && password === 'fairlady123') {
                        localStorage.setItem('adminToken', 'demo-token');
                        localStorage.setItem('adminEmail', 'fairlady45@gmail.com');
                        adminModal.style.display = 'none';
                        showAdminPanel();
                    } else {
                        alert('Invalid credentials. Use fairlady45/fairlady123 for demo');
                    }
                }
            })
            .catch(error => {
                // Fallback to demo mode
                if (username === 'fairlady45' && password === 'fairlady123') {
                    localStorage.setItem('adminToken', 'demo-token');
                    localStorage.setItem('adminEmail', 'fairlady45@gmail.com');
                    adminModal.style.display = 'none';
                    showAdminPanel();
                } else {
                    alert('Invalid credentials. Use fairlady45/fairlady123 for demo');
                }
            });
    } else {
        // Fallback to demo mode
        if (username === 'fairlady45' && password === 'fairlady123') {
            localStorage.setItem('adminToken', 'demo-token');
            localStorage.setItem('adminEmail', 'fairlady45@gmail.com');
            adminModal.style.display = 'none';
            showAdminPanel();
        } else {
            alert('Invalid credentials. Use fairlady45/fairlady123 for demo');
        }
    }
}

// Check admin authentication
function checkAdminAuth() {
    const token = localStorage.getItem('adminToken');
    if (token) {
        // Verify token with backend
        fetch('/api/admin/verify', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.querySelector('.admin-only').style.display = 'block';
            } else {
                localStorage.removeItem('adminToken');
            }
        })
        .catch(() => {
            // Demo mode - show admin link
            document.querySelector('.admin-only').style.display = 'block';
        });
    }
}

// Show admin panel
function showAdminPanel() {
    adminPanel.style.display = 'block';
    loadAdminData();
}

// Load admin data
function loadAdminData() {
    // Load services for admin
    if (window.firestoreDB) {
        firestoreDB.getCollection('services')
            .then(result => {
                if (result.success) {
                    displayAdminServices(result.data);
                } else {
                    displayAdminServices(defaultServices);
                }
            })
            .catch(() => {
                displayAdminServices(defaultServices);
            });
    } else {
        displayAdminServices(defaultServices);
    }

    // Load menu admin data
    loadMenuAdminData();

    // Load contact info
    loadContactInfo();
}

// Display services in admin panel
function displayAdminServices(services) {
    const servicesList = document.getElementById('services-list');
    if (!servicesList) return;
    
    servicesList.innerHTML = '';
    services.forEach(service => {
        const serviceItem = document.createElement('div');
        serviceItem.className = 'admin-item';
        serviceItem.innerHTML = `
            <div>
                <strong>${service.name}</strong> - ${service.price}
                <br><small>${service.description}</small>
            </div>
            <div class="admin-actions">
                <button class="btn btn-small btn-edit" onclick="editService(${service.id})">Edit</button>
                <button class="btn btn-small btn-delete" onclick="deleteService(${service.id})">Delete</button>
            </div>
        `;
        servicesList.appendChild(serviceItem);
    });
}

// Load contact info
function loadContactInfo() {
    if (window.firestoreDB) {
        firestoreDB.getDocument('contact', 'info')
            .then(result => {
                if (result.success) {
                    const contact = result.data;
                    document.getElementById('admin-phone').value = contact.phone || '';
                    document.getElementById('admin-email').value = contact.email || '';
                    document.getElementById('admin-address').value = contact.address || '';
                } else {
                    // Load default values
                    document.getElementById('admin-phone').value = '+91 9854361547';
                    document.getElementById('admin-email').value = 'fairlady45@gmail.com';
                    document.getElementById('admin-address').value = '123 Luxury Lane, Beverly Hills, CA 90210';
                }
            })
            .catch(() => {
                // Load default values
                document.getElementById('admin-phone').value = '+91 9854361547';
                document.getElementById('admin-email').value = 'fairlady45@gmail.com';
                document.getElementById('admin-address').value = '123 Luxury Lane, Beverly Hills, CA 90210';
            });
    } else {
        // Load default values
        document.getElementById('admin-phone').value = '+91 9854361547';
        document.getElementById('admin-email').value = 'fairlady45@gmail.com';
        document.getElementById('admin-address').value = '123 Luxury Lane, Beverly Hills, CA 90210';
    }
}

// Show add service form
function showAddServiceForm() {
    const form = `
        <div class="admin-item">
            <form id="add-service-form">
                <div class="form-group">
                    <input type="text" id="new-service-name" placeholder="Service Name" required>
                </div>
                <div class="form-group">
                    <textarea id="new-service-description" placeholder="Description" required></textarea>
                </div>
                <div class="form-group">
                    <input type="text" id="new-service-price" placeholder="Price (e.g., $45)" required>
                </div>
                <div class="form-group">
                    <input type="text" id="new-service-icon" placeholder="Icon class (e.g., fa-cut)">
                </div>
                <button type="submit" class="btn btn-primary">Add Service</button>
                <button type="button" class="btn btn-secondary" onclick="cancelAddService()">Cancel</button>
            </form>
        </div>
    `;
    
    const servicesList = document.getElementById('services-list');
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = form;
    servicesList.insertBefore(tempDiv.firstElementChild, servicesList.firstChild);
    
    document.getElementById('add-service-form').addEventListener('submit', handleAddService);
}

// Handle add service
function handleAddService(e) {
    e.preventDefault();
    
    const service = {
        name: document.getElementById('new-service-name').value,
        description: document.getElementById('new-service-description').value,
        price: document.getElementById('new-service-price').value,
        icon: document.getElementById('new-service-icon').value || 'fa-spa',
        category: 'general',
        featured: false
    };
    
    if (window.firestoreDB) {
        firestoreDB.addDocument('services', service)
            .then(result => {
                if (result.success) {
                    loadAdminData();
                    loadServices();
                } else {
                    alert('Failed to add service: ' + result.error);
                }
            })
            .catch(() => {
                // Demo mode - just reload
                loadAdminData();
                loadServices();
            });
    } else {
        // Demo mode - just reload
        loadAdminData();
        loadServices();
    }
}

// Cancel add service
function cancelAddService() {
    loadAdminData();
}

// Edit service
function editService(id) {
    // Implementation for editing service
    alert('Edit functionality would open a form to edit service ' + id);
}

// Delete service
function deleteService(id) {
    if (confirm('Are you sure you want to delete this service?')) {
        if (window.firestoreDB) {
            firestoreDB.deleteDocument('services', id)
                .then(result => {
                    if (result.success) {
                        loadAdminData();
                        loadServices();
                    } else {
                        alert('Failed to delete service: ' + result.error);
                    }
                })
                .catch(() => {
                    // Demo mode - just reload
                    loadAdminData();
                    loadServices();
                });
        } else {
            // Demo mode - just reload
            loadAdminData();
            loadServices();
        }
    }
}

// Handle contact settings
function handleContactSettings(e) {
    e.preventDefault();
    
    const contact = {
        phone: document.getElementById('admin-phone').value,
        email: document.getElementById('admin-email').value,
        address: document.getElementById('admin-address').value
    };
    
    if (window.firestoreDB) {
        firestoreDB.updateDocument('contact', 'info', contact)
            .then(result => {
                if (result.success) {
                    // Update contact info on main page
                    document.getElementById('contact-phone').textContent = contact.phone;
                    document.getElementById('contact-email').textContent = contact.email;
                    document.getElementById('contact-address').textContent = contact.address;
                    alert('Contact information updated successfully!');
                } else {
                    alert('Failed to update contact information: ' + result.error);
                }
            })
            .catch(() => {
                // Demo mode - update directly
                document.getElementById('contact-phone').textContent = contact.phone;
                document.getElementById('contact-email').textContent = contact.email;
                document.getElementById('contact-address').textContent = contact.address;
                alert('Contact information updated (Demo mode)');
            });
    } else {
        // Demo mode - update directly
        document.getElementById('contact-phone').textContent = contact.phone;
        document.getElementById('contact-email').textContent = contact.email;
        document.getElementById('contact-address').textContent = contact.address;
        alert('Contact information updated (Demo mode)');
    }
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('adminToken');
    adminPanel.style.display = 'none';
    document.querySelector('.admin-only').style.display = 'none';
}

// ===== MENU ADMIN FUNCTIONS =====

// Show add menu category form
function showAddMenuCategoryForm() {
    const form = `
        <div class="admin-item">
            <form id="add-menu-category-form">
                <div class="form-group">
                    <input type="text" id="new-category-name" placeholder="Category Name" required>
                </div>
                <div class="form-group">
                    <input type="text" id="new-category-icon" placeholder="Icon class (e.g., fa-cut)">
                </div>
                <button type="submit" class="btn btn-primary">Add Category</button>
                <button type="button" class="btn btn-secondary" onclick="cancelAddMenuCategory()">Cancel</button>
            </form>
        </div>
    `;
    
    const categoriesList = document.getElementById('menu-categories-list');
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = form;
    categoriesList.insertBefore(tempDiv.firstElementChild, categoriesList.firstChild);
    
    document.getElementById('add-menu-category-form').addEventListener('submit', handleAddMenuCategory);
}

// Handle add menu category
function handleAddMenuCategory(e) {
    e.preventDefault();
    
    const category = {
        name: document.getElementById('new-category-name').value,
        icon: document.getElementById('new-category-icon').value || 'fa-spa'
    };
    
    if (window.firestoreDB) {
        firestoreDB.addDocument('menuCategories', category)
            .then(result => {
                if (result.success) {
                    loadMenu();
                    loadMenuAdminData();
                } else {
                    alert('Failed to add category: ' + result.error);
                }
            })
            .catch(() => {
                loadMenu();
                loadMenuAdminData();
            });
    } else {
        loadMenu();
        loadMenuAdminData();
    }
}

// Cancel add menu category
function cancelAddMenuCategory() {
    loadMenuAdminData();
}

// Show add menu item form
function showAddMenuItemForm() {
    const form = `
        <div class="admin-item">
            <form id="add-menu-item-form">
                <div class="form-group">
                    <input type="text" id="new-item-name" placeholder="Item Name" required>
                </div>
                <div class="form-group">
                    <textarea id="new-item-description" placeholder="Description" required></textarea>
                </div>
                <div class="form-group">
                    <input type="text" id="new-item-price" placeholder="Price (e.g., $120)" required>
                </div>
                <div class="form-group">
                    <input type="text" id="new-item-category" placeholder="Category" required>
                </div>
                <div class="form-group">
                    <input type="text" id="new-item-image" placeholder="Image URL">
                </div>
                <div class="form-group">
                    <select id="new-item-badge">
                        <option value="">No Badge</option>
                        <option value="featured">Featured</option>
                        <option value="new">New</option>
                        <option value="popular">Popular</option>
                        <option value="premium">Premium</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Add Menu Item</button>
                <button type="button" class="btn btn-secondary" onclick="cancelAddMenuItem()">Cancel</button>
            </form>
        </div>
    `;
    
    const itemsList = document.getElementById('menu-items-list');
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = form;
    itemsList.insertBefore(tempDiv.firstElementChild, itemsList.firstChild);
    
    document.getElementById('add-menu-item-form').addEventListener('submit', handleAddMenuItem);
}

// Handle add menu item
function handleAddMenuItem(e) {
    e.preventDefault();
    
    const item = {
        name: document.getElementById('new-item-name').value,
        description: document.getElementById('new-item-description').value,
        price: document.getElementById('new-item-price').value,
        category: document.getElementById('new-item-category').value,
        image: document.getElementById('new-item-image').value,
        badge: document.getElementById('new-item-badge').value
    };
    
    if (window.firestoreDB) {
        firestoreDB.addDocument('menuItems', item)
            .then(result => {
                if (result.success) {
                    loadMenu();
                    loadMenuAdminData();
                } else {
                    alert('Failed to add menu item: ' + result.error);
                }
            })
            .catch(() => {
                loadMenu();
                loadMenuAdminData();
            });
    } else {
        loadMenu();
        loadMenuAdminData();
    }
}

// Cancel add menu item
function cancelAddMenuItem() {
    loadMenuAdminData();
}

// Load menu admin data
function loadMenuAdminData() {
    // Load categories for admin
    if (window.firestoreDB) {
        firestoreDB.getCollection('menuCategories')
            .then(result => {
                if (result.success) {
                    displayAdminMenuCategories(result.data);
                } else {
                    displayAdminMenuCategories(defaultMenuCategories);
                }
            })
            .catch(() => {
                displayAdminMenuCategories(defaultMenuCategories);
            });

        // Load menu items for admin
        firestoreDB.getCollection('menuItems')
            .then(result => {
                if (result.success) {
                    displayAdminMenuItems(result.data);
                } else {
                    displayAdminMenuItems(defaultMenuItems);
                }
            })
            .catch(() => {
                displayAdminMenuItems(defaultMenuItems);
            });
    } else {
        displayAdminMenuCategories(defaultMenuCategories);
        displayAdminMenuItems(defaultMenuItems);
    }
}

// Display menu categories in admin panel
function displayAdminMenuCategories(categories) {
    const categoriesList = document.getElementById('menu-categories-list');
    if (!categoriesList) return;
    
    // Clear existing content except forms
    const existingItems = categoriesList.querySelectorAll('.admin-item:not(:has(form))');
    existingItems.forEach(item => item.remove());
    
    categories.forEach(category => {
        const categoryItem = document.createElement('div');
        categoryItem.className = 'admin-item';
        categoryItem.innerHTML = `
            <div>
                <strong><i class="fas ${category.icon || 'fa-spa'}"></i> ${category.name}</strong>
            </div>
            <div class="admin-actions">
                <button class="btn btn-small btn-delete" onclick="deleteMenuCategory('${category.id}')">Delete</button>
            </div>
        `;
        categoriesList.appendChild(categoryItem);
    });
}

// Display menu items in admin panel
function displayAdminMenuItems(items) {
    const itemsList = document.getElementById('menu-items-list');
    if (!itemsList) return;
    
    // Clear existing content except forms
    const existingItems = itemsList.querySelectorAll('.admin-item:not(:has(form))');
    existingItems.forEach(item => item.remove());
    
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'admin-item';
        itemElement.innerHTML = `
            <div>
                <strong>${item.name}</strong> - ${item.price}
                <br><small>${item.category} - ${item.description.substring(0, 50)}...</small>
                ${item.badge ? `<br><span class="menu-item-badge ${item.badge}">${item.badge}</span>` : ''}
            </div>
            <div class="admin-actions">
                <button class="btn btn-small btn-delete" onclick="deleteMenuItem('${item.id}')">Delete</button>
            </div>
        `;
        itemsList.appendChild(itemElement);
    });
}

// Delete menu category
function deleteMenuCategory(id) {
    if (confirm('Are you sure you want to delete this category?')) {
        if (window.firestoreDB) {
            firestoreDB.deleteDocument('menuCategories', id)
                .then(result => {
                    if (result.success) {
                        loadMenu();
                        loadMenuAdminData();
                    } else {
                        alert('Failed to delete category: ' + result.error);
                    }
                })
                .catch(() => {
                    loadMenu();
                    loadMenuAdminData();
                });
        } else {
            loadMenu();
            loadMenuAdminData();
        }
    }
}

// Delete menu item
function deleteMenuItem(id) {
    if (confirm('Are you sure you want to delete this menu item?')) {
        if (window.firestoreDB) {
            firestoreDB.deleteDocument('menuItems', id)
                .then(result => {
                    if (result.success) {
                        loadMenu();
                        loadMenuAdminData();
                    } else {
                        alert('Failed to delete menu item: ' + result.error);
                    }
                })
                .catch(() => {
                    loadMenu();
                    loadMenuAdminData();
                });
        } else {
            loadMenu();
            loadMenuAdminData();
        }
    }
}

// Handle booking form
function handleBooking(e) {
    e.preventDefault();
    
    const booking = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        date: document.getElementById('date').value,
        message: document.getElementById('message').value,
        status: 'pending'
    };
    
    // Send booking to Firebase
    if (window.firestoreDB) {
        firestoreDB.addDocument('bookings', booking)
            .then(result => {
                if (result.success) {
                    alert('Booking request sent successfully! We will contact you soon.');
                    bookingForm.reset();
                } else {
                    alert('Failed to send booking request: ' + result.error);
                }
            })
            .catch(() => {
                // Demo mode - just show success message
                alert('Booking request sent successfully! (Demo mode)');
                bookingForm.reset();
            });
    } else {
        // Demo mode - just show success message
        alert('Booking request sent successfully! (Demo mode)');
        bookingForm.reset();
    }
}

// Smooth scrolling for navigation links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Navbar scroll effect
function setupNavbarScroll() {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    });
}

// Set minimum date for booking to today
function setMinDate() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
}

// Initialize date input
setMinDate();
