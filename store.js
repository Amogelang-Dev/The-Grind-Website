(() => {
    const keys = {
        products: 'menu_items',
        orders: 'active_orders',
        inventory: 'inventory_items'
    };

    const defaultProducts = [
        { id: 'flat-white', name: 'Flat White', category: 'Hot Drinks', price: 45, description: 'Smooth espresso blended with velvety steamed milk.', image: 'images/flat-white.jpeg' },
        { id: 'cortado', name: 'Cortado', category: 'Hot Drinks', price: 40, description: 'Equal parts espresso and warm silky milk.', image: 'images/cortado.jpeg' },
        { id: 'americano', name: 'Americano', category: 'Hot Drinks', price: 35, description: 'Rich espresso shots topped with hot water.', image: 'images/americano.jpeg' },
        { id: 'cappuccino', name: 'Cappuccino', category: 'Hot Drinks', price: 42, description: 'Espresso with steamed milk and a deep foam layer.', image: 'images/cuppacino.jpeg' },
        { id: 'nitro-cold-brew', name: 'Nitro Cold Brew', category: 'Cold Drinks', price: 50, description: 'Cold-brewed coffee charged with nitrogen.', image: 'images/flat-white.jpeg' },
        { id: 'iced-latte', name: 'Iced Latte', category: 'Cold Drinks', price: 45, description: 'Chilled espresso over milk and ice.', image: 'images/iced-latte.jpeg' },
        { id: 'croissant', name: 'Artisanal Croissant', category: 'Food', price: 35, description: 'Flaky butter croissant baked fresh daily.', image: 'images/shakshuka.jpeg' },
        { id: 'avocado-toast', name: 'Avocado Toast', category: 'Food', price: 65, description: 'Smashed avocado on toasted sourdough with seeds.', image: 'images/smashed-avocado-toast.jpeg' }
    ];

    const defaultInventory = [
        { id: 'beans', name: 'Espresso beans', unit: 'kg', quantity: 8, minimum: 3 },
        { id: 'whole-milk', name: 'Whole milk', unit: 'L', quantity: 12, minimum: 4 },
        { id: 'oat-milk', name: 'Oat milk', unit: 'L', quantity: 4, minimum: 2 },
        { id: 'cups', name: 'Takeaway cups', unit: 'pcs', quantity: 150, minimum: 40 },
        { id: 'syrup', name: 'Vanilla syrup', unit: 'bottles', quantity: 3, minimum: 1 }
    ];

    function read(key, fallback) {
        try {
            const value = JSON.parse(localStorage.getItem(key));
            return Array.isArray(value) ? value : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function write(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
        window.dispatchEvent(new CustomEvent('grind:updated', { detail: { key } }));
    }

    function getProducts() {
        return [...defaultProducts, ...getCustomProducts()];
    }

    function getCustomProducts() {
        return read(keys.products, []).map((item, index) => ({
            id: item.id || `custom-${index}-${String(item.name || 'item').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            name: String(item.name || 'House special'),
            category: item.category || 'Hot Drinks',
            price: Number(item.price) || 0,
            description: item.description || 'A freshly added house special.',
            image: item.image || 'images/americano.jpeg'
        }));
    }

    function saveCustomProducts(products) {
        write(keys.products, products);
    }

    function getOrders() {
        return read(keys.orders, []);
    }

    function saveOrders(orders) {
        write(keys.orders, orders);
    }

    function createOrder({ customerName, product, paymentMethod }) {
        const order = {
            id: `GRND-${Date.now().toString().slice(-6)}`,
            customer_name: customerName.trim(),
            item_name: product.name,
            total: Number(product.price),
            payment_method: paymentMethod,
            status: 'Pending',
            created_at: new Date().toISOString()
        };
        saveOrders([order, ...getOrders()]);
        return order;
    }

    function getInventory() {
        return read(keys.inventory, defaultInventory);
    }

    function saveInventory(items) {
        write(keys.inventory, items);
    }

    function formatPrice(value) {
        return `R ${Number(value).toFixed(2)}`;
    }

    function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, character => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[character]);
    }

    window.GrindStore = {
        defaultProducts,
        keys,
        getProducts,
        getCustomProducts,
        saveCustomProducts,
        getOrders,
        saveOrders,
        createOrder,
        getInventory,
        saveInventory,
        formatPrice,
        escapeHtml
    };
})();