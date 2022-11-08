const axios = require('axios');
const { Threej } = require('./threej');

const CATEGORIES = ["🦁 Animals & Pets","🎎 Anime","🎨 Art & Paintings","📚 Books","🏎 Cars","💼 Career","💃🏼 Celebrity","👨‍👨‍👧‍👦 Community","⛓ Cryptocurrency","👩‍❤️‍👨 Dating","🎓 Educational","🎭 Entertainment","🧐 Facts","💰 Finance","😂 Funny","🎮 Gaming","🃏 GIFs","💻 Hacking","👩‍⚕️ Health","🧛 Horror","🧠 Knowledge","🔮 Life Hacks","💅🏻 Lifestyle","😂 Memes","🎬 Movies","🌞 Motivational","🏕 Nature","📰 News","🤵🏻 Political","🙋🏼 Personal","🖼 Photography","🏋️ Productive","💻 Programming","🔗 Promotion","🌐 Proxy","🗺 Regional","🥰 Relationship","🔬 Science","🎧 Song","📱 Social","🛒 Shopping","🕉 Spiritual","🏀 Sports","🚀 Startup","🏙 Stickers","📈 Stocks","🤴 Stories","📲 Technical","📨 Telegram","💭 Thoughts","💫 Tips & tricks","✈️ Travelling","🧵 Utility","📹 Videos","🎲 Others",""];

/**
 * Chat action
 */
const CHATACTION = {
    'UPVOTE' : 1,
    'DOWNVOTE' : 2
}

/**
 * Flags for reporting contents
 */
const CHATFLAG = ['SFW','Copyright','NSFW','Spam','Scam','Illegal Activities','Violence','Child Abuse','Dead chat'];

const STICKERTYPE = {
    'regular' : 1,
    'mask' : 2,
    'custom_emoji' : 3
}

class Tgbot extends Threej{
    constructor(){
        super()
    }

    async searchStickersFromEmoji(emoji, options){
        
        var sql = 'SELECT * FROM ?? WHERE EMOJI = ? ' + 
        (options.PREMIUM == 1 ? 'AND ISPREMIUM = 1'
        : options.VIDEO == 1 ? 'AND ISVIDEO = 1'
        : options.ANIMATED == 1 ? 'AND ISANIMATED = 1'
        : options.STATIC == 1 ? 'AND ISANIMATED = 0'
        : '') + ' LIMIT 49';

        try {
            return await this.query(
                sql,
                [
                    process.env.STICKERSTABLE,
                    emoji
                ]
            )
        } catch (error) {
            this.logError(error);
            return false;
        }
    }

    async searchStickers(query, options){
        var sql = 'SELECT * FROM ?? WHERE SETID IN (SELECT SETID FROM ?? WHERE (NAME LIKE ? OR TITLE LIKE ?) AND FLAG < 1 )' + 
        (options.PREMIUM == 1 ? ' AND ISPREMIUM = 1'
        : options.VIDEO == 1 ? ' AND ISVIDEO = 1'
        : options.ANIMATED == 1 ? ' AND ISANIMATED = 1'
        : options.STATIC == 1 ? ' AND ISANIMATED = 0'
        : '') + ' LIMIT 49';
        try {
            return await this.query(
                sql,
                [
                    process.env.STICKERSTABLE,
                    process.env.STICKERSETTABLE,
                    `%${query}%` || '%',
                    `%${query}%` || '%'
                ]
            )
        } catch (error) {
            this.logError(error);
            return false;
        }
    }

    /**
     * 
     * @param {object} error Error object received from telegram api
     * @returns {boolean}
    */
    knownErrors(error){
        const dismissableErrors = [
            'not enough rights',
            'message to delete not found',
            'bot was kicked',
            'not in the chat',
            'need to be inviter of a user',
            'matching document found for id',
            'bot is not a member',
            'user is an administrator of the chat',
            'user_not_participant',
            'chat_admin_required',
            "message can't be deleted",
            'group chat was upgraded to a supergroup',
            'channel_private',
            'method is available only for supergroups',
            'have no rights to send a message',
            'chat_write_forbidden',
            'message identifier is not specified',
            'demote chat creator',
            'user_banned_in_channel',
            'too many requests',
            'message is not modified',
            'user not found',
            'webdocument_url_invalid',
            'bot was blocked by the user',
            'chat not found',
            'chat is not eligible for listing.',
            'bot can\'t initiate conversation with a user'
        ];
        for (const message of dismissableErrors) {
            if (error.message.toLowerCase().indexOf(message) > -1) {
                return true;
            }
        }
        return false;
    }
}

module.exports = { Tgbot };