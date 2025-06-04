document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.dataset.productId;
            const quantity = 1;

            fetch('/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId, quantity })
            })
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    alert('Товар додано до кошика!');
                    const cartCount = document.querySelector('.cart-count');
                    if (cartCount) {
                        cartCount.textContent = data.cartCount;
                    }
                }
            })
            .catch(error => {
                console.error('Помилка:', error);
                alert('Виникла помилка при додаванні товару до кошика');
            });
        });
    });

    const quantityInputs = document.querySelectorAll('.cart-quantity');
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            const productId = this.dataset.productId;
            const quantity = this.value;

            fetch('/cart/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId, quantity })
            })
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    const totalElement = document.querySelector('.cart-total');
                    if (totalElement) {
                        totalElement.textContent = `${data.total} ₴`;
                    }
                }
            })
            .catch(error => {
                console.error('Помилка:', error);
                alert('Виникла помилка при оновленні кошика');
            });
        });
    });

    const removeButtons = document.querySelectorAll('.remove-from-cart');
    removeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.dataset.productId;

            fetch('/cart/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId })
            })
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    const cartItem = this.closest('.cart-item');
                    if (cartItem) {
                        cartItem.remove();
                    }
                    const totalElement = document.querySelector('.cart-total');
                    if (totalElement) {
                        totalElement.textContent = `${data.total} ₴`;
                    }
                    const cartCount = document.querySelector('.cart-count');
                    if (cartCount) {
                        cartCount.textContent = data.cartCount;
                    }
                }
            })
            .catch(error => {
                console.error('Помилка:', error);
                alert('Виникла помилка при видаленні товару з кошика');
            });
        });
    });

    const deleteProductButtons = document.querySelectorAll('.delete-product');
    deleteProductButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if(!confirm('Ви впевнені, що хочете видалити цей товар?')) {
                e.preventDefault();
            }
        });
    });

    const deliveryMethodSelect = document.getElementById('deliveryMethod');
    const deliveryDetailsGroup = document.getElementById('deliveryDetailsGroup');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const courierPaymentOption = document.querySelector('option[value="Оплата карткою кур\'єру"]');

    if (deliveryMethodSelect && deliveryDetailsGroup) {
        deliveryMethodSelect.addEventListener('change', function() {
            if (this.value === 'Самовивіз') {
                deliveryDetailsGroup.style.display = 'none';
                document.getElementById('address').required = false;
                document.getElementById('deliveryDetails').required = false;
            } else {
                deliveryDetailsGroup.style.display = 'block';
                document.getElementById('address').required = true;
                document.getElementById('deliveryDetails').required = true;
            }

            if (courierPaymentOption) {
                if (this.value === 'Кур\'єрська доставка') {
                    courierPaymentOption.style.display = '';
                } else {
                    courierPaymentOption.style.display = 'none';
                    if (paymentMethodSelect.value === 'Оплата карткою кур\'єру') {
                        paymentMethodSelect.value = '';
                    }
                }
            }
        });
    }
});
