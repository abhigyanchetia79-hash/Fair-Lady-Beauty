// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyA-qlP1OVjkPKpThFjHlF4LttNi_64Bce8",
    authDomain: "fair-lady-beauty.firebaseapp.com",
    projectId: "fair-lady-beauty",
    storageBucket: "fair-lady-beauty.firebasestorage.app",
    messagingSenderId: "766711382460",
    appId: "1:766711382460:web:fc5ce6184d64bef2b0ebb9",
    measurementId: "G-FX1EQE4CXT"
};

// Initialize Firebase
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    
    // Initialize Firebase services
    const auth = firebase.auth();
    const db = firebase.firestore();
    const storage = firebase.storage();
    
    // Make Firebase services globally available
    window.auth = auth;
    window.db = db;
    window.storage = storage;
    window.firebase = firebase;
    
    // Enable offline persistence for Firestore
    db.enablePersistence()
        .then(() => {
            console.log('Firestore offline persistence enabled');
        })
        .catch((err) => {
            if (err.code === 'failed-precondition') {
                console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
            } else if (err.code === 'unimplemented') {
                console.warn('The current browser does not support persistence.');
            }
        });
    
    // Tell script.js Firebase is ready
    window.dispatchEvent(new Event('firebaseReady'));
    console.log('Firebase initialized successfully');
} else {
    console.error('Firebase SDK not loaded. Please check your script tags.');
    // Dispatch event even if Firebase fails to load (for demo mode)
    window.dispatchEvent(new Event('firebaseReady'));
}

// ===== FIREBASE ADMIN FUNCTIONS =====

