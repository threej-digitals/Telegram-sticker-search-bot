const { Markup } = require("telegraf");

module.exports.handleInlineQueries = async (ctx, tgbot) => {
    const query = ctx.inlineQuery.query || '';

    //No result for queries with length < 3
    if(query.length < 3){
        await ctx.answerInlineQuery([{
            type: 'article',
            id:1,
            title:'🛑 Please enter atleast 3 characters',
            input_message_content:{
                message_text :'No result'
            }
        }], {cache_time : 315360000});
    }

    switch (true) {
        case true:
            await ctx.answerInlineQuery([
                {
                    type: 'sticker',
                    id: 1,
                    sticker_file_id: 'CAACAgIAAxkBAAII1mMlwfFzU2neIX0t0L2zWjnL0mnsAAJKAANZu_wlnfLJgew3IWApBA'
                }
            ])
        break;
    }
    return true;
}