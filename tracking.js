// Tealium Tracking and Utility Functions
console.log('Tealium Test Site - Tracking script loaded');

// Helper functions for session and visitor tracking (defined early to avoid ReferenceError)
function getSessionId() {
    let sessionId = sessionStorage.getItem('tealium_session_id');
    if (!sessionId) {
        sessionId = 'SES_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('tealium_session_id', sessionId);
    }
    return sessionId;
}

function getVisitorId() {
    let visitorId = localStorage.getItem('tealium_visitor_id');
    if (!visitorId) {
        visitorId = 'VIS_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('tealium_visitor_id', visitorId);
    }
    return visitorId;
}

// Wait for Tealium to load
document.addEventListener('DOMContentLoaded', function() {
    initializeTracking();
    setupEventListeners();
    setupConsentManagement();
    
    // Log initial page load
    console.log('Page loaded with utag_data:', window.utag_data);
});

// Initialize tracking and wait for utag to be available
function initializeTracking() {
    // Check if utag is loaded
    const checkUtag = setInterval(function() {
        if (typeof window.utag !== 'undefined') {
            clearInterval(checkUtag);
            console.log('Tealium utag loaded successfully');
            
            // Set up additional tracking configurations
            setupAdvancedTracking();
        }
    }, 100);
    
    // Timeout after 10 seconds
    setTimeout(function() {
        clearInterval(checkUtag);
        if (typeof window.utag === 'undefined') {
            console.warn('Tealium utag failed to load within 10 seconds');
        }
    }, 10000);
}

// Setup advanced tracking configurations
function setupAdvancedTracking() {
    // Add custom data enrichment
    if (window.utag && window.utag.data) {
        // Add timestamp
        window.utag.data.timestamp = new Date().toISOString();
        
        // Add user agent info
        window.utag.data.user_agent = navigator.userAgent;
        window.utag.data.browser_language = navigator.language;
        
        // Add viewport info
        window.utag.data.viewport_width = window.innerWidth.toString();
        window.utag.data.viewport_height = window.innerHeight.toString();
        
        // Add referrer info
        window.utag.data.referrer = document.referrer;
        
        console.log('Advanced tracking data added');
    }
}

// Setup all event listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Track page view immediately when setup is complete
    setTimeout(() => {
        trackPageView({ 
            page_load_trigger: 'automatic',
            setup_complete: 'true'
        });
    }, 1000);
    
    // Hero CTA button
    const heroCta = document.getElementById('hero-cta');
    if (heroCta) {
        heroCta.addEventListener('click', function() {
            console.log('Hero CTA clicked');
            trackCustomEvent('cta_click', 'hero_section', {
                cta_text: this.textContent,
                cta_position: 'hero'
            });
        });
        console.log('Hero CTA listener added');
    } else {
        console.log('Hero CTA element not found');
    }
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Newsletter form submitted');
            handleNewsletterSubmission();
        });
        
        // Track form field interactions
        const emailField = document.getElementById('email');
        if (emailField) {
            emailField.addEventListener('focus', function() {
                console.log('Email field focused');
                trackCustomEvent('form_field_focus', 'newsletter', {
                    field_name: 'email'
                });
            });
        }
        console.log('Newsletter form listeners added');
    } else {
        console.log('Newsletter form not found');
    }
    
    // Navigation link tracking - with better selector
    const navLinks = document.querySelectorAll('nav a, .nav-link, .navbar a');
    console.log('Found', navLinks.length, 'navigation links');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('Navigation link clicked:', this.textContent);
            trackCustomEvent('navigation_click', 'header', {
                link_text: this.textContent,
                link_url: this.href
            });
        });
    });
    
    // Add click tracking to ALL buttons for testing
    const allButtons = document.querySelectorAll('button, .btn, input[type="button"], input[type="submit"]');
    console.log('Found', allButtons.length, 'buttons');
    allButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Button clicked:', this.textContent || this.value || this.id);
            trackCustomEvent('button_click', 'ui_interaction', {
                button_text: this.textContent || this.value || 'unknown',
                button_id: this.id || 'no_id',
                button_class: this.className || 'no_class'
            });
        });
    });
    
    // Add click tracking to ALL links for testing
    const allLinks = document.querySelectorAll('a');
    console.log('Found', allLinks.length, 'links');
    allLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Link clicked:', this.textContent, this.href);
            trackCustomEvent('link_click', 'navigation', {
                link_text: this.textContent || 'no_text',
                link_url: this.href || 'no_url',
                link_id: this.id || 'no_id'
            });
        });
    });
    
    // Scroll depth tracking
    setupScrollTracking();
    
    // Exit intent tracking
    setupExitIntentTracking();
    
    console.log('Event listeners setup complete');
}

