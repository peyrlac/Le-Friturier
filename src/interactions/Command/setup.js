const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const { ChannelType } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    localizationKey: 'commandMetadata.setup',
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription(getCommandMetadata('commandMetadata.setup.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.setup.subcommands.help.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('channelsorter')
                .setDescription(getCommandMetadata('commandMetadata.setup.subcommands.channelsorter.description'))
                .addChannelOption(option => 
                    option
                        .setName('category')
                        .setDescription(getCommandMetadata('commandMetadata.setup.subcommands.channelsorter.options.category.description'))
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildCategory)
                )
                .addStringOption(option =>
                    option
                        .setName('mode')
                        .setDescription(getCommandMetadata('commandMetadata.setup.subcommands.channelsorter.options.mode.description'))
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
                        .setDescription(getCommandMetadata('commandMetadata.setup.subcommands.channelsorter.options.pinned-order.description'))
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
                .setDescription(getCommandMetadata('commandMetadata.setup.subcommands.tickets.description'))
                .addChannelOption(option => option.setName('category').setDescription(getCommandMetadata('commandMetadata.setup.subcommands.tickets.options.category.description')).setRequired(true).addChannelTypes(ChannelType.GuildCategory))
                .addRoleOption(option => option.setName('role').setDescription(getCommandMetadata('commandMetadata.setup.subcommands.tickets.options.role.description')).setRequired(true))
                .addChannelOption(option => option.setName('channel').setDescription(getCommandMetadata('commandMetadata.setup.subcommands.tickets.options.channel.description')).setRequired(true).addChannelTypes(ChannelType.GuildText))
                .addChannelOption(option => option.setName('logs').setDescription(getCommandMetadata('commandMetadata.setup.subcommands.tickets.options.logs.description')).setRequired(true).addChannelTypes(ChannelType.GuildText))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('customvoice')  // Changed from 'customvoices' to 'customvoice'
                .setDescription(getCommandMetadata('commandMetadata.setup.subcommands.customvoice.description'))
                .addChannelOption(option => option.setName('category').setDescription(getCommandMetadata('commandMetadata.setup.subcommands.customvoice.options.category.description')).setRequired(true).addChannelTypes(ChannelType.GuildCategory))
                .addChannelOption(option => option.setName('channel').setDescription(getCommandMetadata('commandMetadata.setup.subcommands.customvoice.options.channel.description')).setRequired(true).addChannelTypes(ChannelType.GuildVoice))
                .addStringOption(option => 
                    option.setName('theme')
                    .setDescription(getCommandMetadata('commandMetadata.setup.subcommands.customvoice.options.theme.description'))
                    .setRequired(true)
                    .addChoices(
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.customvoice.options.theme.choices.default.name'), value: 'default' },
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.customvoice.options.theme.choices.ocean.name'), value: 'ocean' },
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.customvoice.options.theme.choices.gaming.name'), value: 'gaming' },
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.customvoice.options.theme.choices.aprilfools.name'), value: 'aprilfools' }
                    )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('logs')
                .setDescription(getCommandMetadata('commandMetadata.setup.subcommands.logs.description'))
                .addStringOption(option =>
                    option.setName('setup')
                        .setDescription(getCommandMetadata('commandMetadata.setup.subcommands.logs.options.setup.description'))
                        .setRequired(true)
                        .addChoices(
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.logs.options.setup.choices.serverLogs.name'), value: 'serverLogs' },
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.logs.options.setup.choices.levelLogs.name'), value: 'levelLogs' },
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.logs.options.setup.choices.boostLogs.name'), value: 'boostLogs' }
                        )
                )
                .addChannelOption(option => option.setName('channel').setDescription(getCommandMetadata('commandMetadata.setup.subcommands.logs.options.channel.description')).setRequired(true).addChannelTypes(ChannelType.GuildText))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('fun')
                .setDescription(getCommandMetadata('commandMetadata.setup.subcommands.fun.description'))
                .addStringOption(option =>
                    option.setName('setup')
                        .setDescription(getCommandMetadata('commandMetadata.setup.subcommands.fun.options.setup.description'))
                        .setRequired(true)
                        .addChoices(
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.fun.options.setup.choices.birthdays.name'), value: 'birthdays' },
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.fun.options.setup.choices.chatbot.name'), value: 'chatbot' },
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.fun.options.setup.choices.reviews.name'), value: 'reviews' },
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.fun.options.setup.choices.suggestions.name'), value: 'suggestions' },
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.fun.options.setup.choices.starboard.name'), value: 'starboard' }
                        )
                )
                .addChannelOption(option => option.setName('channel').setDescription(getCommandMetadata('commandMetadata.setup.subcommands.fun.options.channel.description')).setRequired(true).addChannelTypes(ChannelType.GuildText))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('games')
                .setDescription(getCommandMetadata('commandMetadata.setup.subcommands.games.description'))
                .addStringOption(option =>
                    option.setName('setup')
                        .setDescription(getCommandMetadata('commandMetadata.setup.subcommands.games.options.setup.description'))
                        .setRequired(true)
                        .addChoices(
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.games.options.setup.choices.counting.name'), value: 'counting' },
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.games.options.setup.choices.gtn.name'), value: 'gtn' },
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.games.options.setup.choices.gtw.name'), value: 'gtw' },
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.games.options.setup.choices.wordsnake.name'), value: 'wordsnake' }
                        )
                )
                .addChannelOption(option => option.setName('channel').setDescription(getCommandMetadata('commandMetadata.setup.subcommands.games.options.channel.description')).setRequired(true).addChannelTypes(ChannelType.GuildText))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('welcomechannels')
                .setDescription(getCommandMetadata('commandMetadata.setup.subcommands.welcomechannels.description'))
                .addStringOption(option =>
                    option.setName('setup')
                        .setDescription(getCommandMetadata('commandMetadata.setup.subcommands.welcomechannels.options.setup.description'))
                        .setRequired(true)
                        .addChoices(
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.welcomechannels.options.setup.choices.welcomechannel.name'), value: 'welcomechannel' },
                            { name: getCommandMetadata('commandMetadata.setup.subcommands.welcomechannels.options.setup.choices.leavechannel.name'), value: 'leavechannel' }
                        )
                )
                .addChannelOption(option => option.setName('channel').setDescription(getCommandMetadata('commandMetadata.setup.subcommands.welcomechannels.options.channel.description')).setRequired(true).addChannelTypes(ChannelType.GuildText))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('welcomerole')
                .setDescription(getCommandMetadata('commandMetadata.setup.subcommands.welcomerole.description'))
                .addRoleOption(option => option.setName('role').setDescription(getCommandMetadata('commandMetadata.setup.subcommands.welcomerole.options.role.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('ticketpanel')
                .setDescription(getCommandMetadata('commandMetadata.setup.subcommands.ticketpanel.description'))
                .addStringOption(option => option.setName('name').setDescription(getCommandMetadata('commandMetadata.setup.subcommands.ticketpanel.options.name.description')).setRequired(true))
                .addStringOption(option => option.setName('description').setDescription(getCommandMetadata('commandMetadata.setup.subcommands.ticketpanel.options.description.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('deletesetup')
                .setDescription(getCommandMetadata('commandMetadata.setup.subcommands.deletesetup.description'))
                .addStringOption(option =>
                    option.setName('setup')
                        .setDescription(getCommandMetadata('commandMetadata.setup.subcommands.deletesetup.options.setup.description'))
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

 
