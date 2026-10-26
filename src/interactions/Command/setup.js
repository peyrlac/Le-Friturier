const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const { ChannelType } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    localizationKey: 'commandMetadata.setup',
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Manage the Bot setups')
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription('Get information about the setup category commands')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('channelsorter')
                .setDescription('Configure channel sorting in a category')
                .addChannelOption(option => 
                    option
                        .setName('category')
                        .setDescription('Select a category to enable automatic channel sorting')
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildCategory)
                )
                .addStringOption(option =>
                    option
                        .setName('mode')
                        .setDescription('Choose how channels should be arranged')
                        .setRequired(true)
                        .addChoices(
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.channelsorter.options.mode.choices.automatic.name'), value: 'automatic' },
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.channelsorter.options.mode.choices.manual.name'), value: 'manual' },
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.channelsorter.options.mode.choices.hybrid.name'), value: 'hybrid' }
                        )
                )
                .addStringOption(option =>
                    option
                        .setName('pinned-order')
                        .setDescription('Choose whether pinned channels come first or last')
                        .setRequired(false)
                        .addChoices(
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.channelsorter.options.pinned-order.choices.first.name'), value: 'first' },
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.channelsorter.options.pinned-order.choices.last.name'), value: 'last' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('tickets')
                .setDescription('Setup the tickets')
                .addChannelOption(option => option.setName('category').setDescription('Select a category where the tickets should come in').setRequired(true).addChannelTypes(ChannelType.GuildCategory))
                .addRoleOption(option => option.setName('role').setDescription('Select the support role').setRequired(true))
                .addChannelOption(option => option.setName('channel').setDescription('The channel for the ticket panel').setRequired(true).addChannelTypes(ChannelType.GuildText))
                .addChannelOption(option => option.setName('logs').setDescription('The channel for the ticket logs').setRequired(true).addChannelTypes(ChannelType.GuildText))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('customvoice')  // Changed from 'customvoices' to 'customvoice'
                .setDescription('Setup the custom voice channels system')
                .addChannelOption(option => option.setName('category').setDescription('Select a category where the channels come in').setRequired(true).addChannelTypes(ChannelType.GuildCategory))
                .addChannelOption(option => option.setName('channel').setDescription('Select the creation channel').setRequired(true).addChannelTypes(ChannelType.GuildVoice))
                .addStringOption(option => 
                    option.setName('theme')
                    .setDescription('Select the theme for voice channels')
                    .setRequired(true)
                    .addChoices(
                        { name: 'Default', value: 'default' },
                        { name: 'Ocean Theme', value: 'ocean' },
                        { name: 'Gaming Theme', value: 'gaming' },
                        { name: 'April Fools', value: 'aprilfools' }
                    )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('logs')
                .setDescription('Set the logs from the server')
                .addStringOption(option =>
                    option.setName('setup')
                        .setDescription('The setup that you want')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Server logs', value: 'serverLogs' },
                            { name: 'Level logs', value: 'levelLogs' },
                            { name: 'Boost logs', value: 'boostLogs' }
                        )
                )
                .addChannelOption(option => option.setName('channel').setDescription('The channel for the logs').setRequired(true).addChannelTypes(ChannelType.GuildText))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('fun')
                .setDescription('Set the fun channels from the server')
                .addStringOption(option =>
                    option.setName('setup')
                        .setDescription('The setup that you want')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Birthdays', value: 'birthdays' },
                            { name: 'Chatbot', value: 'chatbot' },
                            { name: 'Reviews', value: 'reviews' },
                            { name: 'Suggestions', value: 'suggestions' },
                            { name: 'Starboard', value: 'starboard' }
                        )
                )
                .addChannelOption(option => option.setName('channel').setDescription('The channel for the fun').setRequired(true).addChannelTypes(ChannelType.GuildText))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('games')
                .setDescription('Set the game channels from the server')
                .addStringOption(option =>
                    option.setName('setup')
                        .setDescription('The setup that you want')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Counting', value: 'counting' },
                            { name: 'Guess the number', value: 'gtn' },
                            { name: 'Guess the word', value: 'gtw' },
                            { name: 'Word snake', value: 'wordsnake' }
                        )
                )
                .addChannelOption(option => option.setName('channel').setDescription('The channel for the game').setRequired(true).addChannelTypes(ChannelType.GuildText))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('welcomechannels')
                .setDescription('Setup the welcome channels')
                .addStringOption(option =>
                    option.setName('setup')
                        .setDescription('The setup that you want')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Welcome channel', value: 'welcomechannel' },
                            { name: 'Leave channnel', value: 'leavechannel' }
                        )
                )
                .addChannelOption(option => option.setName('channel').setDescription('The channel that you want').setRequired(true).addChannelTypes(ChannelType.GuildText))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('welcomerole')
                .setDescription('Setup the welcome role')
                .addRoleOption(option => option.setName('role').setDescription('The role that you want').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('ticketpanel')
                .setDescription('Setup the ticket panel')
                .addStringOption(option => option.setName('name').setDescription('The name of the ticket panel').setRequired(true))
                .addStringOption(option => option.setName('description').setDescription('The description of the ticket panel').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('deletesetup')
                .setDescription('Delete a Bot setup')
                .addStringOption(option =>
                    option.setName('setup')
                        .setDescription('The setup that you want')
                        .setRequired(true)
                        .addChoices(
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.deletesetup.options.setup.choices.tickets.name'), value: 'tickets' },
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.deletesetup.options.setup.choices.customvoice.name'), value: 'customvoice' },
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.deletesetup.options.setup.choices.serverlogs.name'), value: 'serverlogs' },
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.deletesetup.options.setup.choices.levellogs.name'), value: 'levellogs' },
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.deletesetup.options.setup.choices.boostlogs.name'), value: 'boostlogs' },
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.deletesetup.options.setup.choices.birthdays.name'), value: 'birthdays' },
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.deletesetup.options.setup.choices.chatbot.name'), value: 'chatbot' },
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.deletesetup.options.setup.choices.reviews.name'), value: 'reviews' },
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.deletesetup.options.setup.choices.suggestions.name'), value: 'suggestions' },
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.deletesetup.options.setup.choices.counting.name'), value: 'counting' },
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.deletesetup.options.setup.choices.gtn.name'), value: 'gtn' },
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.deletesetup.options.setup.choices.gtw.name'), value: 'gtw' },
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.deletesetup.options.setup.choices.welcomechannel.name'), value: 'welcomechannel' },
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.deletesetup.options.setup.choices.leavechannel.name'), value: 'leavechannel' },
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.deletesetup.options.setup.choices.welcomerole.name'), value: 'welcomerole' },
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.deletesetup.options.setup.choices.wordsnake.name'), value: 'wordsnake' },
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.deletesetup.options.setup.choices.channelsorter.name'), value: 'channelsorter' },
                        )
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
            flags: [Discord.PermissionsBitField.Flags.Administrator],
            perms: [Discord.PermissionsBitField.Flags.Administrator]
        }, interaction)

        if (perms == false) return;

        client.loadSubcommands(client, interaction, args);
    },
};

 