// Custom event tracking function
function trackCustomEvent(eventName, category, additionalData = {}) {
    if (typeof window.utag === 'undefined') {
        console.warn('utag not available, queuing event:', eventName);
        return;
    }
    
    // Debug: Check if utag.link exists
    if (typeof window.utag.link !== 'function') {
        console.error('utag.link is not a function');
        return;
    }
    
    const eventData = {
        tealium_event: eventName,
        tealium_account: 'success-laura-solanes',
        tealium_profile: 'main',
        tealium_environment: 'prod',
        event_category: category,
        event_timestamp: new Date().toISOString(),
        page_url: window.location.href,
        page_title: document.title,
        page_path: window.location.pathname,
        page_referrer: document.referrer,
        session_id: getSessionId(),
        visitor_id: getVisitorId(),
        ...additionalData
    };
    
    console.log('Tracking event:', eventName, eventData);
    
    // Validate required parameters
    if (!validateEventData(eventData)) {
        console.error('❌ Event validation failed for:', eventName);
        return;
    }
    
    // Send event using utag.link
    console.log('🚀 Firing utag.link with validated data');
    window.utag.link(eventData);
}

// Track page view with custom data
function trackPageView(additionalData = {}) {
    if (typeof window.utag === 'undefined') {
        console.warn('utag not available for page view');
        return;
    }
    
    // Debug: Check if utag.view exists
    if (typeof window.utag.view !== 'function') {
        console.error('utag.view is not a function');
        return;
    }
    
    const pageData = {
        tealium_event: 'page_view',
        tealium_account: 'success-laura-solanes',
        tealium_profile: 'main',
        tealium_environment: 'prod',
        page_url: window.location.href,
        page_title: document.title,
        page_path: window.location.pathname,
        page_referrer: document.referrer,
        page_timestamp: new Date().toISOString(),
        session_id: getSessionId(),
        visitor_id: getVisitorId(),
        ...additionalData
    };
    
    console.log('Tracking page view:', pageData);
    
    // Validate required parameters
    if (!validateEventData(pageData)) {
        console.error('❌ Page view validation failed');
        return;
    }
    
    // Send page view using utag.view
    console.log('🚀 Firing utag.view with validated data');
    window.utag.view(pageData);
}

// E-commerce tracking functions
function trackProductView(productId, productName, price, category) {
    trackCustomEvent('product_view', 'ecommerce', {
        product_id: productId,
        product_name: productName,
        product_price: price,
        product_category: category
    });
}

function trackAddToCart(productId, productName, price, quantity = 1) {
    trackCustomEvent('cart_add', 'ecommerce', {
        product_id: productId,
        product_name: productName,
        product_price: price,
        product_quantity: quantity.toString(),
        cart_value: (parseFloat(price) * quantity).toString()
    });
    
    // Update cart totals in data layer
    updateCartTotals();
}

function trackRemoveFromCart(productId, productName, price, quantity = 1) {
    trackCustomEvent('cart_remove', 'ecommerce', {
        product_id: productId,
        product_name: productName,
        product_price: price,
        product_quantity: quantity.toString()
    });
    
    updateCartTotals();
}

function trackPurchase(orderId, orderValue, items) {
    trackCustomEvent('purchase', 'ecommerce', {
        order_id: orderId,
        order_value: orderValue,
        order_items: items.toString(),
        order_timestamp: new Date().toISOString()
    });
}

// Search tracking
function trackSearch(searchTerm, searchResults, searchFilters = {}) {
    trackCustomEvent('search', 'site_search', {
        search_keyword: searchTerm,
        search_results: searchResults.toString(),
        search_filters: JSON.stringify(searchFilters)
    });
}

// User authentication tracking
function trackUserLogin(userId, userType = 'member') {
    trackCustomEvent('user_login', 'authentication', {
        user_id: userId,
        user_type: userType,
        login_timestamp: new Date().toISOString()
    });
    
    // Update global user data
    if (window.utag_data) {
        window.utag_data.user_id = userId;
        window.utag_data.is_logged_in = '1';
        window.utag_data.customer_type = userType;
    }
}

function trackUserLogout() {
    trackCustomEvent('user_logout', 'authentication', {
        logout_timestamp: new Date().toISOString()
    });
    
    // Clear user data
    if (window.utag_data) {
        window.utag_data.user_id = '';
        window.utag_data.is_logged_in = '0';
        window.utag_data.customer_type = 'guest';
    }
}

// Social sharing tracking
function shareOnSocial(platform) {
    trackCustomEvent('social_share', 'social', {
        social_network: platform,
        shared_url: window.location.href,
        shared_title: document.title
    });
    
    // Simulate social sharing (in real implementation, would open sharing dialog)
    console.log(`Sharing on ${platform}:`, window.location.href);
    alert(`Sharing on ${platform} - Event tracked!`);
}

