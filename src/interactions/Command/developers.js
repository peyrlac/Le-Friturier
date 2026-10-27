const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

const model = require('../../database/models/badge');

module.exports = {
    localizationKey: 'commandMetadata.developers',
    data: new SlashCommandBuilder()
        .setName(getCommandMetadata('commandMetadata.developers.name'))
        .setDescription(getCommandMetadata('commandMetadata.developers.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.developers.subcommands.help.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('eval')
                .setDescription(getCommandMetadata('commandMetadata.developers.subcommands.eval.description'))
                .addStringOption(option => option.setName('code').setDescription(getCommandMetadata('commandMetadata.developers.subcommands.eval.options.code.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('badge')
                .setDescription(getCommandMetadata('commandMetadata.developers.subcommands.badge.description'))
                .addBooleanOption(option => option.setName('new').setDescription(getCommandMetadata('commandMetadata.developers.subcommands.badge.options.new.description')).setRequired(true))
                .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.developers.subcommands.badge.options.user.description')).setRequired(true))
                .addStringOption(option => option.setName('badge').setDescription(getCommandMetadata('commandMetadata.developers.subcommands.badge.options.badge.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('ban')
                .setDescription(getCommandMetadata('commandMetadata.developers.subcommands.ban.description'))
                .addBooleanOption(option => option.setName('new').setDescription(getCommandMetadata('commandMetadata.developers.subcommands.ban.options.new.description')).setRequired(true))
                .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.developers.subcommands.ban.options.user.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('credits')
                .setDescription(getCommandMetadata('commandMetadata.developers.subcommands.credits.description'))
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription(getCommandMetadata('commandMetadata.developers.subcommands.credits.options.type.description'))
                        .setRequired(true)
                        .addChoices(
                            { name: 'Add', value: 'add' },
                            { name: 'Remove', value: 'remove' }
                        )
                )
                .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.developers.subcommands.credits.options.user.description')).setRequired(true))
                .addNumberOption(option => option.setName('amount').setDescription(getCommandMetadata('commandMetadata.developers.subcommands.credits.options.amount.description')).setMinValue(1).setMaxValue(1000000000).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('args')
                .setDescription(getCommandMetadata('commandMetadata.developers.subcommands.args.description'))
                .addStringOption(option =>
                    option.setName('message')
                        .setDescription(getCommandMetadata('commandMetadata.developers.subcommands.args.options.message.description'))
                        .setRequired(true)
                        .addChoices(
                            { name: 'Information', value: 'information' },
                            { name: 'Rules', value: 'rules' },
                            { name: 'Applications', value: 'applications' },
                            { name: 'Booster perks', value: 'boosterperks' },
                            { name: 'Links', value: 'links' },
                            { name: 'Rewards', value: 'rewards' },
                            { name: 'Our bots', value: 'ourbots' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('servers')
                .setDescription(getCommandMetadata('commandMetadata.developers.subcommands.servers.description'))
        )
    ,

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        const data = await model.findOne({ User: interaction.user.id });
        if (data && data.FLAGS.includes("DEVELOPER")) {
            await interaction.deferReply();
            return client.loadSubcommands(client, interaction, args);
        }

        return client.errNormal({
            key: 'errors.developerOnly',
            type: 'ephemeral'
        }, interaction)
    },
};

 
