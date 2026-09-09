// ============= 全局數據 =============
let cart = [];
let creditPoints = 100;
let selectedShipping = { method: 'home', cost: 80 };
let selectedAddress = 'home';
let selectedPayment = 'credit';
let appliedCoupons = {
    product: null,
    shipping: null
};
let currentProductDetail = null;

// ============= 商品數據庫 =============
const products = [
    {
        id: 1,
        name: '無線藍牙耳機 Pro',
        price: 2999,
        emoji: '🎧',
        category: 'headphone',
        description: '高音質無線藍牙耳機，續航力長達 30 小時，支援主動降噪功能，適合音樂愛好者。',
        coupons: ['HEADPHONE10', 'AUDIO5']
    },
    {
        id: 2,
        name: 'USB-C 高速充電線',
        price: 599,
        emoji: '🔌',
        category: 'charging',
        description: '支援 100W 快速充電，耐用編織材質，1米長度，相容多種裝置。',
        coupons: ['CABLE20', 'TECH10']
    },
    {
        id: 3,
        name: '行動電源 20000mAh',
        price: 1499,
        emoji: '🔋',
        category: 'charging',
        description: '大容量行動電源，雙 USB 輸出，支援快速充電，隨時隨地充電。',
        coupons: ['POWER12', 'BATTERY15']
    },
    {
        id: 4,
        name: '4K 高清網路攝影機',
        price: 3499,
        emoji: '📹',
        category: 'camera',
        description: '4K 超清錄製，防抖功能強大，適合直播、Vlog、會議使用。',
        coupons: ['CAMERA12', 'VIDEO15']
    },
    {
        id: 5,
        name: '無線滑鼠 2.4G',
        price: 399,
        emoji: '🖱️',
        category: 'input',
        description: '精準定位，續航長達 18 個月，靜音按鍵，工作辦公必備。',
        coupons: ['MOUSE20', 'OFFICE10']
    },
    {
        id: 6,
        name: '機械鍵盤 RGB',
        price: 1899,
        emoji: '⌨️',
        category: 'input',
        description: 'RGB 背光，機械軸體選擇，適合遊戲和辦公，聲音清脆有質感。',
        coupons: ['KEYBOARD15', 'GAMING12']
    },
    {
        id: 7,
        name: '護眼檯燈 LED',
        price: 799,
        emoji: '💡',
        category: 'computer',
        description: 'LED 護眼檯燈，三段亮度調節，減少藍光傷害，學生護眼必備。',
        coupons: ['LAMP25', 'LIGHT15']
    },
    {
        id: 8,
        name: 'USB Hub 集線器',
        price: 649,
        emoji: '🔗',
        category: 'computer',
        description: '7 個 USB 3.0 接口，高速傳輸，快速充電，辦公居家必備。',
        coupons: ['HUB15', 'TECH10']
    },
    {
        id: 9,
        name: '無線充電盤 Qi',
        price: 499,
        emoji: '⚡',
        category: 'charging',
        description: '支援 Qi 標準，快速無線充電，相容多種手機，簡潔設計。',
        coupons: ['CHARGE20', 'TECH10']
    },
    {
        id: 10,
        name: '外接硬碟 1TB SSD',
        price: 2199,
        emoji: '💾',
        category: 'storage',
        description: '1TB 容量，超快速傳輸速度，攜帶方便，數據安全有保障。',
        coupons: ['STORAGE15', 'SSD12']
    },
    {
        id: 11,
        name: '藍牙喇叭 360°',
        price: 1299,
        emoji: '🔊',
        category: 'headphone',
        description: '360° 全方位音場，防水防塵，續航 12 小時，聚會必備。',
        coupons: ['SPEAKER15', 'AUDIO10']
    },
    {
        id: 12,
        name: 'USB 讀卡機 多功能',
        price: 299,
        emoji: '📷',
        category: 'storage',
        description: '支援 SD、TF 等多種卡槽，高速讀取，輕便攜帶，攝影師必備。',
        coupons: ['CARD20', 'PHOTO10']
    },
    {
        id: 13,
        name: '散熱器 筆電冷卻墊',
        price: 599,
        emoji: '❄️',
        category: 'computer',
        description: '多檔風力調節，適配多種筆電尺寸，有效散熱降溫。',
        coupons: ['COOLER15', 'LAPTOP12']
    },
    {
        id: 14,
        name: '手機支架 可調整',
        price: 199,
        emoji: '📱',
        category: 'mobile',
        description: '360° 可調，適配各種手機平板，直播錄製必備工具。',
        coupons: ['STAND25', 'MOBILE15']
    },
    {
        id: 15,
        name: '數位相機 高清 20MP',
        price: 4999,
        emoji: '📷',
        category: 'camera',
        description: '2000 萬像素，4K 錄影，光學防抖，專業級攝影工具。',
        coupons: ['CAMERA20', 'PHOTO15']
    },
    {
        id: 16,
        name: '平板電腦 10 吋',
        price: 5999,
        emoji: '📲',
        category: 'computer',
        description: '10 吋高清螢幕，高效能處理器，長久續航，娛樂辦公二合一。',
        coupons: ['TABLET15', 'DEVICE10']
    },
    {
        id: 17,
        name: '螢幕保護貼 鋼化玻璃',
        price: 199,
        emoji: '🛡️',
        category: 'mobile',
        description: '9H 硬度鋼化玻璃，防刮防摔，清晰透光，手機必備。',
        coupons: ['PROTECTOR30', 'MOBILE15']
    },
    {
        id: 18,
        name: '手機殼 防摔矽膠',
        price: 299,
        emoji: '📱',
        category: 'mobile',
        description: '高級矽膠材質，防摔耐撞，多色可選，呵護您的手機。',
        coupons: ['CASE25', 'MOBILE12']
    },
    {
        id: 19,
        name: 'Type-C 集線器 5合1',
        price: 799,
        emoji: '🔗',
        category: 'computer',
        description: 'HDMI、USB、SD 卡槽多功能集合，筆電擴展必備。',
        coupons: ['ADAPTER15', 'TECH12']
    },
    {
        id: 20,
        name: '監視器 1080P 高清',
        price: 1599,
        emoji: '📹',
        category: 'camera',
        description: '1080P 高清畫質，夜視功能，遠程監控，家居安全監視。',
        coupons: ['MONITOR15', 'SECURITY12']
    }
];

