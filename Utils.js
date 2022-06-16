function validatePhone(phone){
    let regex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    return regex.test(phone);
}

function validateName(name) {
    let regex = /^[a-zA-Zа-яА-Я'][a-zA-Zа-яА-Я-' ]+[a-zA-Zа-яА-Я']?$/u
    return regex.test(name)
}

function validateOrder(order) {
    let regex = /^\d{13,}$/u
    return regex.test(order)
}

const result = {}

module.exports = {validatePhone, validateName, validateOrder, result};
