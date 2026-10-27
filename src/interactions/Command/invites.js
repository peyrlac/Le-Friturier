const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    data: new SlashCommandBuilder()
        .setName(getCommandMetadata('commandMetadata.invites.name'))
        .setDescription(getCommandMetadata('commandMetadata.invites.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.invites.subcommands.help.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription(getCommandMetadata('commandMetadata.invites.subcommands.add.description'))
                .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.invites.subcommands.add.options.user.description')).setRequired(true))
                .addNumberOption(option => option.setName('amount').setDescription(getCommandMetadata('commandMetadata.invites.subcommands.add.options.amount.description')).setMinValue(1).setMaxValue(1000000).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription(getCommandMetadata('commandMetadata.invites.subcommands.remove.description'))
                .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.invites.subcommands.remove.options.user.description')).setRequired(true))
                .addNumberOption(option => option.setName('amount').setDescription(getCommandMetadata('commandMetadata.invites.subcommands.remove.options.amount.description')).setMinValue(1).setMaxValue(1000000).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('show')
                .setDescription(getCommandMetadata('commandMetadata.invites.subcommands.show.description'))
                .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.invites.subcommands.show.options.user.description')))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('leaderboard')
                .setDescription(getCommandMetadata('commandMetadata.invites.subcommands.leaderboard.description'))
        )
    ,

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    localizationKey: 'commandMetadata.invites',

    run: async (client, interaction, args) => {
        await interaction.deferReply();
        client.loadSubcommands(client, interaction, args);
    },
};

 