// Newsletter form handling
function handleNewsletterSubmission() {
    const email = document.getElementById('email').value;
    const preferences = document.getElementById('preferences').value;
    
    trackCustomEvent('newsletter_signup', 'engagement', {
        newsletter_email: email,
        newsletter_preferences: preferences
    });
    
    // Update user subscription status
    if (window.utag_data) {
        window.utag_data.has_newsletter_subscription = '1';
    }
    
    alert('Newsletter signup tracked! Check console for details.');
    document.getElementById('newsletter-form').reset();
}

// Show newsletter form
function showNewsletterForm() {
    const section = document.getElementById('newsletter-section');
    if (section) {
        section.style.display = 'block';
        section.scrollIntoView({ behavior: 'smooth' });
        
        trackCustomEvent('newsletter_form_view', 'engagement', {
            form_trigger: 'button_click'
        });
    }
}

// Scroll depth tracking
function setupScrollTracking() {
    let scrollDepths = [25, 50, 75, 100];
    let trackedDepths = [];
    
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        scrollDepths.forEach(depth => {
            if (scrollPercent >= depth && !trackedDepths.includes(depth)) {
                trackedDepths.push(depth);
                trackCustomEvent('scroll_depth', 'engagement', {
                    scroll_percentage: depth.toString()
                });
            }
        });
    });
}

// Exit intent tracking
function setupExitIntentTracking() {
    let exitIntentTriggered = false;
    
    document.addEventListener('mouseleave', function(e) {
        if (e.clientY <= 0 && !exitIntentTriggered) {
            exitIntentTriggered = true;
            trackCustomEvent('exit_intent', 'engagement', {
                time_on_page: (Date.now() - performance.timing.navigationStart).toString()
            });
        }
    });
}

// Cart management functions
function updateCartTotals() {
    // This would typically pull from localStorage or a cart API
    // For demo purposes, we'll simulate cart data
    const mockCartItems = JSON.parse(localStorage.getItem('cart_items') || '[]');
    const totalItems = mockCartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = mockCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (window.utag_data) {
        window.utag_data.cart_total_items = totalItems.toString();
        window.utag_data.cart_total_value = totalValue.toFixed(2);
    }
}

// Consent Management
function setupConsentManagement() {
    const consentBanner = document.getElementById('consent-banner');
    const acceptAllBtn = document.getElementById('accept-all');
    const rejectAllBtn = document.getElementById('reject-all');
    const managePrefsBtn = document.getElementById('manage-preferences');
    
    // Check if consent has already been given
    const consentStatus = localStorage.getItem('tealium_consent');
    if (consentStatus) {
        if (consentBanner) {
            consentBanner.style.display = 'none';
        }
    }
    
    if (acceptAllBtn) {
        acceptAllBtn.addEventListener('click', function() {
            handleConsent('accept_all');
        });
    }
    
    if (rejectAllBtn) {
        rejectAllBtn.addEventListener('click', function() {
            handleConsent('reject_all');
        });
    }
    
    if (managePrefsBtn) {
        managePrefsBtn.addEventListener('click', function() {
            window.location.href = 'consent.html';
        });
    }
}

function handleConsent(action) {
    const consentData = {
        status: action,
        timestamp: new Date().toISOString(),
        categories: action === 'accept_all' ? ['analytics', 'marketing', 'functional'] : ['functional']
    };
    
    // Store consent
    localStorage.setItem('tealium_consent', JSON.stringify(consentData));
    
    // Track consent event
    trackCustomEvent('consent_update', 'privacy', {
        consent_action: action,
        consent_categories: consentData.categories.join(',')
    });
    
    // Hide consent banner
    const consentBanner = document.getElementById('consent-banner');
    if (consentBanner) {
        consentBanner.style.display = 'none';
    }
    
    // If using Tealium's consent management, you would call:
    // window.utag.gdpr.setConsentValue(consentData.categories);
    
    console.log('Consent updated:', consentData);
}

// Debug and utility functions
function showDebugInfo() {
    const modal = document.getElementById('debug-modal');
    const utagDataDisplay = document.getElementById('utag-data-display');
    const tealiumStatus = document.getElementById('tealium-status');
    
    if (modal && utagDataDisplay && tealiumStatus) {
        // Display current utag_data
        utagDataDisplay.textContent = JSON.stringify(window.utag_data || {}, null, 2);
        
        // Display Tealium status
        const status = {
            utag_loaded: typeof window.utag !== 'undefined',
            utag_version: window.utag ? window.utag.cfg.v : 'N/A',
            account: window.utag ? window.utag.cfg.account : 'N/A',
            profile: window.utag ? window.utag.cfg.profile : 'N/A',
            environment: window.utag ? window.utag.cfg.env : 'N/A',
            consent_status: localStorage.getItem('tealium_consent'),
            page_load_time: performance.timing.loadEventEnd - performance.timing.navigationStart
        };
        
        tealiumStatus.textContent = JSON.stringify(status, null, 2);
        
        modal.style.display = 'block';
    }
}

