const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    data: new SlashCommandBuilder()
        .setName(getCommandMetadata('commandMetadata.invite.name'))
        .setDescription(getCommandMetadata('commandMetadata.invite.description')),

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    localizationKey: 'commandMetadata.invite',

    run: async (client, interaction, args) => {
        await interaction.deferReply();
        let row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel(await client.t(interaction, 'helpResponses.invite'))
                    .setURL(client.config.discord.botInvite)
                    .setStyle(Discord.ButtonStyle.Link),

                new Discord.ButtonBuilder()
                    .setLabel(await client.t(interaction, 'helpResponses.support'))
                    .setURL(client.config.discord.serverInvite)
                    .setStyle(Discord.ButtonStyle.Link),
            );

        client.embed({
            title: await client.t(interaction, 'helpResponses.inviteTitle'),
            desc: await client.t(interaction, 'helpResponses.inviteDescription'),
            image: "https://cdn.discordapp.com/attachments/843487478881976381/874694194474668052/Bot_banner_invite.jpg",
            url: client.config.discord.botInvite,
            components: [row],
            type: 'editreply'
        }, interaction)
    },
};

 
