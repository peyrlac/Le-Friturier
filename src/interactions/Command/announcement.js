const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder, ChannelType } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    data: new SlashCommandBuilder()
        .setName(getCommandMetadata('commandMetadata.announcement.name'))
        .setDescription(getCommandMetadata('commandMetadata.announcement.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.announcement.subcommands.help.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription(getCommandMetadata('commandMetadata.announcement.subcommands.create.description'))
                .addChannelOption(option => option.setName('channel').setDescription(getCommandMetadata('commandMetadata.announcement.subcommands.create.options.channel.description')).setRequired(true).addChannelTypes(ChannelType.GuildText).addChannelTypes(ChannelType.GuildNews))
                .addStringOption(option => option.setName('message').setDescription(getCommandMetadata('commandMetadata.announcement.subcommands.create.options.message.description')).setRequired(true)),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('edit')
                .setDescription(getCommandMetadata('commandMetadata.announcement.subcommands.edit.description'))
                .addStringOption(option => option.setName('id').setDescription(getCommandMetadata('commandMetadata.announcement.subcommands.edit.options.id.description')).setRequired(true))
                .addStringOption(option => option.setName('message').setDescription(getCommandMetadata('commandMetadata.announcement.subcommands.edit.options.message.description')).setRequired(true)),
        )
    ,

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    localizationKey: 'commandMetadata.announcement',

    run: async (client, interaction, args) => {
        await interaction.deferReply();
        const perms = await client.checkUserPerms({
            flags: [Discord.PermissionsBitField.Flags.ManageMessages],
            perms: [Discord.PermissionsBitField.Flags.ManageMessages]
        }, interaction)

        if (perms == false) return;

        client.loadSubcommands(client, interaction, args);
    },
};

 
