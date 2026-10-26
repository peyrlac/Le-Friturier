const Discord = require('discord.js');

module.exports = async (client) => {
    client.on(Discord.Events.InteractionCreate, async (interaction) => {
        if (!interaction.isStringSelectMenu()) return;

        if (interaction.customId == "Bot-helppanel") {
            if (interaction.values == "support-Bothelp") {
                interaction.deferUpdate();

                const row2 = new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.StringSelectMenuBuilder()
                            .setCustomId('Bot-helppanel')
                            .setPlaceholder(await client.t(interaction, 'helpResponses.placeholder'))
                            .addOptions([
                                {
                                    label: await client.t(interaction, 'helpResponses.commands'),
                                    description: await client.t(interaction, 'helpResponses.commandsDescription'),
                                    emoji: "💻",
                                    value: "commands-Bothelp",
                                },
                                {
                                    label: await client.t(interaction, 'helpResponses.invite'),
                                    description: await client.t(interaction, 'helpResponses.inviteDescription', { bot: client.user.username }),
                                    emoji: "📨",
                                    value: "invite-Bothelp",
                                },
                                {
                                    label: await client.t(interaction, 'helpResponses.support'),
                                    description: await client.t(interaction, 'helpResponses.supportDescription'),
                                    emoji: "❓",
                                    value: "support-Bothelp",
                                },
                                {
                                    label: await client.t(interaction, 'helpResponses.changelogs'),
                                    description: await client.t(interaction, 'helpResponses.changelogsDescription', { bot: client.user.username }),
                                    emoji: "📃",
                                    value: "changelogs-Bothelp",
                                },
                            ]),
                    );

                let row = new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setLabel(await client.t(interaction, 'helpResponses.support'))
                            .setURL(client.config.discord.serverInvite)
                            .setStyle(Discord.ButtonStyle.Link),
                    );

                client.embed({
                    title: await client.t(interaction, 'helpResponses.supportTitle'),
                    desc: await client.t(interaction, 'helpResponses.supportPanelDescription', { bot: client.user.username }),
                    image: "https://cdn.discordapp.com/attachments/843487478881976381/874694194474668052/Bot_banner_invite.jpg",
                    url: client.config.discord.serverInvite,
                    components: [row2, row],
                    type: 'edit'
                }, interaction.message)
            }
        }
    }).setMaxListeners(0);
}
