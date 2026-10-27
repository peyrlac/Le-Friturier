const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const moment = require("moment");
require("moment-duration-format");
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    data: new SlashCommandBuilder()
        .setName(getCommandMetadata('commandMetadata.help.name'))
        .setDescription(getCommandMetadata('commandMetadata.help.description')),

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    localizationKey: 'commandMetadata.help',

    run: async (client, interaction, args) => {
        await interaction.deferReply();
        const row = new Discord.ActionRowBuilder()
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
                            description: await client.t(interaction, 'helpResponses.inviteDescription'),
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
                            description: await client.t(interaction, 'helpResponses.changelogsDescription'),
                            emoji: "📃",
                            value: "changelogs-Bothelp",
                        },
                    ]),
            );

        return client.embed({
            title: await client.t(interaction, 'helpResponses.title'),
            desc: await client.t(interaction, 'helpResponses.description'),
            image: "https://cdn.discordapp.com/attachments/843487478881976381/874694194474668052/Bot_banner_invite.jpg",
            fields: [
                {
                    name: await client.t(interaction, 'helpResponses.menuBroken'),
                    value: await client.t(interaction, 'helpResponses.menuBrokenValue')
                },
                {
                    name: await client.t(interaction, 'helpResponses.bug'),
                    value: await client.t(interaction, 'helpResponses.bugValue')
                },
                {
                    name: await client.t(interaction, 'helpResponses.links'),
                    value: await client.t(interaction, 'helpResponses.linksValue', { invite: client.config.discord.botInvite })
                },
            ],
            components: [row],
            type: 'editreply'
        }, interaction)
    },
};

 
