const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    data: new SlashCommandBuilder()
        .setName(getCommandMetadata('commandMetadata.voice.name'))
        .setDescription(getCommandMetadata('commandMetadata.voice.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.voice.subcommands.help.description'))
        ).addSubcommand(subcommand =>
            subcommand
                .setName('limit')
                .setDescription(getCommandMetadata('commandMetadata.voice.subcommands.limit.description'))
                .addNumberOption(option => option.setName('limit').setDescription(getCommandMetadata('commandMetadata.voice.subcommands.limit.options.limit.description')).setMinValue(1).setMaxValue(99).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('lock')
                .setDescription(getCommandMetadata('commandMetadata.voice.subcommands.lock.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('rename')
                .setDescription(getCommandMetadata('commandMetadata.voice.subcommands.rename.description'))
                .addStringOption(option => option.setName('name').setDescription(getCommandMetadata('commandMetadata.voice.subcommands.rename.options.name.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('unlock')
                .setDescription(getCommandMetadata('commandMetadata.voice.subcommands.unlock.description'))
        )
    ,

    localizationKey: 'commandMetadata.voice',

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        await interaction.deferReply({ ephemeral: true });
        client.loadSubcommands(client, interaction, args);
    },
};

 
