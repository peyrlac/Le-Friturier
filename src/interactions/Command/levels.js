const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const Schema = require("../../database/models/functions");
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('levels')
        .setDescription(getCommandMetadata('commandMetadata.levels.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.levels.subcommands.help.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('setlevel')
                .setDescription(getCommandMetadata('commandMetadata.levels.subcommands.setlevel.description'))
                .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.levels.subcommands.setlevel.options.user.description')).setRequired(true))
                .addNumberOption(option => option.setName('level').setDescription(getCommandMetadata('commandMetadata.levels.subcommands.setlevel.options.level.description')).setMinValue(0).setMaxValue(1000).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('deletereward')
                .setDescription(getCommandMetadata('commandMetadata.levels.subcommands.deletereward.description'))
                .addNumberOption(option => option.setName('level').setDescription(getCommandMetadata('commandMetadata.levels.subcommands.deletereward.options.level.description')).setMinValue(0).setMaxValue(1000).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('createreward')
                .setDescription(getCommandMetadata('commandMetadata.levels.subcommands.createreward.description'))
                .addNumberOption(option => option.setName('level').setDescription(getCommandMetadata('commandMetadata.levels.subcommands.createreward.options.level.description')).setMinValue(0).setMaxValue(1000).setRequired(true))
                .addRoleOption(option => option.setName('role').setDescription(getCommandMetadata('commandMetadata.levels.subcommands.createreward.options.role.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('setxp')
                .setDescription(getCommandMetadata('commandMetadata.levels.subcommands.setxp.description'))
                .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.levels.subcommands.setxp.options.user.description')).setRequired(true))
                .addNumberOption(option => option.setName('amount').setDescription(getCommandMetadata('commandMetadata.levels.subcommands.setxp.options.amount.description')).setMinValue(1).setMaxValue(1000000000).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('rank')
                .setDescription(getCommandMetadata('commandMetadata.levels.subcommands.rank.description'))
                .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.levels.subcommands.rank.options.user.description')))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('rewards')
                .setDescription(getCommandMetadata('commandMetadata.levels.subcommands.rewards.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('leaderboard')
                .setDescription(getCommandMetadata('commandMetadata.levels.subcommands.leaderboard.description'))
        )
    ,

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    localizationKey: 'commandMetadata.levels',

    run: async (client, interaction, args) => {
        const guild = await Schema.findOne({ Guild: interaction.guild.id });
        if (!guild.Levels) return client.errNormal({
            key: 'levels.disabled',
            type: 'ephemeral'
        }, interaction);

        await interaction.deferReply();
        client.loadSubcommands(client, interaction, args);
    },
};

 
