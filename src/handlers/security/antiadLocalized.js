const Discord = require('discord.js');
const Functions = require('../../database/models/functions');
const ChannelList = require('../../database/models/channelList');

module.exports = (client) => {
    const handle = async message => {
        if (!message.guild || message.author.bot || message.channel.type === Discord.ChannelType.DM) return;
        const config = await Functions.findOne({ Guild: message.guild.id });
        if (!config || (!config.AntiInvite && !config.AntiLinks)) return;

        const content = message.content || '';
        const isInvite = content.includes('discord.gg/');
        const isLink = content.includes('http://') || content.includes('https://') || content.includes('www.');
        const kind = config.AntiInvite && isInvite ? 'invite' : config.AntiLinks && isLink ? 'link' : null;
        if (!kind || message.member?.permissions.has(Discord.PermissionsBitField.Flags.ManageMessages)) return;

        const allowlist = await ChannelList.findOne({ Guild: message.guild.id });
        if (Array.isArray(allowlist?.Channels) && allowlist.Channels.includes(message.channel.id)) return;

        await message.delete().catch(() => {});
        await client.embed({
            titleKey: 'security.moderationTitle',
            descKey: kind === 'invite' ? 'security.invitesBlocked' : 'security.linksBlocked',
            color: client.config.colors.error,
            content: String(message.author)
        }, message.channel);
    };

    client.on(Discord.Events.MessageCreate, handle);
    client.on(Discord.Events.MessageUpdate, async (oldMessage, newMessage) => {
        if (oldMessage.content !== newMessage.content) await handle(newMessage);
    });
};
