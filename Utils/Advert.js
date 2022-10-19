const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)
const CounterModel = require('../Models/counter')
const UserModel = require('../Models/user')

const sendPromo = async (ctx, findFilter, imageId, message, updatedValue) => {
    await UserModel.findOne({userId: ctx.from.id})
        .then(async (user) => {
            if(!user) {
                return ctx.reply('Вы не зарегистрированы в системе!')
            } else {
                await CounterModel.find(findFilter)
                    .then(async (users) => {
                        const totalSend = users.length
                        let successSend = 0
                        let blockedSend = 0
                        for(let i = 0; i < users.length; i++){
                            let user = users[i].userId
                            await bot.telegram.sendPhoto(user, imageId)
                                .catch(err => console.log(err))
                            await bot.telegram.sendMessage(user, message, {parse_mode: 'HTML'})
                                .then(async (res) => {
                                    if (res.message_id){
                                        successSend++
                                        await CounterModel.updateOne(
                                            {userId: user},
                                            {$set: updatedValue})
                                            .catch(err => console.log(err))
                                    }
                                })
                                .catch((err) => {
                                    if (err.response.error_code === 403) blockedSend++
                                })
                        }
                        ctx.reply(`Всего отправлено: ${totalSend} \nНе доставлено: ${blockedSend} \nДоставлено: ${successSend}`)
                    })
                    .catch(err => console.log(err))
            }
        })
}

module.exports = { sendPromo }
