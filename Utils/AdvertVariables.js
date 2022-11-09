const videoAdFilter = {'adReceived.videoAd' : false}
const videoAdImageId = 'https://monosnap.com/file/w8iBY0QHcgnwEus6CMYhnMGf26t6H4'
const videoAdMessage = '<b>Приобретайте <a href="https://msk.rt.ru/videocontrol?utm_source=telegram&utm_medium=messenger&utm_campaign=b2c_videocontrol_tgb">оборудование для Умного дома</a>, в рассрочку всего от 390р, и присматривайте за домом пока отсутствуете!</b>' +
    '\n\nС помощью HD камеры и удобного приложения «Умный дом» на вашем смартфоне,' +
    ' Вы сможете просматривать онлайн трансляции или записи с камеры видеонаблюдения' +
    ' и оперативно реагировать на непредвиденные события, происходящие в Вашем доме.'
const videoAdUpdatedValue = {'adReceived.videoAd': true}

const capsuleAdFilter = {'adReceived.capsuleAd' : false}
const capsuleAdImageId = 'https://monosnap.com/file/CPXsKSpxBzLZcQHXsuenSRah5jTkCs'
const capsuleAdMessage = '<b><a href="https://msk.rt.ru/capsula?utm_source=telegram&utm_medium=messenger&utm_campaign=b2c_capsula_tgb">Капсула Мини</a> за 4490 рублей!\nУспевай приобрести по выгодной цене!</b>' +
    `\n\nУмная колонка со встроенным голосовым помощником Маруся:

    \ud83c\udfb5 Отличный эксперт в музыке\n
    \ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d\udc66 Расскажет сказку или поможет с уроками детям\n
    \ud83d\udcd6 Поделится знаниями и поиграет в различные игры\n
    \ud83d\udca1 Поможет управиться с техникой по дому\n
При оформлении заявки с нашего сайта, в подарок VK Музыка+Wink`
const capsuleAdUpdatedValue = {'adReceived.capsuleAd': true}

module.exports = {
    videoAdFilter,
    videoAdImageId,
    videoAdMessage,
    videoAdUpdatedValue,
    capsuleAdFilter,
    capsuleAdImageId,
    capsuleAdMessage,
    capsuleAdUpdatedValue
}
