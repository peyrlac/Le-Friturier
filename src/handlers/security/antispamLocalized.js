const Discord = require('discord.js');
const Functions = require('../../database/models/functions');

const usersMap = new Map();
const LIMIT = 5;
const TIME = 10000;
const DIFF = 3000;

module.exports = (client) => {
    client.on(Discord.Events.MessageCreate, async message => {
        if (!message.guild || message.author.bot || message.channel.type === Discord.ChannelType.DM) return;
        if (typeof client.isFeatureEnabled === 'function' &&
            !(await client.isFeatureEnabled('antiSpam', message.guild.id))) return;
        const config = await Functions.findOne({ Guild: message.guild.id });
        if (!config?.AntiSpam) return;

        const userData = usersMap.get(message.author.id);
        if (!userData) {
            const timer = setTimeout(() => usersMap.delete(message.author.id), TIME);
            usersMap.set(message.author.id, { msgCount: 1, lastMessage: message, timer });
            return;
        }

        const difference = message.createdTimestamp - userData.lastMessage.createdTimestamp;
        if (difference > DIFF) {
            clearTimeout(userData.timer);
            userData.msgCount = 1;
            userData.lastMessage = message;
            userData.timer = setTimeout(() => usersMap.delete(message.author.id), TIME);
            usersMap.set(message.author.id, userData);
            return;
        }

        userData.msgCount += 1;
        userData.lastMessage = message;
        if (userData.msgCount >= LIMIT) {
            usersMap.delete(message.author.id);
            await message.delete().catch(() => {});
            return client.embed({
                titleKey: 'security.moderationTitle',
                descKey: 'security.spamBlocked',
                color: client.config.colors.error,
                content: String(message.author)
            }, message.channel);
        }
        usersMap.set(message.author.id, userData);
    });
};
