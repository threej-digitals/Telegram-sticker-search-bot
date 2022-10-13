const axios = require('axios');
const qs = require('qs');
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

    async searchStickersFromEmoji(emoji){
        try {
            return await this.query(
                'SELECT * FROM ?? WHERE EMOJI = ?',
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

    async searchStickerSet(setName){
        try {
            return await this.query(
                'SELECT * FROM ?? WHERE ?? = ?',
                [
                    process.env.STICKERSETTABLE,
                    !Math.round(setName) ? 'NAME' : 'SETID',
                    setName || ''
                ]
            )
        } catch (error) {
            this.logError(error);
            return false;
        }
    }
}

module.exports = { Tgbot };