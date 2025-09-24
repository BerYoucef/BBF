# Reflected XSS — 0 Protection 🧪

[![Security Lab](https://img.shields.io/badge/Security-Lab-red.svg)](https://github.com/beryoucef/XSS/reflected-XSS-P0-002)
[![Node.js](https://img.shields.io/badge/Node.js-22.15.0-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-blue.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Table of Contents 📚

- [Overview](#overview-)
- [Title](#title-)
- [PoC / Exploit](#poc--exploit-)
- [Target Input Field](#target-input-field-)
- [Environment](#environment-)
- [Lab Structure](#lab-structure-)
- [How to Run / Reproduce](#how-to-run--reproduce-)
- [Expected Result](#expected-result-)
- [Fix — Output Encoding](#fix--output-encoding-)
- [Fix Verification](#fix-verification-)
- [Security Best Practices](#security-best-practices-)

## Overview 📘

This lab demonstrates **Reflected XSS (Reflected Cross-Site Scripting)** where the search input on the home page is reflected back to the user without proper encoding. When a user submits a malicious payload through the search field, it gets executed immediately in their browser. A simple payload such as `<script>alert(1)</script>` will execute when the search results are displayed. 💣

**⚠️ Educational Purpose Only**: This lab is designed for security education and testing in controlled environments.

## Title 🏷️

**Reflected XSS — 0 Protection** (Reflected Cross-Site Scripting)

## PoC / Exploit 💥

```html
<script>alert(1)</script>
<img src=x onerror="alert(1)">
<svg onload="alert(1)">
```

## Target Input Field 🔍

- **Field**: `search`
- **Page**: Home page (`/`)
- **Method**: The search query is reflected in the response without encoding
- **Trigger (Execution)**: The payload executes immediately when the search results are displayed

## Environment 🖥️

- **Node.js**: 22.15.0+
- **Express**: 5.1.0+
- **Database**: JSON (Flat File)
- **Template Engine**: EJS 

## Lab Structure 📁

```
.
└── Reflected-XSS-P0-002/
    ├── controllers/
    │   └── ProductController.js
    ├── lab2styles/
    │   ├── css/
    │   └── img/
    ├── models/
    │   └── Product-Model.js
    ├── routes/
    │   ├── home.js
    │   ├── products.js
    │   └── thanks.js
    ├── utils/
    │   ├── db.js
    │   └── html-escaping.js
    ├── views/
    │   ├── home.ejs
    │   ├── products.ejs
    │   ├── layout-lab2.ejs
    │   └── thanks.ejs
    ├── db_products.json
    ├── index.js  
    └── server.js
```

## How to Run / Reproduce ▶️

### 1. Setup

```bash
# Clone the repository
git clone https://github.com/beryoucef/BBF.git
cd BBF
cd XSS
cd reflected-xss-p0-002

# Install dependencies
node install
npm install express
npm install morgan
npm install ejs
npm install express-ejs-layouts
npm install nodemon

# Start the server
nodemon server.js
```

### 2. Access the Application

Open your browser and navigate to:
```
http://localhost:2000
```

### 3. Exploit the Vulnerability

1. Find the search box on the home page
2. Enter the XSS payload in the search field:
   ```html
   <script>alert(1)</script>
   ```
3. Submit the search form
4. Observe the search results page

### 4. Observe the Result

If vulnerable, `alert(1)` will execute immediately when the search results page loads, proving a Reflected XSS vulnerability. 🔓

## Expected Result ✅

After submitting the payload in the search field, the search results page will execute the payload and display `alert(1)` because the search query is reflected back to the page without output encoding.

**Visual Confirmation**: Alert dialog appears with the message "1"

## Fix — Output Encoding 🛡️

### Root Cause Analysis

The vulnerability occurs because:
- User input from the search parameter is reflected directly into HTML
- No output encoding is applied to special HTML characters
- The application treats user search input as trusted content

### Solution: Output Encoding

Apply **Output Encoding** (escape HTML special characters) to any user data that will be reflected into HTML.

### Escaping Functions

Create `fixes/fix-output-encoding.js`:

```javascript
// fixes/fix-output-encoding.js

/*
 * Escapes HTML special characters to prevent XSS attacks
 */
function HTMLEscaping(str) {
    let map = {
    '&': '&amp;',     
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
    };
    return str.replace(/[&<>'"]/g, function(m) {
        return map[m];
    });
}

module.exports = {HTMLEscaping}
```

### Implementation Recommendations

#### Option 1: Escape Before Rendering (Recommended)

```javascript
// In your route handler ('../routes/home.js')
const { HTMLEscaping } = require('../fixes/fix-output-encoding');

router.get('/search', (req,res) => {
    const q = req.query.q || '';
    const products = readDB();

    // Filter products based on search query
    const result = products.filter(p => {
        return p.name.toLowerCase().includes(q)
    });

    // Escape the search query before rendering
    const query = HTMLEscaping(q);

    res.render('home', {
        title: "BBF Shop",
        pageCSS: ['/css/lab2.css', '/css/shop.css', '/css/search.css'],
        layout: 'layout',
        products: result,
        query: q,
    })

})

```

#### Option 2: Template-Level Escaping

```html
<!-- In your EJS template (views/home.ejs) -->
<div class="search-result">
    <%- query %>
    <!-- The <%- %> would be dangerous (unescaped), use <%= %> for auto-escaping -->
</div>
```

## Fix Verification 🔎

### 1. Apply the Fix

Implement the output encoding solutions above.

### 2. Test the Fix

1. Submit the same payload: `<script>alert(1)</script>` into the search field
2. Check the search results page — you should **not** see an alert
3. Instead, you should see the encoded text: `<script>alert(1)</script>` displayed as plain text

### 3. Inspect the Source

Check the page source — the content should be properly encoded:

```html
&lt;script&gt;alert(1)&lt;/script&gt;
```

✅ **Success**: The payload is displayed as text, not executed as code.

### 4. URL Testing

You can also test by directly accessing:
```
http://localhost:2000/search?q=<script>alert(1)</script>
```

The page should display the encoded version without executing the script.

## Security Best Practices 🛡️

### Output Encoding Guidelines

1. **Always encode user data** when reflecting to HTML
2. **Use context-appropriate encoding** (HTML, JavaScript, URL, CSS)
3. **Prefer auto-escaping template engines** when available
4. **Validate encoding at output**, not just input
5. **Never trust user input** - always assume it's malicious

### Additional Security Measures

1. **Content Security Policy (CSP)**: Implement CSP headers to prevent inline script execution
2. **Input Validation**: Validate and sanitize input on the server side
3. **HTTP-Only Cookies**: Use HTTP-only flags for session cookies
4. **Regular Security Testing**: Perform regular XSS testing on all user input fields

### Reflected XSS vs Stored XSS

**Reflected XSS**: 
- Payload is reflected immediately in the response
- Requires user interaction (clicking a malicious link)
- Non-persistent attack

**Stored XSS**: 
- Payload is stored in the database
- Affects all users who view the affected page
- Persistent attack

## Disclaimer ⚠️

This lab is for **educational purposes only**. Do not use these techniques on applications you do not own or without explicit permission. Unauthorized testing of web applications is illegal and unethical.

---

**Happy Learning! 🎓 Stay Secure! 🔒**
