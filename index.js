require('dotenv').config({path: __dirname + '/.env'});
const {session, Markup, Scenes, Telegraf} = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN);
const SceneGenerator = require('./Scenes')

const curScene = new SceneGenerator()
const phoneScene = curScene.GenPhoneScene()
const orderScene = curScene.GenOrderScene()
const timeScene = curScene.GenTimeScene()
bot.use(Telegraf.log())
const stage = new Scenes.Stage([phoneScene, orderScene, timeScene])

bot.use(session())
bot.use(stage.middleware())
bot.action('btn_1', async (ctx) => {
    await ctx.scene.enter('phone')
})

bot.start(ctx => {
    ctx.reply('Вас приветствует бот от Ростелекома, в целях удобства вы можете назначить время звонка оператора.',
        Markup.inlineKeyboard([Markup.button.callback('Назначить время.', 'btn_1')])
    )
    })
bot.launch();

