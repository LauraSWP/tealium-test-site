# Tealium Test Website

A comprehensive testing environment for Tealium's utag.js implementation with the **success-laura-solanes** account and **dog-food** profile.

## 🚀 Quick Start

1. Open `index.html` in your web browser
2. Open browser Developer Tools (F12) to view console logs
3. Navigate through different pages to test various tracking scenarios
4. Use the debug tools and testing controls throughout the site

## 📋 Features Overview

### 🏠 Homepage (`index.html`)
- **Page View Tracking**: Standard page view events with comprehensive data layer
- **Event Tracking**: CTA clicks, form interactions, social sharing
- **Engagement Tracking**: Scroll depth, exit intent, time on page
- **Consent Management**: Privacy banner with granular consent options
- **Performance Tracking**: Page load times, DOM events

### 🛍️ Products Page (`products.html`)
- **E-commerce Tracking**: Product views, cart actions, purchase funnel
- **Product Interactions**: View details, add to cart, wishlist actions
- **Recommendation Tracking**: Product recommendations and cross-selling
- **Filtering & Search**: Product catalog filtering with event tracking
- **Recently Viewed**: Product viewing history with tracking

### 🔍 Search Page (`search.html`)
- **Search Event Tracking**: Query tracking, result counts, filters applied
- **Auto-complete**: Search suggestions with interaction tracking
- **Search Results**: Click-through tracking, result position analytics
- **No Results Tracking**: Failed search queries and alternative suggestions
- **Search Performance**: Response times and search quality metrics

### 🛒 Cart Page (`cart.html`)
- **Cart Management**: Add/remove items, quantity changes, cart updates
- **Checkout Flow**: Funnel tracking, abandonment detection
- **Promo Codes**: Discount application and validation tracking
- **Recommendations**: Cross-sell and upsell tracking in cart context
- **Cart Analytics**: Value tracking, item count, session duration

### 👤 Login Page (`login.html`)
- **Authentication Events**: Login/logout, signup, social authentication
- **User Identification**: User ID setting, customer type classification
- **Failed Login Tracking**: Security events, account lockouts
- **User Journey**: Session tracking, user behavior analytics
- **Account Management**: Profile updates, preferences, order history

### 🔒 Consent Page (`consent.html`)
- **Privacy Compliance**: GDPR, CCPA compliance testing
- **Granular Consent**: Category-specific consent management
- **Consent History**: Audit trail of consent changes
- **Data Rights**: Access, correction, deletion, portability requests
- **Consent Analytics**: Opt-in rates, category preferences

## 🎯 Tealium Configuration

### Account Details
- **Account**: `success-laura-solanes`
- **Profile**: `dog-food`
- **Environment**: `qa` (for testing)

### Universal Tag Implementation
```javascript
// Tealium Universal Tag
(function(a,b,c,d) {
    a='//tags.tiqcdn.com/utag/success-laura-solanes/dog-food/qa/utag.js';
    b=document;c='script';d=b.createElement(c);d.src=a;
    d.type='text/java'+c;d.async=true;
    a=b.getElementsByTagName(c)[0];a.parentNode.insertBefore(d,a)
})();
```

### Data Layer Structure
Every page includes a comprehensive `utag_data` object with:
```javascript
var utag_data = {
    "tealium_event": "page_view",
    "page_type": "home|catalog|search|cart|login|consent",
    "page_name": "Page Title",
    "site_section": "section_name",
    "country_code": "US",
    "currency_code": "USD",
    "customer_type": "guest|member|premium",
    "cart_total_items": "0",
    "cart_total_value": "0.00",
    "user_id": "",
    "is_logged_in": "0"
};
```

## 🧪 Testing Scenarios

### E-commerce Flow
1. **Product Discovery**: Browse products → View product details → Add to cart
2. **Cart Management**: Update quantities → Apply promo codes → Proceed to checkout
3. **Purchase Funnel**: Track each step of checkout process
4. **Post-Purchase**: Order confirmation, email tracking

### User Authentication
1. **Guest Experience**: Browse as anonymous user
2. **Registration**: Create new account with tracking
3. **Login Flow**: Authenticate existing user
4. **Profile Management**: Update preferences, view history

