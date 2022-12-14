const axios = require('axios');
const { Threej } = require('./threej');

const CATEGORIES = ["๐ฆ Animals & Pets","๐ Anime","๐จ Art & Paintings","๐ Books","๐ Cars","๐ผ Career","๐๐ผ Celebrity","๐จโ๐จโ๐งโ๐ฆ Community","โ Cryptocurrency","๐ฉโโค๏ธโ๐จ Dating","๐ Educational","๐ญ Entertainment","๐ง Facts","๐ฐ Finance","๐ Funny","๐ฎ Gaming","๐ GIFs","๐ป Hacking","๐ฉโโ๏ธ Health","๐ง Horror","๐ง  Knowledge","๐ฎ Life Hacks","๐๐ป Lifestyle","๐ Memes","๐ฌ Movies","๐ Motivational","๐ Nature","๐ฐ News","๐คต๐ป Political","๐๐ผ Personal","๐ผ Photography","๐๏ธ Productive","๐ป Programming","๐ Promotion","๐ Proxy","๐บ Regional","๐ฅฐ Relationship","๐ฌ Science","๐ง Song","๐ฑ Social","๐ Shopping","๐ Spiritual","๐ Sports","๐ Startup","๐ Stickers","๐ Stocks","๐คด Stories","๐ฒ Technical","๐จ Telegram","๐ญ Thoughts","๐ซ Tips & tricks","โ๏ธ Travelling","๐งต Utility","๐น Videos","๐ฒ Others",""];

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

    async logUser(user){
        const result = await this.query('SELECT * FROM STICKERUSERS WHERE TGID = ?',[
            user.id || 0
        ]);

        if(result.length == 0){
            await this.query('INSERT INTO STICKERUSERS VALUES(?, ?)',[
                user.id,
                0
            ]);
            return this.user = {
                TGID : user.id,
                ISNSFW: 0
            }
        }else{
            return this.user = result[0];
        }

        
    }

    async searchStickersFromEmoji(emoji, options){
        
        var sql = 'SELECT * FROM ?? WHERE EMOJI = ? ' + 
        (options.PREMIUM == 1 ? 'AND ISPREMIUM = 1'
        : options.VIDEO == 1 ? 'AND ISVIDEO = 1'
        : options.ANIMATED == 1 ? 'AND ISANIMATED = 1'
        : options.STATIC == 1 ? 'AND ISANIMATED = 0'
        : '') + ' AND SETID IN(SELECT SETID FROM STICKERSET WHERE ' + (this.user.ISNSFW ? 'FLAG > 1' : 'FLAG < 1') + ') LIMIT 49';

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
        var sql = 'SELECT * FROM ?? WHERE SETID IN (SELECT SETID FROM ?? WHERE (NAME LIKE ? OR TITLE LIKE ?) ' + (this.user.ISNSFW ? '' : 'AND FLAG < 1') + ' )' + 
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

    async updatePreference(options){
        return await this.query('UPDATE STICKERUSERS SET ISNSFW = ? WHERE TGID = ?',[
            options.ISNSFW || 0,
            this.user.TGID
        ]);
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