// ============= 優惠券數據庫 =============
const coupons = {
    // 耳機相關
    'HEADPHONE10': { type: 'product', discount: 0.10, description: '藍牙耳機9折' },
    'AUDIO5': { type: 'product', discount: 0.05, description: '音頻產品95折' },
    'SPEAKER15': { type: 'product', discount: 0.15, description: '音響85折' },
    
    // 充電/電源相關
    'CABLE20': { type: 'product', discount: 0.20, description: '充電線8折' },
    'POWER12': { type: 'product', discount: 0.12, description: '行動電源88折' },
    'BATTERY15': { type: 'product', discount: 0.15, description: '電池產品85折' },
    'CHARGE20': { type: 'product', discount: 0.20, description: '充電器8折' },
    
    // 攝影/錄製
    'CAMERA12': { type: 'product', discount: 0.12, description: '攝影機88折' },
    'CAMERA20': { type: 'product', discount: 0.20, description: '相機8折' },
    'VIDEO15': { type: 'product', discount: 0.15, description: '錄製設備85折' },
    'PHOTO10': { type: 'product', discount: 0.10, description: '拍攝裝備9折' },
    'PHOTO15': { type: 'product', discount: 0.15, description: '攝影器材85折' },
    
    // 輸入設備
    'MOUSE20': { type: 'product', discount: 0.20, description: '滑鼠8折' },
    'KEYBOARD15': { type: 'product', discount: 0.15, description: '鍵盤85折' },
    'OFFICE10': { type: 'product', discount: 0.10, description: '辦公設備9折' },
    'GAMING12': { type: 'product', discount: 0.12, description: '遊戲設備88折' },
    
    // 照明
    'LAMP25': { type: 'product', discount: 0.25, description: '檯燈75折' },
    'LIGHT15': { type: 'product', discount: 0.15, description: '照明產品85折' },
    
    // 連接設備
    'HUB15': { type: 'product', discount: 0.15, description: '集線器85折' },
    'ADAPTER15': { type: 'product', discount: 0.15, description: '轉接器85折' },
    
    // 儲存設備
    'STORAGE15': { type: 'product', discount: 0.15, description: '儲存設備85折' },
    'SSD12': { type: 'product', discount: 0.12, description: 'SSD固態盤88折' },
    'CARD20': { type: 'product', discount: 0.20, description: '記憶卡8折' },
    
    // 筆電/平板
    'LAPTOP12': { type: 'product', discount: 0.12, description: '筆電配件88折' },
    'COOLER15': { type: 'product', discount: 0.15, description: '散熱器85折' },
    'TABLET15': { type: 'product', discount: 0.15, description: '平板85折' },
    'DEVICE10': { type: 'product', discount: 0.10, description: '3C設備9折' },
    
    // 手機配件
    'MOBILE12': { type: 'product', discount: 0.12, description: '手機配件88折' },
    'MOBILE15': { type: 'product', discount: 0.15, description: '手機用品85折' },
    'PROTECTOR30': { type: 'product', discount: 0.30, description: '保護貼7折' },
    'CASE25': { type: 'product', discount: 0.25, description: '手機殼75折' },
    'STAND25': { type: 'product', discount: 0.25, description: '支架75折' },
    
    // 通用3C優惠券
    'TECH10': { type: 'product', discount: 0.10, description: '3C產品9折' },
    'TECH15': { type: 'product', discount: 0.15, description: '科技產品85折' },
    
    // 監控安全
    'MONITOR15': { type: 'product', discount: 0.15, description: '監控設備85折' },
    'SECURITY12': { type: 'product', discount: 0.12, description: '安全設備88折' },
    
    // 全單優惠券
    'SAVE100': { type: 'cart', discount: 100, description: '全單折100元' },
    'SAVE200': { type: 'cart', discount: 200, description: '全單折200元' },
    'SAVE300': { type: 'cart', discount: 300, description: '全單折300元' },
    'SAVE500': { type: 'cart', discount: 500, description: '全單折500元' },
    
    // 運費優惠券
    'FREESHIP': { type: 'shipping', discount: 'free', description: '免運費' },
    'SHIP20': { type: 'shipping', discount: 20, description: '運費折20元' },
    'SHIP50': { type: 'shipping', discount: 50, description: '運費折50元' },
    
    // 組合優惠券
    'COMBO50': { type: 'product', discount: 0.10, description: '滿2件9折' },
    'TECH3C': { type: 'cart', discount: 150, description: '3C專區75折' }
};