### Search & Discovery
1. **Search Journey**: Enter query → View results → Click products
2. **Filtering**: Apply category/price filters with tracking
3. **Auto-complete**: Test search suggestions
4. **No Results**: Handle failed searches

### Privacy & Consent
1. **Initial Consent**: First-time visitor consent flow
2. **Consent Management**: Update privacy preferences
3. **Data Rights**: Request data access/deletion
4. **Compliance**: Test GDPR/CCPA scenarios

## 🔧 Debug Tools

### Built-in Debug Features
- **Debug Modal**: View current `utag_data` and Tealium status
- **Console Logging**: All events logged to browser console
- **Data Export**: Download consent and cart data
- **Testing Controls**: Simulate various scenarios on each page

### Browser Developer Tools
1. **Console**: View all tracking events and data layer updates
2. **Network Tab**: Monitor `utag.js` loading and beacon requests
3. **Application Tab**: Check localStorage for user data and consent
4. **Sources Tab**: Inspect loaded Tealium scripts and extensions

### Tealium Tools
- **Universal Tag Debugger**: Real-time validation of data layer and tracking
- **Web Companion**: Browser extension for tag configuration
- **EventStream Live Events**: Monitor incoming events in real-time

## 📊 Event Categories

### Core Events
- `page_view`: Standard page tracking
- `click`: Button and link interactions
- `form_submit`: Form completion tracking
- `scroll_depth`: Engagement measurement
- `exit_intent`: Session abandonment detection

### E-commerce Events
- `product_view`: Product detail views
- `cart_add`/`cart_remove`: Cart modifications
- `checkout_initiated`: Purchase funnel entry
- `purchase`: Transaction completion
- `product_impression`: Product list views

### User Events
- `user_login`/`user_logout`: Authentication state
- `user_signup`: New account creation
- `profile_update`: Account modifications
- `consent_update`: Privacy preference changes

### Search Events
- `search`: Query submission
- `search_result_click`: Result interactions
- `search_no_results`: Failed searches
- `search_suggestion_click`: Auto-complete usage

## 🎨 Customization

### Adding New Events
1. Use the global `TealiumTracker` object:
```javascript
window.TealiumTracker.trackCustomEvent('event_name', 'category', {
    custom_parameter: 'value'
});
```

### Modifying Data Layer
Update `utag_data` before the Universal Tag loads:
```javascript
window.utag_data.custom_field = 'custom_value';
```

### Testing Custom Scenarios
Use the testing control buttons on each page or create custom functions:
```javascript
function customTest() {
    // Your custom tracking logic
    window.TealiumTracker.trackCustomEvent('custom_test', 'testing', {
        test_parameter: 'test_value'
    });
}
```

## 🚨 Troubleshooting

### Common Issues
1. **utag.js not loading**: Check network connectivity and account/profile names
2. **Events not firing**: Verify `utag` object is loaded before calling tracking functions
3. **Data layer issues**: Ensure `utag_data` is set before `utag.js` loads
4. **Console errors**: Check for JavaScript errors that might prevent tracking

### Validation Steps
1. **Check Console**: Look for Tealium loading messages and event logs
2. **Network Tab**: Verify `utag.js` loads successfully (status 200)
3. **Debug Modal**: Use built-in debug tools to inspect data layer
4. **Tealium Debugger**: Install Universal Tag Debugger for real-time validation

## 📝 Best Practices

### Implementation
- Always load `utag_data` before `utag.js`
- Use vendor-neutral variable names
- Include comprehensive page metadata
- Implement error handling for tracking functions

### Testing
- Test across different browsers and devices
- Validate both successful and error scenarios
- Check consent management functionality
- Verify data layer accuracy

### Maintenance
- Regularly update event parameters
- Monitor for JavaScript errors
- Keep tracking functions consistent across pages
- Document custom implementations

## 🔗 Useful Resources

- [Tealium Documentation](https://docs.tealium.com/)
- [Universal Tag Guide](https://docs.tealium.com/platforms/javascript/install/)
- [Data Layer Best Practices](https://docs.tealium.com/platforms/getting-started-web/data-layer/)
- [Universal Tag Debugger](https://docs.tealium.com/platforms/javascript/debugging/)

---

**Note**: This is a testing environment using the QA environment. For production implementation, update the Universal Tag to use the `prod` environment and ensure all tracking requirements are properly configured in your Tealium account. 