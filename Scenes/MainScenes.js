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
                await ctx.reply('Введите номер вашего телефона')
        })
        phone.on('text', async (ctx) => {
            if (validatePhone(ctx.message.text)) {
                    result.phone = ctx.message.text
                    await ctx.reply('Успешно!')
                    await ctx.scene.enter('fork')
            } else {
                    await ctx.reply('Некорректно введен номер телефона')
                    await ctx.scene.reenter('fork')
            }
        })
        phone.on('message', (ctx) => ctx.reply('Введите номер вашего телефона'))
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
                await ctx.reply('Оставляли заявку на сайте?',
                    Markup.inlineKeyboard(
                        [Markup.button.callback(`\u2705 Да`, 'btn_yes'),
                            Markup.button.callback('\u274c Нет', 'btn_no')
                        ])
                )
        })
        fork.on('message', (ctx) => ctx.reply('Выберете вариант ответа!'))
        return fork
    }

    GenOrderScene() {
        const order = new MainScenes.BaseScene('order')
        order.enter(async (ctx) => {
                await ctx.reply('Введите номер вашей заявки из смс(13 цифр)')
        })
        order.on('text', async (ctx) => {
            if (validateOrder(ctx.message.text)) {
                    result.order = ctx.message.text
                    await ctx.reply('Номер заявки добавлен успешно!')
                    await ctx.scene.enter('time')
            } else {
                    await ctx.reply('Некорректный номер заявки. Введите номер заявки из смс, номер заявки содержит 13 цифр')
                    await ctx.scene.reenter('order')
            }
        })
        order.on('message', (ctx) => ctx.reply('Введите номер заявки!'))
        return order
    }

    GenTimeScene() {
        const time = new MainScenes.BaseScene('time')
        time.enter(async (ctx) => {
                await ctx.reply('Введите удобное время для звонка оператора.')

        })
        time.on('text', async (ctx) => {
                result.time = ctx.message.text
                await ctx.reply('Время установлено успешно!')
                await ctx.scene.enter('send')
        })
        time.on('message', (ctx) => ctx.reply('Укажите удобное время для звонка оператора!'))
        return time
    }

    GenSendScene () {
        const send = new MainScenes.BaseScene('send')
        send.enter(async (ctx) => {
            const userId = ctx.message.from.id
            if (!result.phone || !result.order) {
                    await ctx.reply(
                        'Произошла ошибка! Заполните данные еще раз.'
                    )
                    result = {}
                    await ctx.scene.enter('phone')
            }
            if (!result.isOnSite) {
                    await ctx.telegram.sendMessage(process.env.CHAT_ID,
                        `Телефон: ${result.phone} \nЗаявка № ${result.order} \nВремя для перезвона: ${result.time}`)
            }
            else{
                try{
                    await sendMail(result)
                }
                catch (err) {
                    console.log(err)
                }
            }
            try{
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
