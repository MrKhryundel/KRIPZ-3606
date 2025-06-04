document.addEventListener('DOMContentLoaded', function() {
    const deliveryMethod = document.getElementById('deliveryMethod');
    const novaPoshtaFields = document.getElementById('novaPoshtaFields');
    const ukrposhtaFields = document.getElementById('ukrposhtaFields');
    const addressField = document.getElementById('addressField');
    const paymentMethod = document.getElementById('paymentMethod');

    deliveryMethod.addEventListener('change', function() {
        novaPoshtaFields.style.display = 'none';
        ukrposhtaFields.style.display = 'none';
        addressField.style.display = 'none';

        const npInputs = novaPoshtaFields.querySelectorAll('input');
        const upInputs = ukrposhtaFields.querySelectorAll('input');
        npInputs.forEach(input => input.required = false);
        upInputs.forEach(input => input.required = false);
        addressField.querySelector('textarea').required = false;

        switch(this.value) {
            case 'nova-poshta':
                novaPoshtaFields.style.display = 'block';
                npInputs.forEach(input => input.required = true);
                break;
            case 'ukrposhta':
                ukrposhtaFields.style.display = 'block';
                upInputs.forEach(input => input.required = true);
                break;
            case 'courier':
                addressField.style.display = 'block';
                addressField.querySelector('textarea').required = true;
                break;
            case 'self-pickup':
                break;
        }
    });

    deliveryMethod.addEventListener('change', function() {
        const cardCourierOption = Array.from(paymentMethod.options).find(option => option.value === 'card-courier');
        if (cardCourierOption) {
            cardCourierOption.disabled = this.value !== 'courier';
            if (cardCourierOption.disabled && paymentMethod.value === 'card-courier') {
                paymentMethod.value = '';
            }
        }
    });
});