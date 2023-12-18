const { Markup } = require('telegraf')
const { Scenes: MainScenes } = require('telegraf')
require('dotenv').config({path: __dirname + '/.env'})
const { orderSceneContent } = require('../Utils/Export')
const fs = require("fs")
const { Parser } = require('json2csv');
const { validateDate } = require('../Utils/Validation')
const UserModel = require('../Models/user')
const CounterModel = require('../Models/counter')


class ExportSceneGenerator {

    GenChooseActionScene() {
        const chooseAction = new MainScenes.BaseScene('choose_action')
        chooseAction.action('btn_choose_orders_export', async (ctx) => {
            await ctx.scene.enter('orders_export')
        })
        chooseAction.action('btn_choose_users_export', async (ctx) => {
            await ctx.scene.enter('counters_export')
        })
        chooseAction.enter(async (ctx) => {
            await UserModel.findOne({userId: ctx.message.from.id})
                .then(async (user) => {
                    if(user){
                        await ctx.reply('Что будем выгружать?', Markup.inlineKeyboard([
                            Markup.button.callback('Заказы', 'btn_choose_orders_export'),
                            Markup.button.callback('Пользователей', 'btn_choose_users_export')
                        ]))
                    }
                    else {
                        await ctx.reply('Вы не зарегистрированы в системе!')
                        await ctx.scene.leave()
                    }
                })
        })
        chooseAction.on('message', (ctx) => ctx.reply('Выберите действие!'))
        return chooseAction
    }

    GenOrdersExportScene () {
        const ordersExport = new MainScenes.BaseScene('orders_export')

        ordersExport.action('btn_export_gpp_orders', async (ctx)=> {
            await ctx.scene.enter('gpp_orders')
        })

        ordersExport.action('btn_export_other_orders', async (ctx)=> {
            await ctx.scene.enter('other_orders')
        })

        ordersExport.action('btn_export_all_orders', async (ctx)=> {
            await ctx.scene.enter('all_orders')
        })

        ordersExport.enter(async (ctx) => {
            await ctx.reply('Выберите тип заявки', Markup.inlineKeyboard([
                Markup.button.callback('ГПП', 'btn_export_gpp_orders'),
                Markup.button.callback('Другие каналы', 'btn_export_other_orders'),
                Markup.button.callback('Все заявки', 'btn_export_all_orders')
            ]))
        })
        return ordersExport
    }

    GenCounterExportScene () {
        const countersExport = new MainScenes.BaseScene('counters_export')

        countersExport.enter(async (ctx) => {
            await ctx.reply('Укажите интервал в формате: месяц.день.год-месяц.день.год')
            await countersExport.on('text', async (ctx) => {
                let date = ctx.message.text
                if (validateDate(date)) {
                    let res = date.split('-')
                    res[0] = new Date(`${res[0]} 00:00 +04`)
                    res[1] = new Date(`${res[1]} 23:59 +04`)
                    if(res[0] > res[1]) {
                        await ctx.reply('Начало интервала не может быть больше его конца')
                    } else{
                        CounterModel.find({date: {$gte: res[0], $lte: res[1]}}, {_id:0, __v: 0})
                            .then((orders) => {
                                const fields = ['userId', 'name', 'date'];
                                const opts = { fields }
                                const parser = new Parser(opts)
                                const csvData = parser.parse(orders)
                                fs.writeFile("counters.csv", csvData, (error) => {
                                    if (error) throw error
                                    console.log('Write to counters.csv successfully!')
                                    ctx.replyWithDocument({ source: './counters.csv', filename: 'counters.csv' })
                                        .then(() => {
                                            fs.unlink('./counters.csv', ((err) => {
                                                if(err){ throw err }
                                                console.log('counters.csv deleted!')
                                            }))
                                        })
                                        .catch((err) => console.log(err))
                                })
                            })
                        await ctx.scene.leave()
                    }
                }
                else{
                    await ctx.reply('Неверно указан интервал')
                }
            })
        })
        return countersExport
    }

    GenGppOrdersScene () {
        const gppOrders = new MainScenes.BaseScene('gpp_orders')
        gppOrders.enter(async (ctx) => {
            await orderSceneContent(ctx, gppOrders, true)
        })
        return gppOrders
    }

    GenOtherOrdersScene () {
        const otherOrders = new MainScenes.BaseScene('other_orders')
        otherOrders.enter(async (ctx) => {
            await orderSceneContent(ctx, otherOrders, false)
        })
        return otherOrders
    }

    GenAllOrdersScene () {
        const allOrders = new MainScenes.BaseScene('all_orders')
        allOrders.enter(async (ctx) => {
            await orderSceneContent(ctx, allOrders)
        })
        return allOrders
    }
}

module.exports = ExportSceneGenerator
