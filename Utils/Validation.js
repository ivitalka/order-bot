
function validatePhone(phone){
    if (typeof phone !== 'string'){
        return false
    }
    let regex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    return regex.test(phone);
}

function validateOrder(order) {
    if (typeof order !== 'string'){
        return false
    }
    let regex = /^\d{13}$/u
    return regex.test(order)
}

function validateDate (date) {
    let regex = /^(0?[1-9]|1[012])[.](0?[1-9]|[12][0-9]|3[01])[.](19|20)?[0-9]{2}[-](0?[1-9]|1[012])[.](0?[1-9]|[12][0-9]|3[01])[.](19|20)?[0-9]{2}$/
    return regex.test(date)
}


module.exports = {validatePhone, validateOrder, validateDate};


