const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    data: new SlashCommandBuilder()
        .setName(getCommandMetadata('commandMetadata.event.name'))
        .setDescription(getCommandMetadata('commandMetadata.event.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.event.subcommands.help.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('participants')
                .setDescription(getCommandMetadata('commandMetadata.event.subcommands.participants.description'))
                .addStringOption(option => 
                    option
                        .setName('event_id')
                        .setDescription(getCommandMetadata('commandMetadata.event.subcommands.participants.options.event_id.description'))
                        .setRequired(false)
                )
        ),

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    localizationKey: 'commandMetadata.event',

    run: async (client, interaction, args) => {
        await interaction.deferReply({ ephemeral: true });
        client.loadSubcommands(client, interaction, args);
    },
};
