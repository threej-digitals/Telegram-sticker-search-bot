const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

module.exports.handleCommands = function(update){
    bot.handleUpdate(update);

    // /start in groups
    bot.command('start' + process.env.BOT_USERNAME, async (ctx)=>{
        //send menu for interaction
        await ctx.reply(`I will help you finding telegram sticker.`,{
            reply_markup : Markup.inlineKeyboard([
                [
                    Markup.button.switchToCurrentChat('🔎 Search stickers','')
                ],
                [
                    Markup.button.url('➕ Add sticker','https://t.me/threej_bot'),
                ]
            ]).reply_markup
        });
    })

    // /start in private chat with bot
    bot.command('start', async (ctx)=>{

        if (ctx.chat?.type !== 'private') return;

        //send menu for interaction
        await ctx.reply(
            `Hello ${ctx.from.first_name}, nice to meet you.\n\nYou can use me anywhere in telegram to search stickers. Just type my username or click on the below button.\n\nJoin @stickers3j`,
            {
                reply_markup: Markup.inlineKeyboard([
                    [
                        Markup.button.switchToChat('🔎 Search stickers',''),
                        Markup.button.callback('🕵️‍♂️ Advance search','secondaryMenu')
                    ],
                    [
                        Markup.button.url('➕ Add sticker','https://t.me/threej_bot'),
                        Markup.button.url('😺 Contribute','https://github.com/threej-digitals/Telegram-sticker-search-bot')
                    ],
                    [
                        Markup.button.callback('⚙️ Preferences', 'Preferences')
                    ]
                ]).reply_markup
            }
        );
        return true;
    })

    // unknown commands
    bot.command(update.message.text, async ctx=>{
        return await ctx.reply('Unknown command.',{
            reply_markup : Markup.inlineKeyboard([
                [Markup.button.switchToChat('Search stickers','')]
            ]).reply_markup            
        });
    })

    return true;
}