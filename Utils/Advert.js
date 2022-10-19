const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)
const CounterModel = require('../Models/counter')
const UserModel = require('../Models/user')

const videoAdvert = async (ctx) => {
    await UserModel.findOne({userId: ctx.from.id})
        .then(async (user) => {
            if(!user) {
                return ctx.reply('Вы не зарегистрированы в системе!')
            } else {
                await CounterModel.find({'adReceived.videoAd' : false})
                    .then(async (users) => {
                        const totalSend = users.length
                        let successSend = 0
                        let blockedSend = 0
                        for(let i = 0; i < users.length; i++){
                            let user = users[i].userId
                            await bot.telegram.sendPhoto(user, 'AgACAgIAAxkBAAILRWNHHcHip-1LFaX6FWWG4H4fm4s_AAIWxDEbn5Q5SlP42A5TN6DZAQADAgADcwADKgQ')
                                .catch(err => console.log(err))
                            await bot.telegram.sendMessage(user,
                                '<b>Приобретайте <a href="https://msk.rt.ru/videocontrol?utm_source=telegram&utm_medium=messenger&utm_campaign=b2c_videocontrol_tgb">оборудование для Умного дома</a>, в рассрочку всего от 390р, и присматривайте за домом пока отсутствуете!</b>' +
                                '\n\nС помощью HD камеры и удобного приложения «Умный дом» на вашем смартфоне,' +
                                ' Вы сможете просматривать онлайн трансляции или записи с камеры видеонаблюдения' +
                                ' и оперативно реагировать на непредвиденные события, происходящие в Вашем доме.', {parse_mode: 'HTML'})
                                .then(async (res) => {
                                    if (res.message_id){
                                        successSend++
                                        await CounterModel.updateOne(
                                            {userId: user},
                                            {$set: {'adReceived.videoAd': true}})
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

module.exports = { videoAdvert }