// Authentication helper functions
window.firebaseAuth = {
    // Sign up new admin
    async signUp(email, password) {
        try {
            const result = await auth.createUserWithEmailAndPassword(email, password);
            return { success: true, user: result.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    // Sign in admin
    async signIn(email, password) {
        try {
            const result = await auth.signInWithEmailAndPassword(email, password);
            return { success: true, user: result.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    // Sign out
    async signOut() {
        try {
            await auth.signOut();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    // Get current user
    getCurrentUser() {
        return auth.currentUser;
    },
    
    // Check if user is authenticated
    isAuthenticated() {
        return auth.currentUser !== null;
    }
};

// Firestore helper functions
window.firestoreDB = {
    // Add document to collection
    async addDocument(collection, data) {
        try {
            const docRef = await db.collection(collection).add({
                ...data,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    // Get all documents from collection
    async getCollection(collection) {
        try {
            const snapshot = await db.collection(collection).get();
            const documents = [];
            snapshot.forEach(doc => {
                documents.push({ id: doc.id, ...doc.data() });
            });
            return { success: true, data: documents };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    // Get single document
    async getDocument(collection, docId) {
        try {
            const doc = await db.collection(collection).doc(docId).get();
            if (doc.exists) {
                return { success: true, data: { id: doc.id, ...doc.data() } };
            } else {
                return { success: false, error: 'Document not found' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    // Update document
    async updateDocument(collection, docId, data) {
        try {
            await db.collection(collection).doc(docId).update({
                ...data,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    // Delete document
    async deleteDocument(collection, docId) {
        try {
            await db.collection(collection).doc(docId).delete();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    // Real-time listener for collection
    onCollectionChange(collection, callback) {
        return db.collection(collection).onSnapshot((snapshot) => {
            const documents = [];
            snapshot.forEach(doc => {
                documents.push({ id: doc.id, ...doc.data() });
            });
            callback(documents);
        });
    }
};

// Storage helper functions
window.firebaseStorage = {
    // Upload file
    async uploadFile(file, path) {
        try {
            const storageRef = storage.ref(path);
            const uploadTask = await storageRef.put(file);
            const downloadURL = await uploadTask.ref.getDownloadURL();
            return { success: true, url: downloadURL };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    // Delete file
    async deleteFile(path) {
        try {
            const storageRef = storage.ref(path);
            await storageRef.delete();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    // Get file download URL
    async getFileURL(path) {
        try {
            const storageRef = storage.ref(path);
            const url = await storageRef.getDownloadURL();
            return { success: true, url };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

// ===== INITIAL SERVICES DATA =====

// This function will populate initial data if the database is empty
window.initializeFirebaseData = async function() {
    if (!window.db) return;
    
    try {
        // Check if services collection is empty
        const servicesSnapshot = await db.collection('services').limit(1).get();
        if (servicesSnapshot.empty) {
            // Add initial services
            const initialServices = [
                {
                    name: 'Hair Styling & Coloring',
                    price: '$150 - $300',
                    description: 'Professional hair styling, cutting, and coloring services using premium products.',
                    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                    category: 'hair',
                    featured: true,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                },
                {
                    name: 'Bridal Makeup',
                    price: '$250 - $500',
                    description: 'Complete bridal makeup package with trial session and on-site services.',
                    image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                    category: 'makeup',
                    featured: true,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                },
                {
                    name: 'Facial Treatments',
                    price: '$80 - $200',
                    description: 'Luxury facial treatments including deep cleansing, hydrating, and anti-aging therapies.',
                    image: 'https://images.unsplash.com/photo-1610992015732-2d3b5e2fe2d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                    category: 'skincare',
                    featured: false,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                },
                {
                    name: 'Nail Art & Manicure',
                    price: '$40 - $120',
                    description: 'Professional nail services including manicures, pedicures, and creative nail art.',
                    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                    category: 'nails',
                    featured: false,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                },
                {
                    name: 'Spa & Wellness',
                    price: '$100 - $300',
                    description: 'Complete spa experience including massages, body treatments, and wellness therapies.',
                    image: 'https://images.unsplash.com/photo-1570172619644-dfd23ed8935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                    category: 'spa',
                    featured: true,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                },
                {
                    name: 'Hair Extensions',
                    price: '$200 - $600',
                    description: 'Premium hair extension services using high-quality human hair for natural look.',
                    image: 'https://images.unsplash.com/photo-1560069007-67bbde502c8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                    category: 'hair',
                    featured: false,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                }
            ];
            
            // Add all services
            for (const service of initialServices) {
                await db.collection('services').add(service);
            }
            console.log('Initial services data added to Firestore');
        }
        
        // Check if contact info exists
        const contactDoc = await db.collection('contact').doc('info').get();
        if (!contactDoc.exists) {
            // Add initial contact information
            await db.collection('contact').doc('info').set({
                phone: '+91 9854361547',
                email: 'fairlady45@gmail.com',
                address: '123 Luxury Lane, Beverly Hills, CA 90210',
                whatsapp: '+919854361547',
                facebook: 'https://facebook.com/fairladybeauty',
                instagram: 'https://instagram.com/fairladybeauty',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('Initial contact information added to Firestore');
        }
        
        // Check if site content exists
        const siteContentDoc = await db.collection('siteContent').doc('main').get();
        if (!siteContentDoc.exists) {
            // Add initial site content
            await db.collection('siteContent').doc('main').set({
                siteName: 'FAIR LADY BEAUTY',
                heroTitle: 'Where Beauty Meets <span>Elegance</span>',
                heroSubtitle: 'Experience the ultimate transformation at our premium beauty studio',
                heroImage: '',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('Initial site content added to Firestore');
        }
        
        // Check if admin account exists (for demo purposes)
        const adminDoc = await db.collection('admins').doc('demo-admin').get();
        if (!adminDoc.exists) {
            // Add demo admin account info
            await db.collection('admins').doc('demo-admin').set({
                email: 'fairlady45@gmail.com',
                phone: '+919854361547',
                role: 'admin',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('Demo admin account added to Firestore');
        }

        // Check if menu categories exist
        const menuCategoriesSnapshot = await db.collection('menuCategories').limit(1).get();
        if (menuCategoriesSnapshot.empty) {
            // Add initial menu categories
            const initialCategories = [
                { name: 'Hair Services', icon: 'fa-cut', createdAt: firebase.firestore.FieldValue.serverTimestamp() },
                { name: 'Facial & Skincare', icon: 'fa-spa', createdAt: firebase.firestore.FieldValue.serverTimestamp() },
                { name: 'Makeup', icon: 'fa-paint-brush', createdAt: firebase.firestore.FieldValue.serverTimestamp() },
                { name: 'Nail Services', icon: 'fa-hand-sparkles', createdAt: firebase.firestore.FieldValue.serverTimestamp() },
                { name: 'Body Treatments', icon: 'fa-heart', createdAt: firebase.firestore.FieldValue.serverTimestamp() }
            ];
            
            for (const category of initialCategories) {
                await db.collection('menuCategories').add(category);
            }
            console.log('Initial menu categories added to Firestore');
        }

        // Check if menu items exist
        const menuItemsSnapshot = await db.collection('menuItems').limit(1).get();
        if (menuItemsSnapshot.empty) {
            // Add initial menu items
            const initialMenuItems = [
                {
                    name: 'Premium Hair Spa',
                    description: 'Deep conditioning treatment with hair massage and aromatherapy',
                    price: '$120',
                    category: 'Hair Services',
                    image: 'https://images.unsplash.com/photo-1560069007-67ba8b24a822?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                    badge: 'featured',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                },
                {
                    name: 'Diamond Facial',
                    description: 'Luxury anti-aging facial with diamond dust and collagen',
                    price: '$200',
                    category: 'Facial & Skincare',
                    image: 'https://images.unsplash.com/photo-1610992015732-2d3b5e2fe2d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                    badge: 'premium',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                },
                {
                    name: 'Bridal Makeup',
                    description: 'Complete bridal makeup with trial session and on-site service',
                    price: '$350',
                    category: 'Makeup',
                    image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                    badge: 'featured',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                },
                {
                    name: 'Gel Nail Extensions',
                    description: 'Premium gel nail extensions with custom nail art',
                    price: '$80',
                    category: 'Nail Services',
                    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                    badge: 'popular',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                },
                {
                    name: 'Full Body Massage',
                    description: 'Relaxing full body massage with essential oils',
                    price: '$150',
                    category: 'Body Treatments',
                    image: 'https://images.unsplash.com/photo-1570172619644-dfd23ed8935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                    badge: 'new',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                }
            ];
            
            for (const item of initialMenuItems) {
                await db.collection('menuItems').add(item);
            }
            console.log('Initial menu items added to Firestore');
        }
    } catch (error) {
        console.error('Error initializing Firebase data:', error);
    }
};

// Initialize data when Firebase is ready
window.addEventListener('firebaseReady', () => {
    // Wait a bit to ensure everything is loaded
    setTimeout(() => {
        if (window.db) {
            window.initializeFirebaseData();
        }
    }, 1000);
});

// ===== FIREBASE SECURITY RULES =====

/* Add these security rules in Firebase Console > Firestore Database > Rules:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Anyone can read services
    match /services/{serviceId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Only authenticated users can manage bookings
    match /bookings/{bookingId} {
      allow read, write: if request.auth != null;
    }
    
    // Anyone can read contact info, only authenticated users can write
    match /contact/{documentId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Anyone can read site content, only authenticated users can write
    match /siteContent/{documentId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Only authenticated users can read/write admin collection
    match /admins/{documentId} {
      allow read, write: if request.auth != null;
    }
  }
}
*/

// ===== FIREBASE SETUP INSTRUCTIONS =====

/*
FIREBASE SETUP INSTRUCTIONS:

1. Go to https://console.firebase.google.com
2. Click "Add project" and create a new project
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password provider
   - Add your admin email address
4. Enable Firestore Database:
   - Go to Firestore Database
   - Create database in test mode (for development)
   - Later update security rules for production
5. Enable Storage:
   - Go to Storage
   - Get started
   - Update security rules for production
6. Get your Firebase configuration:
   - Go to Project settings > General
   - Under "Your apps" section, click the web icon
   - Copy the firebaseConfig object
7. Replace the firebaseConfig object in this file with your actual config
8. Create an admin user:
   - In Authentication > Users, click "Add user"
   - Add your admin email and password
9. Deploy your website:
   - Use Firebase Hosting or any static hosting service
   - Update your Firebase security rules for production

SECURITY RULES FOR PRODUCTION:

Firestore Rules:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Anyone can read services
    match /services/{serviceId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Only authenticated users can manage bookings
    match /bookings/{bookingId} {
      allow read, write: if request.auth != null;
    }
    
    // Only authenticated users can manage contact info
    match /contact/{documentId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}

Storage Rules:
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
*/