function closeDebugModal() {
    const modal = document.getElementById('debug-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function clearDataLayer() {
    if (confirm('Are you sure you want to clear the data layer? This will reset all tracking data.')) {
        // Reset utag_data to defaults
        window.utag_data = {
            tealium_event: 'page_view',
            page_type: 'home',
            page_name: document.title,
            site_section: 'home',
            country_code: 'US',
            currency_code: 'USD',
            customer_type: 'guest',
            cart_total_items: '0',
            cart_total_value: '0.00',
            user_id: '',
            is_logged_in: '0'
        };
        
        // Clear localStorage
        localStorage.removeItem('tealium_consent');
        localStorage.removeItem('cart_items');
        
        console.log('Data layer cleared');
        alert('Data layer has been reset!');
    }
}

// Simulate form validation errors for testing
function simulateFormError(formElement) {
    trackCustomEvent('form_error', 'form_interaction', {
        form_name: formElement.id || 'unknown',
        error_type: 'validation_error'
    });
}

// Time on page tracking
let startTime = Date.now();
window.addEventListener('beforeunload', function() {
    const timeOnPage = Date.now() - startTime;
    trackCustomEvent('page_exit', 'engagement', {
        time_on_page: timeOnPage.toString()
    });
});

// Error tracking
window.addEventListener('error', function(e) {
    trackCustomEvent('javascript_error', 'error', {
        error_message: e.message,
        error_filename: e.filename,
        error_lineno: e.lineno.toString()
    });
});

// Performance tracking
window.addEventListener('load', function() {
    setTimeout(function() {
        const perfData = performance.timing;
        trackCustomEvent('performance_metrics', 'technical', {
            dom_loading_time: (perfData.domContentLoadedEventEnd - perfData.navigationStart).toString(),
            page_load_time: (perfData.loadEventEnd - perfData.navigationStart).toString(),
            dns_lookup_time: (perfData.domainLookupEnd - perfData.domainLookupStart).toString()
        });
    }, 1000);
});

// Validate event data has required Tealium parameters
function validateEventData(eventData) {
    const requiredParams = ['tealium_event', 'tealium_account', 'tealium_profile'];
    const missing = requiredParams.filter(param => !eventData[param]);
    
    if (missing.length > 0) {
        console.error('❌ Missing required Tealium parameters:', missing);
        return false;
    }
    
    console.log('✅ Event data validation passed');
    return true;
}

// Test function to manually fire events for debugging
function testEventFiring() {
    console.log('=== TESTING EVENT FIRING ===');
    console.log('Utag available:', typeof window.utag !== 'undefined');
    console.log('Utag.link available:', typeof window.utag?.link === 'function');
    console.log('Utag.view available:', typeof window.utag?.view === 'function');
    console.log('Utag object:', window.utag);
    
    if (typeof window.utag !== 'undefined') {
        console.log('🔥 Firing test utag.link event...');
        trackCustomEvent('debug_test_event', 'testing', { test_source: 'manual' });
        
        console.log('🔥 Firing test utag.view event...');
        trackPageView({ test_pageview: 'manual' });
        
        // Test direct utag calls
        console.log('🔥 Testing direct utag.link call...');
        window.utag.link({
            tealium_event: 'direct_test_link',
            tealium_account: 'success-laura-solanes',
            tealium_profile: 'main',
            tealium_environment: 'prod',
            test_type: 'direct_utag_call',
            timestamp: new Date().toISOString()
        });
        
        console.log('🔥 Testing direct utag.view call...');
        window.utag.view({
            tealium_event: 'direct_test_view',
            tealium_account: 'success-laura-solanes',
            tealium_profile: 'main',
            tealium_environment: 'prod',
            test_type: 'direct_utag_call',
            timestamp: new Date().toISOString()
        });
        
        console.log('✅ All test events fired! Check console for "trigger: link" and "trigger: view" messages');
        console.log('💡 If you don\'t see "trigger" messages, run: document.cookie="utagdb=true"; then refresh');
    } else {
        console.error('❌ Utag is not loaded! Make sure you are serving the site via HTTP/HTTPS');
    }
}

// Export functions for global use
window.TealiumTracker = {
    trackCustomEvent,
    trackPageView,
    trackProductView,
    trackAddToCart,
    trackRemoveFromCart,
    trackPurchase,
    trackSearch,
    trackUserLogin,
    trackUserLogout,
    shareOnSocial,
    handleConsent,
    showDebugInfo,
    clearDataLayer,
    getSessionId,
    getVisitorId,
    testEventFiring,
    validateEventData
};

console.log('Tealium tracking functions initialized'); 