module.exports.handleInlineQueries = async (ctx, tgbot) => {
    // Regex to match emojis
    const emoji = /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/u;

    var query = ctx.inlineQuery.query || '';

    var stickersArray = [{
        type: 'article',
        id: 1,
        title: 'No stickers found!',
        input_message_content: {
            message_text: 'No stickers found!'
        }
    }];

    var options = {
        STATIC : 0,
        ANIMATED : 0,
        VIDEO : 0,
        PREMIUM : 0
    }

    //extract filter from query
    const filter = query.match(/^([ASVP]) ?.*/);
    if(filter && filter.length === 2){
        //remove filter from query
        query = query.substring(2);

        filter[1] == 'A' ? options.ANIMATED = 1
        : filter[1] == 'S' ? options.STATIC = 1
        : filter[1] == 'V' ? options.VIDEO = 1
        : filter[1] == 'P' ? options.PREMIUM = 1 : '';
    }

    // search stickers using emoji or set name
    const stickers = emoji.test(query)
    ? await tgbot.searchStickersFromEmoji(query, options)
    : await tgbot.searchStickers(query, options);

    if(typeof stickers == 'object' && stickers.length > 0){
        stickersArray = [];
        var i = 0;
        stickers.forEach(sticker => {
            stickersArray.push({
                type: 'sticker',
                id: i++,
                sticker_file_id: sticker.FILEID
            })
        })
    }

    try {
        await ctx.answerInlineQuery(stickersArray)
        return true;
    } catch (error) {
        if(!tgbot.knownErrors(error.message)){
            tgbot.logError()
        }
    }
}