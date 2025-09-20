
function escapeHtml(product) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    return product.replace(/[&<>"']/g, function(m) { return map[m]; });
}

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


module.exports = {escapeHtml, escapeJsonValues}


