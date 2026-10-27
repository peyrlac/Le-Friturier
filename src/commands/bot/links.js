const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
    const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.StringSelectMenuBuilder()
                .setCustomId('Bot-linkspanel')
                .setPlaceholder(await client.t(interaction, 'botResponses.linksPlaceholder'))
                .addOptions([
                    {
                        label: await client.t(interaction, 'botResponses.supportServer'),
                        description: await client.t(interaction, 'botResponses.supportServerDescription'),
                        emoji: "❓",
                        value: "support-linkspanel",
                    },
                    {
                        label: await client.t(interaction, 'botResponses.inviteBot'),
                        description: await client.t(interaction, 'botResponses.inviteBotDescription'),
                        emoji: "📨",
                        value: "invite-linkspanel",
                    },
                    {
                        label: await client.t(interaction, 'botResponses.communityServer'),
                        description: await client.t(interaction, 'botResponses.communityServerDescription'),
                        emoji: "🌍",
                        value: "community-linkspanel",
                    },
                    {
                        label: await client.t(interaction, 'botResponses.topgg'),
                        description: await client.t(interaction, 'botResponses.topggDescription'),
                        emoji: "📃",
                        value: "top.gg-linkspanel",
                    },
                ]),
        );

    client.embed({
        title: await client.t(interaction, 'botResponses.linksTitle'),
        desc: await client.t(interaction, 'botResponses.linksDescription'),
        image: "https://cdn.discordapp.com/attachments/843487478881976381/874694194474668052/Bot_banner_invite.jpg",
        components: [row],
        type: 'editreply'
    }, interaction)
}
