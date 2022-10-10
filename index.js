require('dotenv').config({path: __dirname + '/.env'});
const { session, Markup, Scenes, Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)
const mongoose = require('mongoose');
const MainSceneGenerator = require('./Scenes/MainScenes')
const ExportSceneGenerator = require('./Scenes/ExportScenes')
const CounterModel = require('./Models/counter')

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

// bot.command('update',  () => {
//      CounterModel.updateMany({}, {$set: {adReceived: false}})
//          .then(() => console.log('updated!'))
//          .catch(err => console.log(err))
// })

bot.start(ctx => {
    const now = new Date()
    CounterModel.findOne({userId: ctx.message.from.id})
        .then((user) => {
            if (!user) {
                CounterModel.create({
                    userId: ctx.message.from.id,
                    name: ctx.message.from.first_name,
                    date: now,
                    adReceived: false
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

bot.on('text', async (ctx) => {
        await ctx.reply('Вы ввели неверное значение, нажмите, пожалуйста кнопку, чтобы продолжить.')
})

bot.launch();

