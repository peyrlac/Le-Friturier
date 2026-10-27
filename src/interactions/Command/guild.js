const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    localizationKey: 'commandMetadata.guild',
    data: new SlashCommandBuilder()
        .setName(getCommandMetadata('commandMetadata.guild.name'))
        .setDescription(getCommandMetadata('commandMetadata.guild.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.guild.subcommands.help.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('channelinfo')
                .setDescription(getCommandMetadata('commandMetadata.guild.subcommands.channelinfo.description'))
                .addChannelOption(option => option.setName('channel').setDescription(getCommandMetadata('commandMetadata.guild.subcommands.channelinfo.options.channel.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('members')
                .setDescription(getCommandMetadata('commandMetadata.guild.subcommands.members.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('oldestmember')
                .setDescription(getCommandMetadata('commandMetadata.guild.subcommands.oldestmember.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('roleinfo')
                .setDescription(getCommandMetadata('commandMetadata.guild.subcommands.roleinfo.description'))
                .addRoleOption(option => option.setName('role').setDescription(getCommandMetadata('commandMetadata.guild.subcommands.roleinfo.options.role.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription(getCommandMetadata('commandMetadata.guild.subcommands.info.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('stealemoji')
                .setDescription(getCommandMetadata('commandMetadata.guild.subcommands.stealemoji.description'))
                .addStringOption(option => option.setName('emoji').setDescription(getCommandMetadata('commandMetadata.guild.subcommands.stealemoji.options.emoji.description')).setRequired(true))
                .addRoleOption(option => option.setName('role').setDescription(getCommandMetadata('commandMetadata.guild.subcommands.stealemoji.options.role.description')).setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('youngestmember')
                .setDescription(getCommandMetadata('commandMetadata.guild.subcommands.youngestmember.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('userinfo')
                .setDescription(getCommandMetadata('commandMetadata.guild.subcommands.userinfo.description'))
                .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.guild.subcommands.userinfo.options.user.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('inviteinfo')
                .setDescription(getCommandMetadata('commandMetadata.guild.subcommands.inviteinfo.description'))
                .addStringOption(option => option.setName('invite').setDescription(getCommandMetadata('commandMetadata.guild.subcommands.inviteinfo.options.invite.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('emojis')
                .setDescription(getCommandMetadata('commandMetadata.guild.subcommands.emojis.description'))
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

 
