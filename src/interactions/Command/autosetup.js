const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    data: new SlashCommandBuilder()
        .setName(getCommandMetadata('commandMetadata.autosetup.name'))
        .setDescription(getCommandMetadata('commandMetadata.autosetup.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.autosetup.subcommands.help.description'))
        ).addSubcommand(subcommand =>
            subcommand
                .setName('aprilfools')
                .setDescription(getCommandMetadata('commandMetadata.autosetup.subcommands.aprilfools.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('logs')
                .setDescription(getCommandMetadata('commandMetadata.autosetup.subcommands.logs.description'))
                .addStringOption(option =>
                    option.setName('setup')
                        .setDescription(getCommandMetadata('commandMetadata.autosetup.subcommands.logs.options.setup.description'))
                        .setRequired(true)
                        .addChoices(
                            { name: 'Server logs', value: 'serverLogs' },
                            { name: 'Level logs', value: 'levelLogs' },
                            { name: 'Boost logs', value: 'boostLogs' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('fun')
                .setDescription(getCommandMetadata('commandMetadata.autosetup.subcommands.fun.description'))
                .addStringOption(option =>
                    option.setName('setup')
                        .setDescription(getCommandMetadata('commandMetadata.autosetup.subcommands.fun.options.setup.description'))
                        .setRequired(true)
                        .addChoices(
                            { name: 'Birthdays', value: 'birthdays' },
                            { name: 'Chatbot', value: 'chatbot' },
                            { name: 'Reviews', value: 'reviews' },
                            { name: 'Suggestions', value: 'suggestions' },
                            { name: 'Starboard', value: 'starboard' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('games')
                .setDescription(getCommandMetadata('commandMetadata.autosetup.subcommands.games.description'))
                .addStringOption(option =>
                    option.setName('setup')
                        .setDescription(getCommandMetadata('commandMetadata.autosetup.subcommands.games.options.setup.description'))
                        .setRequired(true)
                        .addChoices(
                            { name: 'Counting', value: 'counting' },
                            { name: 'Guess the number', value: 'gtn' },
                            { name: 'Guess the word', value: 'gtw' },
                            { name: 'Word snake', value: 'wordsnake' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('welcome')
                .setDescription(getCommandMetadata('commandMetadata.autosetup.subcommands.welcome.description'))
                .addStringOption(option =>
                    option.setName('setup')
                        .setDescription(getCommandMetadata('commandMetadata.autosetup.subcommands.welcome.options.setup.description'))
                        .setRequired(true)
                        .addChoices(
                            { name: 'Welcome channel', value: 'welcomechannel' },
                            { name: 'Welcome role', value: 'welcomerole' },
                            { name: 'Leave channnel', value: 'leavechannel' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('customvoice')
                .setDescription(getCommandMetadata('commandMetadata.autosetup.subcommands.customvoice.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('ticketpanel')
                .setDescription(getCommandMetadata('commandMetadata.autosetup.subcommands.ticketpanel.description'))
        )
    ,

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    localizationKey: 'commandMetadata.autosetup',

    run: async (client, interaction, args) => {
        await interaction.deferReply();
        const perms = await client.checkUserPerms({
            flags: [Discord.PermissionsBitField.Flags.Administrator],
            perms: [Discord.PermissionsBitField.Flags.Administrator]
        }, interaction);

        if (perms == false) return;
        
        client.loadSubcommands(client, interaction, args);
    },
};

 
