const {Markup} = require('telegraf')
const { Scenes: MainScenes } = require('telegraf')
require('dotenv').config({path: __dirname + '/.env'})
const {validatePhone, validateOrder} = require('../Utils/Validation')
const { sendMail } = require('../Utils/Email')
const OrderModel = require('../Models/order')
let result = {}


class MainSceneGenerator {
    GenPhoneScene() {
        const phone = new MainScenes.BaseScene('phone')
        phone.enter(async (ctx) => {
            try {
                await ctx.reply('Введите номер вашего телефона')
            }
            catch (err) {
                console.log(err)
            }
        })
        phone.on('text', async (ctx) => {
            if (validatePhone(ctx.message.text)) {
                result.phone = ctx.message.text
                try {
                    await ctx.reply('Успешно!')
                    await ctx.scene.enter('fork')
                }
                catch (err) {
                    console.log(err)
                }
            } else {
                try {
                    await ctx.reply('Некорректно введен номер телефона')
                    await ctx.scene.reenter('fork')
                }
                catch (err) {
                    console.log(err)
                }
            }
        })
        phone.on('message', async (ctx) => {
            try {
                await ctx.reply('Введите номер вашего телефона')
            }
            catch (err) {
                console.log(err)
            }
        })
        return phone
    }

    GenForkScene () {
        const fork = new MainScenes.BaseScene('fork')
        fork.action('btn_yes', async (ctx) => {
            result.isOnSite = true
            await ctx.scene.enter('order')
        })
        fork.action('btn_no', async (ctx) => {
            result.isOnSite = false
            await ctx.scene.enter('order')
        })
        fork.enter(async (ctx) => {
            try {
                await ctx.reply('Оставляли заявку на сайте?',
                    Markup.inlineKeyboard(
                        [Markup.button.callback(`\u2705 Да`, 'btn_yes'),
                            Markup.button.callback('\u274c Нет', 'btn_no')
                        ])
                )
            }
            catch (err) {
                console.log(err)
            }
        })
        fork.on('message', async (ctx) => {
            try {
                await ctx.reply('Выберете вариант ответа!')
            }
            catch (err) {
                console.log(err)
            }
        })
        return fork
    }

    GenOrderScene() {
        const order = new MainScenes.BaseScene('order')
        order.enter(async (ctx) => {
            try {
                await ctx.reply('Введите номер вашей заявки из смс(13 цифр)')
            }
            catch (err) {
                console.log(err)
            }
        })
        order.on('text', async (ctx) => {
            if (validateOrder(ctx.message.text)) {
                result.order = ctx.message.text
                try {
                    await ctx.reply('Номер заявки добавлен успешно!')
                    await ctx.scene.enter('time')
                }
                catch (err) {
                    console.log(err)
                }
            } else {
                try {
                    await ctx.reply('Некорректный номер заявки. Введите номер заявки из смс, номер заявки содержит 13 цифр')
                    await ctx.scene.reenter('order')
                }
                catch (err) {
                    console.log(err)
                }
            }
        })
        order.on('message', async (ctx) => {
            try {
                await ctx.reply('Введите номер заявки!')
            }
            catch (err) {
                console.log(err)
            }
        })
        return order
    }

    GenTimeScene() {
        const time = new MainScenes.BaseScene('time')
        time.enter(async (ctx) => {
            try {
                await ctx.reply('Введите удобное время для звонка оператора.')
            }
            catch (err) {
                console.log(err)
            }
        })
        time.on('text', async (ctx) => {
            result.time = ctx.message.text
            try {
                await ctx.reply('Время установлено успешно!')
                await ctx.scene.enter('send')
            }
            catch (err) {
                console.log(err)
            }
        })
        time.on('message', async (ctx) => {
            try {
                await ctx.reply('Укажите удобное время для звонка оператора!')
            }
            catch (err) {
                console.log(err)
            }
        })
        return time
    }

    GenSendScene () {
        const send = new MainScenes.BaseScene('send')
        send.enter(async (ctx) => {
            const userId = ctx.message.from.id
            if (!result.phone || !result.order) {
                result = {}
                try {
                    await ctx.reply(
                        'Произошла ошибка! Заполните данные еще раз.'
                    )
                    await ctx.scene.enter('phone')
                }
                catch (err) {
                    console.log(err)
                }
            }
            if (!result.isOnSite) {
                try {
                    await ctx.telegram.sendMessage(process.env.CHAT_ID,
                        `Телефон: ${result.phone} \nЗаявка № ${result.order} \nВремя для перезвона: ${result.time}`)
                }
                catch (err) {
                    console.log(err)
                }
            }
            else {
                try {
                    await sendMail(result)
                }
                catch (err) {
                    console.log(err)
                }
            }
            try {
                await OrderModel.create({
                    userId: userId,
                    phoneNumber: result.phone,
                    orderNumber: result.order,
                    callTime: result.time,
                    onSite: result.isOnSite,
                    date: Date.now()
                })
            }
            catch (err) {
                console.log(err)
            }
            await ctx.reply(
            'Ваша заявка доставлена, наш оператор свяжется с Вами в указанное время. Спасибо, за обращение!'
            )
        })
        result= {}
        return send;
    }

}

module.exports = MainSceneGenerator