// ============= 配送方式 =============
const shippingMethods = {
    home: { name: '宅配到家', cost: 80, description: '2-3個工作天送達' },
    cvs: { name: '超商取貨', cost: 60, description: '1-2個工作天' },
    pickup: { name: '門市自取', cost: 0, description: '當天取貨' }
};

// ============= 初始化 =============
function init() {
    loadCart();
    updateCartUI();
    updateCreditPoints();
    initCart();
    displayProducts('all');
}

// ============= 初始化購物車 =============
function initCart() {
    // 添加一些示例商品到購物車
    if (cart.length === 0) {
        addToCart(1, 1);  // 無線藍牙耳機 Pro
        addToCart(6, 1);  // 機械鍵盤 RGB
        addToCart(10, 1); // 外接硬碟 1TB SSD
    }
}

// ============= 購物車操作 =============
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            emoji: product.emoji,
            quantity: quantity,
            appliedCoupon: null
        });
    }

    saveCart();
    updateCartUI();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, quantity);
        saveCart();
        updateCartUI();
    }
}

// ============= 優惠券系統 =============
function applyProductCoupon() {
    const couponCode = document.getElementById('productCoupon').value.toUpperCase().trim();
    
    if (!couponCode) {
        alert('請輸入優惠券碼');
        return;
    }

    if (!coupons[couponCode]) {
        alert('無效的優惠券碼');
        return;
    }

    const coupon = coupons[couponCode];
    
    if (coupon.type !== 'product' && coupon.type !== 'cart') {
        alert('此優惠券不適用於商品');
        return;
    }

    appliedCoupons.product = { code: couponCode, coupon: coupon };
    alert(`✓ 優惠券 "${couponCode}" 已套用！\n${coupon.description}`);
    document.getElementById('productCoupon').value = '';
    updateCartUI();
}

