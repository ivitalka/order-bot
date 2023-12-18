require('dotenv').config({path: __dirname + '/.env'});
const OrderModel = require('../Models/order')
const fs = require("fs")
const { Parser } = require('json2csv');
const { validateDate } = require('../Utils/Validation')


function exportOrders(ctx, arg) {
    OrderModel.find(arg, {_id:0, __v: 0})
        .then((orders) => {
            const fields = ['userId', 'phoneNumber', 'orderNumber', 'callTime', 'date', 'onSite'];
            const opts = { fields }
            const parser = new Parser(opts)
            const csvData = parser.parse(orders)
            fs.writeFile("orders.csv", csvData, (error) => {
                if (error) throw error
                console.log('Write to orders.csv successfully!')
                ctx.replyWithDocument({ source: './orders.csv', filename: 'orders.csv' })
                    .then(() => {
                        fs.unlink('./orders.csv', ((err) => {
                            if(err){ throw err }
                            console.log('orders.csv deleted')
                            arg = {}
                        }))
                    })
                    .catch((err) => console.log(err))

            })
        })

}

async function orderSceneContent (ctx, scene, arg) {
    await ctx.reply('Укажите интервал в формате: месяц.день.год-месяц.день.год')
    await scene.on('text', async (ctx) => {
        let date = ctx.message.text
        if (validateDate(date)) {
            let res = date.split('-')
            res[0] = new Date(`${res[0]} 00:00 +04`)
            res[1] = new Date(`${res[1]} 23:59 +04`)
            if(res[0] > res[1]) {
                await ctx.reply('Начало интервала не может быть больше его конца')
            } else{
                let props = {}
                if (arg == null) {
                    props = {date: {$gte: res[0], $lte: res[1]}}
                } else {
                    props = {onSite: arg, date: {$gte: res[0], $lte: res[1]}}
                }
                await exportOrders(ctx,props)
                await ctx.scene.leave()
            }
        }
        else{
            await ctx.reply('Неверно указан интервал')
        }
    })
}


module.exports = { orderSceneContent };


