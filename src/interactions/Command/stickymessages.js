const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const { ChannelType } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stickymessages')
        .setDescription(getCommandMetadata('commandMetadata.stickymessages.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.stickymessages.subcommands.help.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('stick')
                .setDescription(getCommandMetadata('commandMetadata.stickymessages.subcommands.stick.description'))
                .addChannelOption(option => option.setName('channel').setDescription(getCommandMetadata('commandMetadata.stickymessages.subcommands.stick.options.channel.description')).setRequired(true).addChannelTypes(ChannelType.GuildText))
                .addStringOption(option => option.setName('message').setDescription(getCommandMetadata('commandMetadata.stickymessages.subcommands.stick.options.message.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('messages')
                .setDescription(getCommandMetadata('commandMetadata.stickymessages.subcommands.messages.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('unstick')
                .setDescription(getCommandMetadata('commandMetadata.stickymessages.subcommands.unstick.description'))
                .addChannelOption(option => option.setName('channel').setDescription(getCommandMetadata('commandMetadata.stickymessages.subcommands.unstick.options.channel.description')).setRequired(true).addChannelTypes(ChannelType.GuildText))
        )
    ,

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    localizationKey: 'commandMetadata.stickymessages',

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

 
