const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
    let row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setLabel(await client.t(interaction, 'botResponses.donateButton'))
                .setURL("https://github.com/sponsors/CorwinDev")
                .setStyle(Discord.ButtonStyle.Link),
        );

    client.embed({
        title: await client.t(interaction, 'botResponses.donateTitle', { bot: client.user.username }),
        desc: await client.t(interaction, 'botResponses.donateDescription'),
        thumbnail: client.user.avatarURL({ dynamic: true }),
        url: "https://github.com/sponsors/CorwinDev",
        components: [row],
        type: 'editreply'
    }, interaction)
}