function applyShippingCoupon() {
    const couponCode = document.getElementById('shippingCoupon').value.toUpperCase().trim();
    
    if (!couponCode) {
        alert('請輸入優惠券碼');
        return;
    }

    if (!coupons[couponCode]) {
        alert('無效的優惠券碼');
        return;
    }

    const coupon = coupons[couponCode];
    
    if (coupon.type !== 'shipping') {
        alert('此優惠券不適用於運費');
        return;
    }

    appliedCoupons.shipping = { code: couponCode, coupon: coupon };
    
    let info = `✓ 優惠券 "${couponCode}" 已套用！\n${coupon.description}`;
    if (coupon.discount === 'free') {
        info += '\n運費：免費';
    } else {
        info += `\n運費折優：-NT$${coupon.discount}`;
    }
    
    document.getElementById('shippingCouponInfo').textContent = coupon.description;
    document.getElementById('shippingCoupon').value = '';
}

// ============= 計算金額 =============
function calculateSubtotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function calculateDiscount() {
    let discount = 0;

    // 商品優惠券折扣
    if (appliedCoupons.product) {
        const coupon = appliedCoupons.product.coupon;
        const subtotal = calculateSubtotal();
        
        if (coupon.type === 'product') {
            if (typeof coupon.discount === 'number' && coupon.discount < 1) {
                // 百分比折扣
                discount += subtotal * coupon.discount;
            }
        } else if (coupon.type === 'cart') {
            // 全單折扣
            discount += coupon.discount;
        }
    }

    // 全單優惠券折扣（額度折扣）
    if (appliedCoupons.product && appliedCoupons.product.coupon.type === 'cart') {
        discount = appliedCoupons.product.coupon.discount;
    }

    return Math.floor(discount);
}

function calculateShippingCost() {
    let cost = selectedShipping.cost;

    // 運費優惠券
    if (appliedCoupons.shipping) {
        const coupon = appliedCoupons.shipping.coupon;
        if (coupon.discount === 'free') {
            cost = 0;
        } else {
            cost = Math.max(0, cost - coupon.discount);
        }
    }

    return cost;
}

function calculateTotal() {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const shipping = calculateShippingCost();
    return subtotal - discount + shipping;
}

