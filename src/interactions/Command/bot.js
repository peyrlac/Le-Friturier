const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const { FEATURE_REGISTRY } = require('../../handlers/features');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    localizationKey: 'commandMetadata.bot',
    data: new SlashCommandBuilder()
        .setName(getCommandMetadata('commandMetadata.bot.name'))
        .setDescription(getCommandMetadata('commandMetadata.bot.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.bot.subcommands.help.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription(getCommandMetadata('commandMetadata.bot.subcommands.info.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('ping')
                .setDescription(getCommandMetadata('commandMetadata.bot.subcommands.ping.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('changelogs')
                .setDescription(getCommandMetadata('commandMetadata.bot.subcommands.changelogs.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('donate')
                .setDescription(getCommandMetadata('commandMetadata.bot.subcommands.donate.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('links')
                .setDescription(getCommandMetadata('commandMetadata.bot.subcommands.links.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('owner')
                .setDescription(getCommandMetadata('commandMetadata.bot.subcommands.owner.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('socials')
                .setDescription(getCommandMetadata('commandMetadata.bot.subcommands.socials.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('support')
                .setDescription(getCommandMetadata('commandMetadata.bot.subcommands.support.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('uptime')
                .setDescription(getCommandMetadata('commandMetadata.bot.subcommands.uptime.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('vote')
                .setDescription(getCommandMetadata('commandMetadata.bot.subcommands.vote.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('feedback')
                .setDescription(getCommandMetadata('commandMetadata.bot.subcommands.feedback.description'))
                .addStringOption(option => option.setName("feedback").setDescription(getCommandMetadata('commandMetadata.bot.subcommands.feedback.options.feedback.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('feature')
                .setDescription(getCommandMetadata('commandMetadata.bot.subcommands.feature.description'))
                .addStringOption(option => option
                    .setName('action')
                    .setDescription(getCommandMetadata('commandMetadata.bot.subcommands.feature.options.action.description'))
                    .setRequired(true)
                    .addChoices(
                        { name: getCommandMetadata('commandMetadata.bot.subcommands.feature.options.action.choices.list.name'), value: 'list' },
                        { name: getCommandMetadata('commandMetadata.bot.subcommands.feature.options.action.choices.set.name'), value: 'set' },
                        { name: getCommandMetadata('commandMetadata.bot.subcommands.feature.options.action.choices.reset.name'), value: 'reset' }
                    ))
                .addStringOption(option => option
                    .setName('feature')
                    .setDescription(getCommandMetadata('commandMetadata.bot.subcommands.feature.options.feature.description'))
                    .setRequired(false)
                    .addChoices(...Object.keys(FEATURE_REGISTRY).map(name => ({ name, value: name }))))
                .addBooleanOption(option => option
                    .setName('enabled')
                    .setDescription(getCommandMetadata('commandMetadata.bot.subcommands.feature.options.enabled.description'))
                    .setRequired(false))
        ),
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

 
