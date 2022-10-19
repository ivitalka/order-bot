const videoAdFilter = {'adReceived.videoAd' : false}
const videoAdImageId = 'https://monosnap.com/file/w8iBY0QHcgnwEus6CMYhnMGf26t6H4'
const videoAdMessage = '<b>Приобретайте <a href="https://msk.rt.ru/videocontrol?utm_source=telegram&utm_medium=messenger&utm_campaign=b2c_videocontrol_tgb">оборудование для Умного дома</a>, в рассрочку всего от 390р, и присматривайте за домом пока отсутствуете!</b>' +
    '\n\nС помощью HD камеры и удобного приложения «Умный дом» на вашем смартфоне,' +
    ' Вы сможете просматривать онлайн трансляции или записи с камеры видеонаблюдения' +
    ' и оперативно реагировать на непредвиденные события, происходящие в Вашем доме.'
const videoAdUpdatedValue = {'adReceived.videoAd': true}

module.exports = { videoAdFilter, videoAdImageId, videoAdMessage, videoAdUpdatedValue }
