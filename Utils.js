function validatePhone(phone){
    let regex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    return regex.test(phone);
}

function validateOrder(order) {
    let regex = /^\d{13,}$/u
    return regex.test(order)
}


module.exports = {validatePhone, validateOrder};
