const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const { ChannelType } = require('discord.js');
const Discord = require('discord.js');
const ms = require('ms');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    localizationKey: 'commandMetadata.giveaway',
    data: new SlashCommandBuilder()
        .setName(getCommandMetadata('commandMetadata.giveaway.name'))
        .setDescription(getCommandMetadata('commandMetadata.giveaway.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.giveaway.subcommands.help.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('start')
                .setDescription(getCommandMetadata('commandMetadata.giveaway.subcommands.start.description'))
                .addChannelOption(option => option.setName('channel').setDescription(getCommandMetadata('commandMetadata.giveaway.subcommands.start.options.channel.description')).setRequired(true).addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement))
                .addStringOption(option => option.setName('duration').setDescription(getCommandMetadata('commandMetadata.giveaway.subcommands.start.options.duration.description')).setRequired(true))
                .addNumberOption(option => option.setName('winners').setDescription(getCommandMetadata('commandMetadata.giveaway.subcommands.start.options.winners.description')).setMinValue(1).setMaxValue(100).setRequired(true))
                .addStringOption(option => option.setName('prize').setDescription(getCommandMetadata('commandMetadata.giveaway.subcommands.start.options.prize.description')).setRequired(true)),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('drop')
                .setDescription(getCommandMetadata('commandMetadata.giveaway.subcommands.drop.description'))
                .addChannelOption(option => option.setName('channel').setDescription(getCommandMetadata('commandMetadata.giveaway.subcommands.drop.options.channel.description')).setRequired(true).addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement))
                .addStringOption(option => option.setName('duration').setDescription(getCommandMetadata('commandMetadata.giveaway.subcommands.drop.options.duration.description')).setRequired(true))
                .addNumberOption(option => option.setName('winners').setDescription(getCommandMetadata('commandMetadata.giveaway.subcommands.drop.options.winners.description')).setMinValue(1).setMaxValue(100).setRequired(true))
                .addStringOption(option => option.setName('prize').setDescription(getCommandMetadata('commandMetadata.giveaway.subcommands.drop.options.prize.description')).setRequired(true)),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('reroll')
                .setDescription(getCommandMetadata('commandMetadata.giveaway.subcommands.reroll.description'))
                .addStringOption(option => option.setName('message').setDescription(getCommandMetadata('commandMetadata.giveaway.subcommands.reroll.options.message.description')).setRequired(true)),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('end')
                .setDescription(getCommandMetadata('commandMetadata.giveaway.subcommands.end.description'))
                .addStringOption(option => option.setName('message').setDescription(getCommandMetadata('commandMetadata.giveaway.subcommands.end.options.message.description')).setRequired(true)),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('edit')
                .setDescription(getCommandMetadata('commandMetadata.giveaway.subcommands.edit.description'))
                .addStringOption(option => option.setName('message').setDescription(getCommandMetadata('commandMetadata.giveaway.subcommands.edit.options.message.description')).setRequired(true)),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription(getCommandMetadata('commandMetadata.giveaway.subcommands.delete.description'))
                .addStringOption(option => option.setName('message').setDescription(getCommandMetadata('commandMetadata.giveaway.subcommands.delete.options.message.description')).setRequired(true)),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('pause')
                .setDescription(getCommandMetadata('commandMetadata.giveaway.subcommands.pause.description'))
                .addStringOption(option => option.setName('message').setDescription(getCommandMetadata('commandMetadata.giveaway.subcommands.pause.options.message.description')).setRequired(true)),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('unpause')
                .setDescription(getCommandMetadata('commandMetadata.giveaway.subcommands.unpause.description'))
                .addStringOption(option => option.setName('message').setDescription(getCommandMetadata('commandMetadata.giveaway.subcommands.unpause.options.message.description')).setRequired(true)),
        ),
    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

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

 
