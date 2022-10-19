require('dotenv').config({path: __dirname + '/.env'});
const { session, Markup, Scenes, Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)
const mongoose = require('mongoose');
const MainSceneGenerator = require('./Scenes/MainScenes')
const ExportSceneGenerator = require('./Scenes/ExportScenes')
const CounterModel = require('./Models/counter')
const UserModel = require('./Models/user')

mongoose.connect(process.env.DB_CONNECTION_URI)
    .then(() => console.log('Connected to MongoDb'))
    .catch((err) => console.log(err));


const createOrderScene = new MainSceneGenerator()
const exportOrderScene = new ExportSceneGenerator()

const phoneScene = createOrderScene.GenPhoneScene()
const forkScene = createOrderScene.GenForkScene()
const orderScene = createOrderScene.GenOrderScene()
const timeScene = createOrderScene.GenTimeScene()
const sendScene = createOrderScene.GenSendScene()

const chooseActionScene = exportOrderScene.GenChooseActionScene()
const ordersExportScene = exportOrderScene.GenOrdersExportScene()
const gppOrdersScene = exportOrderScene.GenGppOrdersScene()
const otherOrdersScene = exportOrderScene.GenOtherOrdersScene()
const allOrdersScene = exportOrderScene.GenAllOrdersScene()
const countersExportScene = exportOrderScene.GenCounterExportScene()

const stage = new Scenes.Stage([
    phoneScene,
    forkScene,
    orderScene,
    timeScene,
    sendScene,
    chooseActionScene,
    ordersExportScene,
    gppOrdersScene,
    otherOrdersScene,
    allOrdersScene,
    countersExportScene
])

bot.use(session())
bot.use(stage.middleware())

bot.action('btn_1', async (ctx) => {
        await ctx.scene.enter('phone')
})

bot.action('btn_2', async (ctx) => {
    await ctx.replyWithHTML(`Продолжая использовать наш Telegram-бот, вы даете согласие на обработку пользовательских данных, в соответствии с
<a href="https://drive.google.com/file/d/1avU8Sf3SM2kCsiBH2uRt0qcryFjCBLFm">Политикой конфиденциальности и Пользовательским соглашением</a>`)
})

bot.command('order_call', async (ctx) => {
        await ctx.scene.enter('phone')
})

bot.command('export', async (ctx) => {
    await ctx.scene.enter('choose_action')
})

bot.command('policy', async (ctx) => {
    await ctx.replyWithHTML(`Продолжая использовать наш Telegram-бот, вы даете согласие на обработку пользовательских данных, в соответствии с
<a href="https://drive.google.com/file/d/1avU8Sf3SM2kCsiBH2uRt0qcryFjCBLFm/view">Политикой конфиденциальности и Пользовательским соглашением</a>`)
})

bot.command('update',  async (ctx) => {
    await UserModel.findOne({userId: ctx.message.from.id})
        .then((user) => {
            if(!user) {
                return ctx.reply('Вы не зарегистрированы в системе!')
            } else {
                CounterModel.updateMany({}, {$set: {adReceived: {
                    videoAd: false,
                    capsuleAd: false,
                    winkPlusAd: false
            }}})
                    .then(() => console.log('updated!'))
                    .catch(err => console.log(err))
            }
        })
})

bot.command('find', async (ctx) => {
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
})

bot.command('advert', async (ctx) => {
    await UserModel.findOne({userId: ctx.message.from.id})
        .then((user) => {
            if (!user) {
                return ctx.reply('Вы не зарегистрированы в системе!')
            } else {
                ctx.reply('Какую рекламу будем отправлять?',
                    Markup.inlineKeyboard([
                        Markup.button.callback('Видео', 'btn_videoAd'),
                        Markup.button.callback('Капсула', 'btn_capsuleAd'),
                        Markup.button.callback('Wink+', 'btn_winkPlusAd'),
                    ]))
            }
        })
})

bot.start(ctx => {
    const now = new Date()
    CounterModel.findOne({
        userId: ctx.message.from.id,})
        .then((user) => {
            if (!user) {
                CounterModel.create({
                    userId: ctx.message.from.id,
                    name: ctx.message.from.first_name,
                    date: now,
                    'adReceived.videoAd' : false,
                    'adReceived.capsuleAd' : false,
                    'adReceived.winkPlusAd' : false,
                }).catch((err) => console.log(err))
            }
        }).catch((err) => {
        console.log(err)})

    ctx.reply('Вас приветствует бот от Ростелекома!\n' +
        'К сожалению, мы не смогли с Вами связаться. С помощью нашего бота Вы можете назначить удобное время для звонка оператора.',
        Markup.inlineKeyboard([
            Markup.button.callback('Назначить время', 'btn_1'),
            Markup.button.callback('Политика конфиденциальности', 'btn_2'),
        ]))
    })

bot.on('message', async (ctx) => {
        await ctx.reply('Вы ввели неверное значение, нажмите, пожалуйста кнопку, чтобы продолжить.')
})

bot.launch().then(() => console.log('Launch!'));

