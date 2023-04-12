const TelegramApi = require('node-telegram-bot-api')

const {gameOptions, againOptions} = require('./options')

const token = '5823148359:AAEQjP62P3CINd16OMknogf8OB5vl1_0SXM'

const bot = new TelegramApi(token, {polling: true})

const chats = {}



const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Privet'},
        {command: '/info', description: 'Informacion'},
        {command: '/game', description: 'game'},
    ])

    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/7ee/1ac/7ee1ac07-8e74-4da4-b4b3-4a17ac329a6b/1.webp')
            return  bot.sendMessage(chatId, 'Приветики')
        }
        if (text === '/info') {
            return  bot.sendMessage(chatId, `Твое имя ${msg.from.first_name}`)
        }

        if (text === '/game') {
            return startGame(chatId)
        }

        return bot.sendMessage(chatId, 'Я тебя не понимаю, давай еще раз!')
    })

    bot.on('callback_query', msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if (data === '/again') {
            return startGame(chatId)
        }

        if (Number(data) === chats[chatId]) {
            bot.sendMessage(chatId, `Поздравляю, ты отгадал!`, againOptions)
        } else {
            bot.sendMessage(chatId, `Неверно, бот загадал цифру ${chats[chatId]} :( Попробуй еще раз!`, againOptions)
        }
    })
}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю число от 0 до 9, а ты должен угадать`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

start()