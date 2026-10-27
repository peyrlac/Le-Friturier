const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const { ChannelType } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    localizationKey: 'commandMetadata.automod',
    data: new SlashCommandBuilder()
        .setName(getCommandMetadata('commandMetadata.automod.name'))
        .setDescription(getCommandMetadata('commandMetadata.automod.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.automod.subcommands.help.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('antiinvite')
                .setDescription(getCommandMetadata('commandMetadata.automod.subcommands.antiinvite.description'))
                .addBooleanOption(option => option.setName('active').setDescription(getCommandMetadata('commandMetadata.automod.subcommands.antiinvite.options.active.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('antilinks')
                .setDescription(getCommandMetadata('commandMetadata.automod.subcommands.antilinks.description'))
                .addBooleanOption(option => option.setName('active').setDescription(getCommandMetadata('commandMetadata.automod.subcommands.antilinks.options.active.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('antispam')
                .setDescription(getCommandMetadata('commandMetadata.automod.subcommands.antispam.description'))
                .addBooleanOption(option => option.setName('active').setDescription(getCommandMetadata('commandMetadata.automod.subcommands.antispam.options.active.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('linkschannel')
                .setDescription(getCommandMetadata('commandMetadata.automod.subcommands.linkschannel.description'))
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription(getCommandMetadata('commandMetadata.automod.subcommands.linkschannel.options.type.description'))
                        .setRequired(true)
                        .addChoices(
                            { name: getCommandMetadata('commandMetadata.automod.subcommands.linkschannel.options.type.choices.add.name'), value: 'add' },
                            { name: getCommandMetadata('commandMetadata.automod.subcommands.linkschannel.options.type.choices.remove.name'), value: 'remove' }
                        )
                )
                .addChannelOption(option => option.setName('channel').setDescription(getCommandMetadata('commandMetadata.automod.subcommands.linkschannel.options.channel.description')).setRequired(true).addChannelTypes(ChannelType.GuildText))
        )
        .addSubcommandGroup(group =>
            group
                .setName('blacklist')
                .setDescription(getCommandMetadata('commandMetadata.automod.subcommandGroups.blacklist.description'))
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('display')
                        .setDescription(getCommandMetadata('commandMetadata.automod.subcommandGroups.blacklist.subcommands.display.description'))
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('add')
                        .setDescription(getCommandMetadata('commandMetadata.automod.subcommandGroups.blacklist.subcommands.add.description'))
                        .addStringOption(option => option.setName('word').setDescription(getCommandMetadata('commandMetadata.automod.subcommandGroups.blacklist.subcommands.add.options.word.description')).setRequired(true))
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('remove')
                        .setDescription(getCommandMetadata('commandMetadata.automod.subcommandGroups.blacklist.subcommands.remove.description'))
                        .addStringOption(option => option.setName('word').setDescription(getCommandMetadata('commandMetadata.automod.subcommandGroups.blacklist.subcommands.remove.options.word.description')).setRequired(true))
                )
        )
    ,

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

 
