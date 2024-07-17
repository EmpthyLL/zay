$.getJSON('assets/js/product.json', function(result) {
    const allProduct = [];
    let allVendor = {};
    let shopcards = '';

    $.each(result, function(i, field) {
        allProduct.push(field);
        const discountPrice = (field.price - (field.price * field.discount_percentage) / 100).toFixed(2);
        shopcards += `
            <div class="col-md-4 prod-card">
                <div class="card mb-4 product-wap rounded-0">
                    <div class="card rounded-0">
                        <img class="card-img rounded-0 img-fluid" src="${field.images[1]}" alt="${field.title}">
                        <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                            <ul class="list-unstyled">
                                <li><a class="btn btn-success text-white menuIcon" href="#"><i class="far fa-heart menuIcon"></i></a></li>
                                <li><a class="btn btn-success text-white mt-2" href="shop-single.html"><i class="far fa-eye"></i></a></li>
                                <li><a class="btn btn-success text-white mt-2 menuIcon addToCart" data-index="${i}" href="#"><i class="fas fa-cart-plus menuIcon addToCart" data-index="${i}"></i></a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-body">
                        <a href="shop-single.html" class="h3 text-decoration-none text-center d-flex justify-content-center">${field.title}</a>
                        <ul class="w-100 list-unstyled d-flex justify-content-center mb-0">
                            <li class='store'>${field.shop.name}</li>
                        </ul>
                        <p class="text-center mb-0"><span class='fs-5 text-decoration-line-through'>$${field.price}</span> <span class='fs-6'>$${discountPrice}</span></p>
                    </div>
                </div>
            </div>
        `;
    });

    $('.product-list').html(shopcards);

    allProduct.forEach(prod => {
        const shopName = prod.shop.name;
        if (!allVendor[shopName]) {
            allVendor[shopName] = [];
        }
    });

    let itemCart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
    let checkList = JSON.parse(localStorage.getItem('checked') || '[]');

    itemCart.forEach(item => {
        const product = allProduct[item];
        if (product && product.shop && product.shop.name) {
            allVendor[product.shop.name].push(product);
        }
    });

    function renderProducts(products, vendorIndex) {
        if (products.length > 0) {
            return products.map((product, i) => `
                <div class="vendors-prod">
                    <div class="prod-det">
                        <div class='veven'>
                            <input type="checkbox" class="form-check-input cekitem" data-index='${product.id - 1}' data-key='${vendorIndex}-${i}'>
                            <img src="${product.images[0]}" alt="${product.title}" class="prod-img">
                            <div class="prod-des">
                                <p class="fs-5">${product.title}</p>
                                <p class="fs-6">${product.description}</p>
                            </div>
                        </div>
                        <div class="quantity">
                            <p><span class="fs-4 text-decoration-line-through">$${product.price}</span> <span class="fs-6 price">$${(product.price - (product.price * product.discount_percentage) / 100).toFixed(2)}</span></p>
                            <div class="iconquan">
                                <a href="#" class="linkdel menuIcon"
                                        data-toggle="popover"
                                        data-bs-content="${product.discount_percentage}% Discount"
                                        data-placement="right" data-trigger="focus">
                                    <ion-icon class="quanti can menuIcon note" name="document-text-outline"></ion-icon>
                                </a>
                                <a href="#" class="linkdel"><ion-icon class="quanti can hapusaja" data-key='${vendorIndex}-${i}' name="trash-outline"></ion-icon></a>
                                <ul class="list-inline pb-3">
                                    <li class="list-inline-item"><span class="btn btn-success plusmin minus" id="btn-minus">-</span></li>
                                    <li class="list-inline-item"><span class="badge bg-secondary quanquan" id="var-value">1</span></li>
                                    <li class="list-inline-item"><span class="btn btn-success plusmin plus" id="btn-plus">+</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        } 
        else {
            return 'No Item Picked';
        }
    }
    function initializePopovers() {
        $('[data-toggle="popover"]').popover({
            container: 'body',
            trigger: 'focus', // Change trigger to 'click' if needed
            html: true
        });
    }
    // Render vendors with their products
    function renderVendors() {
        let vendorHTML = '';
        Object.entries(allVendor).forEach(([shopName, products], vendorIndex) => {
            if (products.length > 0) {
                vendorHTML += `
                    <div class="vendaor">
                        <div class="vendor-rev">
                            <div class="vendy">
                                <input type="checkbox" class="cekvendor form-check-input">
                                <h5>${shopName}</h5>
                            </div>
                            <a href="#" class='menuIcon'><ion-icon name="trash-outline" class="fs-4 can hapus-vendor menuIcon"></ion-icon></a>
                        </div>
                        ${renderProducts(products, vendorIndex)}
                    </div>
                `;
            }
        });
        // If no vendors/products, display message
        if (vendorHTML === '') {
            vendorHTML = 'No Item Picked';
        }
        $('.vendors').html(vendorHTML);
        initializePopovers();
    }

    // Calculate total price of checked items
    function totalinCukK() {
        let totalPrice = 0;
        $('.cekitem:checked').each(function() {
            const productIndex = $(this).data('index');
            const product = allProduct[productIndex];
            if (product && product.price && product.discount_percentage !== undefined) {
                const quantity = parseInt($(this).closest('.vendors-prod').find('.quanquan').text().trim(), 10);
                const discountPrice = (product.price - (product.price * product.discount_percentage) / 100);
                const itemTotal = discountPrice * quantity;
                totalPrice += itemTotal;
            }
        });
        $('.totalinCuy').html(`$${totalPrice.toFixed(2)}`);
    }

    // Initial render of vendors and products
    renderVendors();

    // Event handling for various actions
    $(document).on('click', function(e) {
        const target = $(e.target);

        if (target.hasClass('menuIcon')) {
            e.preventDefault();
        }
        if (target.hasClass('addToCart')) {
            e.preventDefault();
            itemCart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
            const productIndex = target.data('index');
            itemCart.push(productIndex);
            localStorage.setItem('shoppingCart', JSON.stringify(itemCart));
            console.log('Updated Cart:', itemCart);

            const product = allProduct[productIndex];
            if (product && product.shop && product.shop.name) {
                if (!allVendor[product.shop.name]) {
                    allVendor[product.shop.name] = [];
                }
                allVendor[product.shop.name].push(product);
                renderVendors();
                totalinCukK();
            }
        }
        if (target.hasClass('plus')) {
            const currentValue = parseInt(target.parent().prev().find('.quanquan').html());
            target.parent().prev().find('.quanquan').html(currentValue + 1);
            totalinCukK();
        }
        if (target.hasClass('minus')) {
            const currentValue = parseInt(target.parent().next().find('.quanquan').html());
            if (currentValue > 1) {
                target.parent().next().find('.quanquan').html(currentValue - 1);
                totalinCukK();
            }
        }
        if (target.hasClass('delete-all')) {
            e.preventDefault();
            localStorage.removeItem('shoppingCart');
            localStorage.removeItem('checked');
            allVendor = {};
            itemCart = [];
            renderVendors();
            totalinCukK();
        }
        if (target.hasClass('hapus-vendor')) {
            e.preventDefault();
            const shopName = target.closest('.vendor-rev').find('h5').text();
            delete allVendor[shopName];
            itemCart = itemCart.filter(item => allProduct[item].shop.name !== shopName);
            localStorage.setItem('shoppingCart', JSON.stringify(itemCart));
            localStorage.removeItem('checked');
            renderVendors();
            totalinCukK();
        }
    });
    $(document).on('click', '.hapusaja', function(e) {
        e.preventDefault();
        const target = $(this);
        localStorage.removeItem('checked');
        const key = target.data('key').split('-');
        const vendorIndex = parseInt(key[0]);
        const productIndex = parseInt(key[1]);
        const vendorName = Object.keys(allVendor)[vendorIndex];
        
        itemCart.splice(productIndex, 1);

        itemCart = itemCart.filter(item => {
            const product = allProduct[item];
            return !(product.shop.name === vendorName && item === productIndex);
        });

        localStorage.setItem('shoppingCart', JSON.stringify(itemCart));

        allVendor[vendorName].splice(productIndex, 1);

        renderVendors();

        totalinCukK();
    });

    // Initialize checkboxes based on checkList from localStorage
    function initializeCheckboxes() {
        $('.cekitem').each(function() {
            const key = $(this).data('key');
            if (checkList.includes(key)) {
                $(this).prop('checked', true);
                const vendor = $(this).closest('.vendaor');
                const allItems = vendor.find('.cekitem');
                const allChecked = allItems.length === vendor.find('.cekitem:checked').length;
                vendor.find('.cekvendor').prop('checked', allChecked);
            }
        });
    }

    initializeCheckboxes();
    totalinCukK();

    // Event listener for checkbox changes
    $(document).on('input', function(e) {
        const target = $(e.target);
        if (target.hasClass('cekvendor')) {
            const allItems = target.closest('.vendor-rev').nextUntil('.vendor-rev').find('.cekitem');
            allItems.prop('checked', target.is(':checked'));
            totalinCukK();
            let checkList = JSON.parse(localStorage.getItem('checked') || '[]');

            if (target.prop('checked')) {
                allItems.each(function() {
                    const cekindex = $(this).data('key');
                    checkList.push(cekindex);
                });
            } else {
                allItems.each(function() {
                    const cekindex = $(this).data('key');
                    const indexToRemove = checkList.indexOf(cekindex);
                    if (indexToRemove !== -1) {
                        checkList.splice(indexToRemove, 1);
                    }
                });
            }

            localStorage.setItem('checked', JSON.stringify(checkList));
        }
        if (target.hasClass('cekvendor') || target.hasClass('cekitem')) {
            totalinCukK();
            const vendor = target.closest('.vendaor');
            const allItems = vendor.find('.cekitem');
            const allChecked = allItems.length === vendor.find('.cekitem:checked').length;
            vendor.find('.cekvendor').prop('checked', allChecked);
        }
        if (target.hasClass('cekitem')) {
            const cekindex = target.data('key');
            let checkList = JSON.parse(localStorage.getItem('checked') || '[]');

            if (target.prop('checked')) {
                checkList.push(cekindex);
            } else {
                const indexToRemove = checkList.indexOf(cekindex);
                if (indexToRemove !== -1) {
                    checkList.splice(indexToRemove, 1);
                }
            }
            localStorage.setItem('checked', JSON.stringify(checkList));
        }
    });
    initializePopovers()
});
