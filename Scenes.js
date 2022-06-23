const { Scenes } = require('telegraf')
require('dotenv').config({path: __dirname + '/.env'});
const {validatePhone, validateOrder} = require('./Utils')
let result = {}

class SceneGenerator {
    GenPhoneScene () {
        const phone = new Scenes.BaseScene('phone')
        phone.enter(async (ctx) => {
            await ctx.reply('Введите номер вашего телефона')
        })
        phone.on('text', async (ctx) => {
            if(validatePhone(ctx.message.text)){
                await ctx.reply('Успешно!')
                result.phone = ctx.message.text
                await ctx.scene.enter('order')
            }
            else {
                await ctx.reply('Некорректно введен номер телефона')
                await ctx.scene.reenter('phone')
            }
        })
        phone.on('message', (ctx) => ctx.reply('Введите номер вашего телефона'))
        return phone
    }


    GenOrderScene () {
        const order = new Scenes.BaseScene('order')
        order.enter(async (ctx) => {
            await ctx.reply('Введите номер вашей заявки из смс(номер заявки содержит 13 цифр)')
        })
        order.on('text', async (ctx) => {
            if(validateOrder(ctx.message.text)){
                await ctx.reply('Номер заявки добавлен успешно!')
                result.order = ctx.message.text
                await ctx.scene.enter('time')
            }
            else {
                await ctx.reply('Некорректный номер заявки. Введите номер заявки из смс, номер заявки содержит 13 цифр')
                await ctx.scene.reenter('order')
            }
        })
        order.on('message', (ctx) => ctx.reply('Введите номер заявки!'))
        return order
    }

    GenTimeScene () {
        const time = new Scenes.BaseScene('time')
        time.enter(async (ctx) => {
            await ctx.reply('Введите удобное время для звонка оператора.')
        })
        time.on('text', async (ctx) => {
                await ctx.reply('Время установлено успешно!')
                await ctx.reply('Ваша заявка доставлена, наш оператор свяжется с Вами в указанное время. Спасибо, за обращение!')
                result.time = ctx.message.text
                await ctx.telegram.sendMessage(process.env.CHAT_ID,
                `Телефон: ${result.phone} \nЗаявка № ${result.order} \nВремя для перезвона: ${result.time}`)
                result = {}
                await ctx.scene.leave()
        })
        time.on('message', (ctx) => ctx.reply('Укажите удобное время для звонка оператора!'))
        return time
    }
}

module.exports = SceneGenerator
