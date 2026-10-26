const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('messages')
        .setDescription(getCommandMetadata('commandMetadata.messages.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.messages.subcommands.help.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription(getCommandMetadata('commandMetadata.messages.subcommands.add.description'))
                .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.messages.subcommands.add.options.user.description')).setRequired(true))
                .addNumberOption(option => option.setName('amount').setDescription(getCommandMetadata('commandMetadata.messages.subcommands.add.options.amount.description')).setMinValue(1).setMaxValue(1000000).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('deletereward')
                .setDescription(getCommandMetadata('commandMetadata.messages.subcommands.deletereward.description'))
                .addNumberOption(option => option.setName('amount').setDescription(getCommandMetadata('commandMetadata.messages.subcommands.deletereward.options.amount.description')).setMinValue(1).setMaxValue(1000000).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('createreward')
                .setDescription(getCommandMetadata('commandMetadata.messages.subcommands.createreward.description'))
                .addNumberOption(option => option.setName('amount').setDescription(getCommandMetadata('commandMetadata.messages.subcommands.createreward.options.amount.description')).setMinValue(1).setMaxValue(1000000).setRequired(true))
                .addRoleOption(option => option.setName('role').setDescription(getCommandMetadata('commandMetadata.messages.subcommands.createreward.options.role.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription(getCommandMetadata('commandMetadata.messages.subcommands.remove.description'))
                .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.messages.subcommands.remove.options.user.description')).setRequired(true))
                .addNumberOption(option => option.setName('amount').setDescription(getCommandMetadata('commandMetadata.messages.subcommands.remove.options.amount.description')).setMinValue(1).setMaxValue(1000000).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('show')
                .setDescription(getCommandMetadata('commandMetadata.messages.subcommands.show.description'))
                .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.messages.subcommands.show.options.user.description')))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('rewards')
                .setDescription(getCommandMetadata('commandMetadata.messages.subcommands.rewards.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('leaderboard')
                .setDescription(getCommandMetadata('commandMetadata.messages.subcommands.leaderboard.description'))
        )
    ,

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    localizationKey: 'commandMetadata.messages',

    run: async (client, interaction, args) => {
        await interaction.deferReply();
        client.loadSubcommands(client, interaction, args);
    },
};

 
