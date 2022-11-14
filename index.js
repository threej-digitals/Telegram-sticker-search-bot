require('dotenv').config();
const {Markup} = require('telegraf');
const bot = new (require("telegraf").Telegraf)(process.env.BOT_TOKEN);
const tgbot = new (require('./modules/tgbot').Tgbot);

// handle bot commands
bot.use(async (ctx, next)=>{
    await tgbot.logUser(ctx.from || ctx.callbackQuery.from);
    
    if(ctx?.message?.entities && ctx.message.entities[0].type == 'bot_command'){
        return await require('./modules/commands').handleCommands(ctx.update);
    }
    return await next();
});

// handle stickers
bot.on('sticker', async ctx => await ctx.reply('Want to add your sticker? Talk to @threej_bot'));

// handle inline queries
bot.on('inline_query', ctx => require('./modules/inlineQueryHandler').handleInlineQueries(ctx, tgbot));

//handle callback query
bot.on('callback_query', async ctx => {
    if(ctx.callbackQuery.data === 'secondaryMenu'){

        await ctx.answerCbQuery('Advance search');
        return await ctx.editMessageReplyMarkup(Markup.inlineKeyboard([
            [
                Markup.button.switchToCurrentChat('⏸ Animated sticker','A '),
                Markup.button.switchToCurrentChat('🎦 Video sticker','V ')
            ],
            [
                Markup.button.switchToCurrentChat('▶️ Static sticker','S '),
                Markup.button.switchToCurrentChat('🌟Premium sticker','P ')
            ],
            [
                Markup.button.callback('◀️ Back','mainMenu'),
            ]
        ]).reply_markup)
    }else if(ctx.callbackQuery.data === 'mainMenu'){
        await ctx.answerCbQuery('Main menu');
        return await ctx.editMessageText(
            `Hello ${ctx.callbackQuery.from.first_name}, nice to meet you.\n\nYou can use me anywhere in telegram to search stickers. Just type my username or click on the below button.\n\nJoin @stickers3j`,{
                reply_markup: Markup.inlineKeyboard([
                    [
                        Markup.button.switchToChat('🔎 Search stickers',''),
                        Markup.button.callback('🕵️‍♂️ Advance search','secondaryMenu')
                    ],
                    [
                        Markup.button.url('➕ Add sticker','https://t.me/threej_bot'),
                        Markup.button.url('😺 Contribute','https://t.me/threej_bot')
                    ],
                    [
                        Markup.button.callback('⚙️ Preferences', 'Preferences')
                    ]
                ]).reply_markup
            })

    }else if(ctx.callbackQuery.data === 'Preferences'){
        return await ctx.editMessageText('Modify your Preferences\n\nHide Explicit contents: ' + (tgbot.user.ISNSFW ? '❌':'✅'),{
            reply_markup: Markup.inlineKeyboard([
                [
                    Markup.button.callback((tgbot.user.ISNSFW ? '🔞 Hide' : '🔞 Show') + ' NSFW stickers', tgbot.user.ISNSFW ? 'hideNSFW' : 'showNSFW')
                ],
                [
                    Markup.button.callback('◀️ Back','mainMenu')
                ]
            ]).reply_markup
        })
    }else if(ctx.callbackQuery.data === 'hideNSFW'){
        const result = await tgbot.updatePreference({ISNSFW : 0});
        if(result.affectedRows == 1){
            return await ctx.editMessageText('Modify your Preferences\n\nHide Explicit contents: ✅',{
                reply_markup: Markup.inlineKeyboard([
                    [
                        Markup.button.callback('🔞 Show NSFW stickers', 'showNSFW')
                    ],
                    [
                        Markup.button.callback('◀️ Back','mainMenu')
                    ]
                ]).reply_markup
            })
        }
    }else if(ctx.callbackQuery.data === 'showNSFW'){
        const result = await tgbot.updatePreference({ISNSFW : 1});
        if(result.affectedRows == 1){
            return await ctx.editMessageText('Modify your Preferences\n\nHide Explicit contents: ❌',{
                reply_markup: Markup.inlineKeyboard([
                    [
                        Markup.button.callback('🔞 Hide NSFW stickers', 'hideNSFW')
                    ],
                    [
                        Markup.button.callback('◀️ Back','mainMenu')
                    ]
                ]).reply_markup
            })
        }
    }
})

// Default message
bot.use(async (ctx) => {
    ctx.reply('Use me in inline mode, click on the button below.',{
        reply_markup : Markup.inlineKeyboard([
            [Markup.button.switchToChat('Search stickers','')]
        ]).reply_markup
    })
});

// handle errors
bot.catch((err)=>{tgbot.logError(err)});

// Launch bot
bot.launch({
    polling:{
        allowed_updates: [
            'inline_query',
            'message'
        ]
    }
});
// Production
/*
bot.launch({
    webhook:{
        domain: process.env.webhookDomain,
        hookPath: process.env.WEBHOOKPATH,
        secretToken: process.env.SECRETTOKEN,
        port: 443,
        allowed_updates: [
            'inline_query',
            'message'
        ]
    }
})
*/

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));