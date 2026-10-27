const Discord = require('discord.js');

const BlackList = require("../../database/models/blacklist");

module.exports = async (client) => {
    client.on(Discord.Events.MessageCreate, async (message) => {
        if (message.channel.type === Discord.ChannelType.DM) return;

        try {
            const data = await BlackList.findOne({ Guild: message.guild.id });
            if (data) {
                const lowerMsg = message.content.toLowerCase();
                const splittedMsg = lowerMsg.split(' ');

                const deleting = splittedMsg.some(content => data.Words.includes(content.toLowerCase()));

                if (deleting) return message.delete({ timeout: 1000 });
            }
        }
        catch { }
    }).setMaxListeners(0);

    client.on(Discord.Events.MessageUpdate, async (oldMessage, newMessage) => {
        if (oldMessage.content === newMessage.content || newMessage.channel.type === Discord.ChannelType.DM) return;
        try {
            const data = await BlackList.findOne({ Guild: oldMessage.guild.id });
            if (data) {
                const lowerMsg = newMessage.content.toLowerCase();
                const splittedMsg = lowerMsg.split(' ');

                const deleting = splittedMsg.some(content => data.Words.includes(content.toLowerCase()));

                if (deleting) return newMessage.delete();
            }
        }
        catch { }
    }).setMaxListeners(0);
}
