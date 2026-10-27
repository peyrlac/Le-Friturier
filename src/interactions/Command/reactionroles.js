const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const { ChannelType } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reactionroles')
        .setDescription(getCommandMetadata('commandMetadata.reactionroles.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.reactionroles.subcommands.help.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription(getCommandMetadata('commandMetadata.reactionroles.subcommands.add.description'))
                .addStringOption(option => option.setName('category').setDescription(getCommandMetadata('commandMetadata.reactionroles.subcommands.add.options.category.description')).setRequired(true))
                .addRoleOption(option => option.setName('role').setDescription(getCommandMetadata('commandMetadata.reactionroles.subcommands.add.options.role.description')).setRequired(true))
                .addStringOption(option => option.setName('emoji').setDescription(getCommandMetadata('commandMetadata.reactionroles.subcommands.add.options.emoji.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription(getCommandMetadata('commandMetadata.reactionroles.subcommands.delete.description'))
                .addStringOption(option => option.setName('category').setDescription(getCommandMetadata('commandMetadata.reactionroles.subcommands.delete.options.category.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription(getCommandMetadata('commandMetadata.reactionroles.subcommands.list.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('button')
                .setDescription(getCommandMetadata('commandMetadata.reactionroles.subcommands.button.description'))
                .addStringOption(option => option.setName('category').setDescription(getCommandMetadata('commandMetadata.reactionroles.subcommands.button.options.category.description')).setRequired(true))
                .addChannelOption(option => option.setName('channel').setDescription(getCommandMetadata('commandMetadata.reactionroles.subcommands.button.options.channel.description')).addChannelTypes(ChannelType.GuildText))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('menu')
                .setDescription(getCommandMetadata('commandMetadata.reactionroles.subcommands.menu.description'))
                .addStringOption(option => option.setName('category').setDescription(getCommandMetadata('commandMetadata.reactionroles.subcommands.menu.options.category.description')).setRequired(true))
                .addChannelOption(option => option.setName('channel').setDescription(getCommandMetadata('commandMetadata.reactionroles.subcommands.menu.options.channel.description')).addChannelTypes(ChannelType.GuildText))
        )
    ,

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    localizationKey: 'commandMetadata.reactionroles',

    run: async (client, interaction, args) => {
        await interaction.deferReply();
        const perms = await client.checkPerms({
            flags: [Discord.PermissionsBitField.Flags.ManageRoles],
            perms: [Discord.PermissionsBitField.Flags.ManageRoles]
        }, interaction)

        if (perms == false) return;

        client.loadSubcommands(client, interaction, args);
    },
};

 
