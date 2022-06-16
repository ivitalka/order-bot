const { Scenes } = require('telegraf')
require('dotenv').config({path: __dirname + '/.env'});
const {validatePhone, validateOrder, result} = require('./Utils')


class SceneGenerator {
    GenPhoneScene () {
        const phone = new Scenes.BaseScene('phone')
        phone.enter(async (ctx) => {
            await ctx.reply('Введите номер телефона.')
        })
        phone.on('text', async (ctx) => {
            if(validatePhone(ctx.message.text)){
                await ctx.reply('Успешно')
                result.phone = ctx.message.text
                await ctx.scene.enter('order')
            }
            else {
                await ctx.reply('Не корректно введен номер.')
                await ctx.scene.reenter('phone')
            }
        })
        phone.on('message', (ctx) => ctx.reply('Введите номер телефона!'))
        return phone
    }


    GenOrderScene () {
        const order = new Scenes.BaseScene('order')
        order.enter(async (ctx) => {
            await ctx.reply('Введите номер заявки')
        })
        order.on('text', async (ctx) => {
            if(validateOrder(ctx.message.text)){
                await ctx.reply('Номер заявки добавлен успешно')
                result.order = ctx.message.text
                await ctx.scene.enter('time')
            }
            else {
                await ctx.reply('Не корректный номер заявки')
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
                await ctx.reply('Время установлено успешно.')
                await ctx.reply('Ваша заявка принята, ожидайте звонка оператора.')
                result.time = ctx.message.text
                await ctx.telegram.sendMessage(process.env.CHAT_ID, result)
                await ctx.scene.leave()
        })
        time.on('message', (ctx) => ctx.reply('Укажите удобное время для звонка оператора!'))
        return time
    }
}

module.exports = SceneGenerator
