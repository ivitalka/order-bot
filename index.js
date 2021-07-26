const { Telegraf } = require('telegraf')
const axios = require('axios');
const cheerio = require('cheerio');


function getRandomPage(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

function arrayRandElement(arr) {
    const rand = Math.floor(Math.random() * arr.length);
    return arr[rand];
}

const parsingPage = (html) => {
    const data=[];
    const $ = cheerio.load(html);
    $('.post-card a').each((i, elem) => {
        data.push({
            text: $(elem).text()
        })
    })
    return arrayRandElement(data)
}

const getCompliment = () => axios.get(`http://kompli.me/komplimenty-lyubimoj/page/${getRandomPage(1, 42)}`)
    .then((data) => {
       return  parsingPage(data.data);
    }).then((res) => {
        return res.text
    })


const bot = new Telegraf("1931842366:AAFaRp2k3WHbkuviRUy-Q32S23Y9mZmpT6c") //сюда помещается токен, который дал botFather
bot.start(async ctx => {
    const text = await getCompliment();
    ctx.reply(text)
})

setInterval(async () => {
        const text = await getCompliment();
        await bot.telegram.sendMessage(127189446, text)
}, 10800000)
//ответ бота на команду /start
bot.help((ctx) => ctx.reply('Send me a sticker')) //ответ бота на команду /help
bot.on('sticker', (ctx) => ctx.reply('123')) //bot.on это обработчик введенного юзером сообщения, в данном случае он отслеживает стикер, можно использовать обработчик текста или голосового сообщения
bot.hears('hi', (ctx) => ctx.reply('Hey there')) // bot.hears это обработчик конкретного текста, данном случае это - "hi"
// bot.telegram.sendMessage('@IVitalka', 'Hello')
bot.launch()
