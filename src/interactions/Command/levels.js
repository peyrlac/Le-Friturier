const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const Schema = require("../../database/models/functions");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('levels')
        .setDescription('View the level system')
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription('Get information about the levels category commands')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('setlevel')
                .setDescription('Set a new level for a user')
                .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
                .addNumberOption(option => option.setName('level').setDescription('Enter a new level').setMinValue(0).setMaxValue(1000).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('deletereward')
                .setDescription('Delete a level reward')
                .addNumberOption(option => option.setName('level').setDescription('Enter a level').setMinValue(0).setMaxValue(1000).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('createreward')
                .setDescription('Create a level reward')
                .addNumberOption(option => option.setName('level').setDescription('Enter a level').setMinValue(0).setMaxValue(1000).setRequired(true))
                .addRoleOption(option => option.setName('role').setDescription('The role for this reward').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('setxp')
                .setDescription('Set a new xp for a user')
                .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
                .addNumberOption(option => option.setName('amount').setDescription('Enter a amount of xp').setMinValue(1).setMaxValue(1000000000).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('rank')
                .setDescription('See your current rank')
                .addUserOption(option => option.setName('user').setDescription('Select a user'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('rewards')
                .setDescription('Show all level rewards')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('leaderboard')
                .setDescription('See the level leaderboard')
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

 
