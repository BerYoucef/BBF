# Stored XSS — 0 Protection 🧪

[![Security Lab](https://img.shields.io/badge/Security-Lab-red.svg)](https://github.com/beryoucef/XSS/stored-XSS-P0-001)
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

This lab demonstrates **Stored XSS (Stored Cross-Site Scripting)** where the comments input on a product page is stored in a JSON-based data store and rendered into HTML without output encoding. A simple payload such as `<script>alert(1)</script>` will execute when viewing the affected product page. 💣

**⚠️ Educational Purpose Only**: This lab is designed for security education and testing in controlled environments.

## Title 🏷️

**Stored XSS — 0 Protection** (Stored Cross-Site Scripting)

## PoC / Exploit 💥

```html
<script>alert(1)</script>
```

## Target Input Field 🔍

- **Field**: `comments`
- **Page**: Product page (e.g. `/product?productid=4`)
- **Storage**: Comments are saved to the JSON DB and later injected into the product HTML without encoding

## Environment 🖥️

- **Node.js**: 22.15.0+
- **Express**: 5.1.0+
- **Database**: JSON (Flat File)
- **Template Engine**: EJS 

## Lab Structure 📁

```
.
└── Stored-XSS-P0-001/
    ├── controllers/
    │   └── ProductController.js
    ├── lab2styles/
    │   ├── css/
    │   └── img/
    ├── models/
    │   └── Product-Model.js
    ├── routes/
    │   ├── home.js
    │   ├── home0.js
    │   └── thanks.js
    ├── utils/
    │   ├── db.js
    │   └── html-escaping.js
    ├── views/
    │   ├── home.ejs
    │   ├── home0.ejs
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
cd XSS
cd stored-xss-0-protection

# Install dependencies
npm install
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

1. Navigate to the product page
2. Find the comments section
3. Submit a comment containing the XSS payload:
   ```html
   <script>alert(1)</script>
   ```
4. Reload the page or navigate back to the product page

### 4. Observe the Result

If vulnerable, `alert(1)` will execute, proving a Stored XSS vulnerability. 🔓

## Expected Result ✅

After the payload is stored in `db_products.json`, the product page will execute the payload and display `alert(1)` because comments are rendered without output encoding.

**Visual Confirmation**: Alert dialog appears with the message "1"

## Fix — Output Encoding 🛡️

### Root Cause Analysis

The vulnerability occurs because:
- Untrusted user data from the database is rendered directly into HTML
- No output encoding is applied to special HTML characters
- The application treats user input as trusted content

### Solution: Output Encoding

Apply **Output Encoding** (escape HTML special characters) to any data that will be injected into HTML.

### Escaping Functions

Create `fixes/fix-output-encoding.js`:

```javascript
// fixes/fix-output-encoding.js

/*
 * Escapes HTML special characters to prevent XSS attacks
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  
  return str.replace(/[&<>"']/g, function(match) { 
    return map[match]; 
  });
}

/*
 * Recursively escapes all string values in an object/array
 */
function escapeJsonValues(obj) {
  if (typeof obj === 'string') {
    return escapeHtml(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(escapeJsonValues);
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const escapedObj = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        escapedObj[key] = escapeJsonValues(obj[key]);
      }
    }
    return escapedObj;
  }
  
  return obj;
}

module.exports = { escapeHtml, escapeJsonValues };
```

### Implementation Recommendations

#### Option 1: Escape Before Rendering (Recommended)

```javascript
// In your route handler ('../routes/home.js') => ('../controllers/ProductController.js')
const { escapeJsonValues } = require('./fixes/fix-output-encoding');

function ShowProductPage(req, res) {
    const productID = parseInt(req.query.productid); /* get param from query  */
    const products = readDB()
    const product = products.find(p => p.id === productID);
    if(!product) return res.status(404).send('product not found');
    
    const escapedProduct = escapeJsonValues(product);

    res.render('home', {
        title: 'Stored XSS Lab - Threat\'D\'en',
        pageCSS: '/css/lab2.css',
        layout: 'layout-lab2',
        product: escapedProduct,
    })
}

```

## Fix Verification 🔎

### 1. Apply the Fix

Implement the output encoding solutions above.

### 2. Test the Fix

1. Submit the same payload: `<script>alert(1)</script>` into the comments field
2. Open the product page — you should **not** see an alert
3. Instead, you should see the encoded text: `<script>alert(1)</script>` ,
because if the output encoding didn't work you'll took an alert and the comment'll be empty

### 3. Inspect the Source

Check the page source — the content should be properly encoded:

```html
<p class="comment-text">&lt;script&gt;alert(1)&lt;/script&gt;</p>
```

✅ **Success**: The payload is displayed as text, not executed as code.

## Security Best Practices 🛡️

### Output Encoding Guidelines

1. **Always encode user data** when rendering to HTML
2. **Use context-appropriate encoding** (HTML, JavaScript, URL, CSS)
3. **Prefer auto-escaping template engines** when available
4. **Validate encoding at output**, not just input



## Disclaimer ⚠️

This lab is for **educational purposes only**. Do not use these techniques on applications you do not own or without explicit permission. Unauthorized testing of web applications is illegal and unethical.

---

**Happy Learning! 🎓 Stay Secure! 🔒**