// ============= UI 更新 =============
function updateCartUI() {
    const cartList = document.getElementById('cartItemsList');
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const total = calculateTotal();

    // 更新購物車計數
    document.getElementById('cartCount').textContent = cart.length;

    // 購物車為空
    if (cart.length === 0) {
        cartList.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <p>購物車是空的</p>
                <p style="font-size: 12px; margin-top: 10px;">請先選擇商品</p>
            </div>
        `;
        document.getElementById('cartItemsList').appendChild(cartList);
    } else {
        cartList.innerHTML = cart.map(item => {
            const product = products.find(p => p.id === item.id);
            return `
                <div class="cart-item">
                    <div class="item-image" onclick="showProductDetail(${item.id})">${item.emoji}</div>
                    <div class="item-details">
                        <h3 onclick="showProductDetail(${item.id})" style="cursor: pointer;">${item.name}</h3>
                        <div class="item-price">NT$${item.price.toLocaleString()}</div>
                    </div>
                    <div class="item-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <div>NT$${(item.price * item.quantity).toLocaleString()}</div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">✕</button>
                </div>
            `;
        }).join('');
    }

    // 更新摘要
    document.getElementById('subtotal').textContent = `NT$${subtotal.toLocaleString()}`;
    document.getElementById('discount').textContent = `-NT$${discount.toLocaleString()}`;
    document.getElementById('cartTotal').textContent = `NT$${total.toLocaleString()}`;
}

function updateCreditPoints() {
    document.getElementById('creditPoints').textContent = creditPoints;
}

// ============= 商品詳情 =============
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    currentProductDetail = product;

    const detailHTML = `
        <div class="product-image">${product.emoji}</div>
        <div class="product-info">
            <h2>${product.name}</h2>
            <div class="product-price">NT$${product.price.toLocaleString()}</div>
            <div class="product-desc">${product.description}</div>
            
            <div class="available-coupons">
                <h4>可用優惠券</h4>
                ${product.coupons.map(code => {
                    const coupon = coupons[code];
                    return `<div class="coupon-tag" onclick="showCouponInfo('${code}')">${coupon.description}</div>`;
                }).join('')}
            </div>

            <div class="quantity-selector">
                <label>數量：</label>
                <input type="number" id="quantityInput" value="1" min="1" max="99">
            </div>

            <button class="btn btn-primary" onclick="addToCartFromDetail()">加入購物車</button>
            <button class="btn btn-secondary" onclick="goToCart()">返回購物車</button>
        </div>
    `;

    document.getElementById('productDetail').innerHTML = detailHTML;
    switchPage('productDetailPage');
}

function addToCartFromDetail() {
    const quantity = parseInt(document.getElementById('quantityInput').value);
    addToCart(currentProductDetail.id, quantity);
    alert(`✓ 已加入購物車！${currentProductDetail.name} x${quantity}`);
    goToCart();
}

function showCouponInfo(couponCode) {
    const coupon = coupons[couponCode];
    alert(`優惠券碼：${couponCode}\n${coupon.description}`);
}

// ============= 配送頁面 =============
function selectShipping(method, element) {
    selectedShipping = shippingMethods[method];
    
    // 更新 UI
    document.querySelectorAll('.shipping-method .method-option').forEach(el => {
        el.classList.remove('selected');
    });
    element.classList.add('selected');
    element.querySelector('input[type="radio"]').checked = true;

    updatePaymentSummary();
}

function selectAddress(address, element) {
    selectedAddress = address;

    // 更新 UI
    document.querySelectorAll('.shipping-address .address-option').forEach(el => {
        el.classList.remove('selected');
    });
    element.classList.add('selected');
    element.querySelector('input[type="radio"]').checked = true;
}

// ============= 付款頁面 =============
function selectPayment(method, element) {
    selectedPayment = method;

    // 隱藏所有表單
    document.querySelectorAll('.payment-form').forEach(form => {
        form.classList.remove('active');
    });

    // 顯示選中的表單
    switch (method) {
        case 'credit':
            document.getElementById('creditCardForm').classList.add('active');
            break;
        case 'transfer':
            document.getElementById('transferForm').classList.add('active');
            break;
        case 'cvs':
            document.getElementById('cvsForm').classList.add('active');
            break;
    }

    // 更新 UI
    document.querySelectorAll('.payment-option').forEach(el => {
        el.classList.remove('selected');
    });
    element.classList.add('selected');
    element.querySelector('input[type="radio"]').checked = true;
}

function updatePaymentSummary() {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const shipping = calculateShippingCost();
    const total = calculateTotal();

    const summary = `
        <div class="summary-line">
            <span class="summary-label">商品小計：</span>
            <span class="summary-value">NT$${subtotal.toLocaleString()}</span>
        </div>
        <div class="summary-line">
            <span class="summary-label">優惠折扣：</span>
            <span class="summary-value" style="color: #51cf66;">-NT$${discount.toLocaleString()}</span>
        </div>
        <div class="summary-line">
            <span class="summary-label">配送費用：</span>
            <span class="summary-value">NT$${shipping.toLocaleString()}</span>
        </div>
        ${appliedCoupons.shipping ? `
            <div class="summary-line">
                <span class="summary-label">運費優惠券：</span>
                <span class="summary-value" style="color: #51cf66;">-NT$${
                    appliedCoupons.shipping.coupon.discount === 'free' ? selectedShipping.cost : appliedCoupons.shipping.coupon.discount
                }</span>
            </div>
        ` : ''}
        <div class="summary-line total">
            <span class="summary-label">合計金額：</span>
            <span class="summary-value">NT$${total.toLocaleString()}</span>
        </div>
    `;

    document.getElementById('paymentSummary').innerHTML = summary;
}

// ============= 訂單確認 =============
function confirmOrder() {
    if (cart.length === 0) {
        alert('購物車是空的！');
        return;
    }

    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const shipping = calculateShippingCost();
    const total = calculateTotal();

    // 生成訂單編號
    const orderId = 'ORD' + Date.now();

    // 生成訂單摘要
    const orderDetails = `
        ${cart.map(item => `
            <div class="detail-line">
                <span>${item.emoji} ${item.name} x${item.quantity}</span>
                <span>NT$${(item.price * item.quantity).toLocaleString()}</span>
            </div>
        `).join('')}
        <div class="detail-line">
            <span>運送方式：${selectedShipping.name}</span>
            <span>NT$${shipping.toLocaleString()}</span>
        </div>
        <div class="detail-line">
            <span>付款方式：${getPaymentMethodName()}</span>
        </div>
        ${discount > 0 ? `<div class="detail-line"><span>折扣優惠</span><span>-NT$${discount.toLocaleString()}</span></div>` : ''}
        <div class="detail-line" style="font-weight: bold; font-size: 16px; color: #667eea; margin-top: 10px;">
            <span>訂單總額</span>
            <span>NT$${total.toLocaleString()}</span>
        </div>
    `;

    document.getElementById('orderId').textContent = orderId;
    document.getElementById('orderDetailsContent').innerHTML = orderDetails;

    // 設置付款期限
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 3);
    document.getElementById('paymentTime').textContent = deadline.toLocaleDateString('zh-TW');

    // 清空購物車
    cart = [];
    saveCart();

    switchPage('confirmationPage');
}

function getPaymentMethodName() {
    const methods = {
        'credit': '💳 信用卡付款',
        'transfer': '🏦 銀行轉帳',
        'cod': '📦 貨到付款',
        'cvs': '🏪 超商付款'
    };
    return methods[selectedPayment] || '未選擇';
}

// ============= 頁面切換 =============
function switchPage(pageName) {
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(pageName).classList.add('active');
    window.scrollTo(0, 0);
}

function goToCart() {
    switchPage('cartPage');
    updateCartUI();
}

function goToShipping() {
    if (cart.length === 0) {
        alert('購物車是空的！');
        return;
    }
    switchPage('shippingPage');
    updatePaymentSummary();
}

function goToPayment() {
    switchPage('paymentPage');
    updatePaymentSummary();
}

function continueShopping() {
    switchPage('productsListPage');
    displayProducts('all');
}

// ============= 商品列表顯示 =============
let currentFilter = 'all';

function displayProducts(category) {
    currentFilter = category;
    
    // 更新過濾按鈕狀態
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // 過濾商品
    let filteredProducts = products;
    if (category !== 'all') {
        filteredProducts = products.filter(p => p.category === category);
    }
    
    // 生成商品卡片HTML
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-card-image">${product.emoji}</div>
            <div class="product-card-body">
                <div class="product-card-name">${product.name}</div>
                <div class="product-card-price">NT$${product.price.toLocaleString()}</div>
                <div class="product-card-footer">
                    <button class="btn btn-success" onclick="addToCart(${product.id}, 1); alert('✓ 已加入購物車');">加入購物車</button>
                    <button class="btn btn-warning" onclick="showProductDetail(${product.id});">詳情</button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterProducts(category) {
    displayProducts(category);
}

// ============= 本地存儲 =============
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('cart');
    if (saved) {
        cart = JSON.parse(saved);
    }
}

// ============= 模態框 =============
function closeConfirmModal() {
    document.getElementById('confirmModal').classList.remove('active');
}

function confirmAction() {
    closeConfirmModal();
}

// ============= 頁面加載 =============
window.addEventListener('DOMContentLoaded', init);

// ============= 鍵盤快捷鍵 =============
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeConfirmModal();
    }
});
