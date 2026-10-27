const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    data: new SlashCommandBuilder()
        .setName(getCommandMetadata('commandMetadata.serverstats.name'))
        .setDescription(getCommandMetadata('commandMetadata.serverstats.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.serverstats.subcommands.help.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('boosts')
                .setDescription(getCommandMetadata('commandMetadata.serverstats.subcommands.boosts.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('tier')
                .setDescription(getCommandMetadata('commandMetadata.serverstats.subcommands.tier.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('channels')
                .setDescription(getCommandMetadata('commandMetadata.serverstats.subcommands.channels.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('stage-channels')
                .setDescription(getCommandMetadata("commandMetadata.serverstats.subcommands.stage-channels.description"))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('text-channels')
                .setDescription(getCommandMetadata("commandMetadata.serverstats.subcommands.text-channels.description"))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('voice-channels')
                .setDescription(getCommandMetadata("commandMetadata.serverstats.subcommands.voice-channels.description"))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('news-channels')
                .setDescription(getCommandMetadata("commandMetadata.serverstats.subcommands.news-channels.description"))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('members')
                .setDescription(getCommandMetadata('commandMetadata.serverstats.subcommands.members.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('bots')
                .setDescription(getCommandMetadata('commandMetadata.serverstats.subcommands.bots.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('roles')
                .setDescription(getCommandMetadata('commandMetadata.serverstats.subcommands.roles.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('emoji')
                .setDescription(getCommandMetadata('commandMetadata.serverstats.subcommands.emoji.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('static-emoji')
                .setDescription(getCommandMetadata("commandMetadata.serverstats.subcommands.static-emoji.description"))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('animated-emoji')
                .setDescription(getCommandMetadata("commandMetadata.serverstats.subcommands.animated-emoji.description"))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('time')
                .setDescription(getCommandMetadata('commandMetadata.serverstats.subcommands.time.description'))
                .addStringOption(option =>
                    option.setName('timezone')
                        .setDescription(getCommandMetadata('commandMetadata.serverstats.subcommands.time.options.timezone.description'))
                        .setRequired(true)
                )
        )
    ,

    localizationKey: 'commandMetadata.serverstats',

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        await interaction.deferReply();
        const perms = await client.checkPerms({
            flags: [Discord.PermissionsBitField.Flags.ManageChannels],
            perms: [Discord.PermissionsBitField.Flags.ManageChannels]
        }, interaction)

        if (perms == false) return;

        client.loadSubcommands(client, interaction, args);
    },
};

 
