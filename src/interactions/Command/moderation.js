const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const { ChannelType } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    localizationKey: 'commandMetadata.moderation',
    data: new SlashCommandBuilder()
        .setName(getCommandMetadata('commandMetadata.moderation.name'))
        .setDescription(getCommandMetadata('commandMetadata.moderation.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.help.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('ban')
                .setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.ban.description'))
                .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.ban.options.user.description')).setRequired(true))
                .addStringOption(option => option.setName('reason').setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.ban.options.reason.description')))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('clear')
                .setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.clear.description'))
                .addNumberOption(option => option.setName('amount').setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.clear.options.amount.description')).setMinValue(1).setMaxValue(100).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('clearuser')
                .setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.clearuser.description'))
                .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.clearuser.options.user.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('demote')
                .setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.demote.description'))
                .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.demote.options.user.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('kick')
                .setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.kick.description'))
                .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.kick.options.user.description')).setRequired(true))
                .addStringOption(option => option.setName('reason').setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.kick.options.reason.description')))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('lock')
                .setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.lock.description'))
                .addChannelOption(option => option.setName('channel').setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.lock.options.channel.description')).addChannelTypes(ChannelType.GuildText))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('lockdown')
                .setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.lockdown.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('nuke')
                .setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.nuke.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('softban')
                .setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.softban.description'))
                .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.softban.options.user.description')).setRequired(true))
                .addStringOption(option => option.setName('reason').setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.softban.options.reason.description')))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('timeout')
                .setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.timeout.description'))
                .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.timeout.options.user.description')).setRequired(true))
                .addNumberOption(option => option.setName('time').setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.timeout.options.time.description')).setMinValue(1).setMaxValue(10080).setRequired(true))
                .addStringOption(option => option.setName('reason').setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.timeout.options.reason.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('tempban')
                .setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.tempban.description'))
                .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.tempban.options.user.description')).setRequired(true))
                .addNumberOption(option => option.setName('time').setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.tempban.options.time.description')).setMinValue(1).setMaxValue(10080).setRequired(true))
                .addStringOption(option => option.setName('reason').setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.tempban.options.reason.description')))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('unlock')
                .setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.unlock.description'))
                .addChannelOption(option => option.setName('channel').setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.unlock.options.channel.description')).addChannelTypes(ChannelType.GuildText))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('unban')
                .setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.unban.description'))
                .addStringOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.unban.options.user.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('banlist')
                .setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.banlist.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('warn')
                .setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.warn.description'))
                .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.warn.options.user.description')).setRequired(true))
                .addStringOption(option => option.setName('reason').setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.warn.options.reason.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('unwarn')
                .setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.unwarn.description'))
                .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.unwarn.options.user.description')).setRequired(true))
                .addIntegerOption(option => option.setName('case').setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.unwarn.options.case.description')).setMinValue(1).setMaxValue(1000000).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('warnings')
                .setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.warnings.description'))
                .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.moderation.subcommands.warnings.options.user.description')).setRequired(true))
        )
    ,
    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        await interaction.deferReply();
        client.loadSubcommands(client, interaction, args);
    },
};

 
