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
                            { name: getCommandMetadata('commandMetadata.autosetup.subcommands.logs.options.setup.choices.serverLogs.name'), value: 'serverLogs' },
                            { name: getCommandMetadata('commandMetadata.autosetup.subcommands.logs.options.setup.choices.levelLogs.name'), value: 'levelLogs' },
                            { name: getCommandMetadata('commandMetadata.autosetup.subcommands.logs.options.setup.choices.boostLogs.name'), value: 'boostLogs' }
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
                            { name: getCommandMetadata('commandMetadata.autosetup.subcommands.fun.options.setup.choices.birthdays.name'), value: 'birthdays' },
                            { name: getCommandMetadata('commandMetadata.autosetup.subcommands.fun.options.setup.choices.chatbot.name'), value: 'chatbot' },
                            { name: getCommandMetadata('commandMetadata.autosetup.subcommands.fun.options.setup.choices.reviews.name'), value: 'reviews' },
                            { name: getCommandMetadata('commandMetadata.autosetup.subcommands.fun.options.setup.choices.suggestions.name'), value: 'suggestions' },
                            { name: getCommandMetadata('commandMetadata.autosetup.subcommands.fun.options.setup.choices.starboard.name'), value: 'starboard' }
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
                            { name: getCommandMetadata('commandMetadata.autosetup.subcommands.games.options.setup.choices.counting.name'), value: 'counting' },
                            { name: getCommandMetadata('commandMetadata.autosetup.subcommands.games.options.setup.choices.gtn.name'), value: 'gtn' },
                            { name: getCommandMetadata('commandMetadata.autosetup.subcommands.games.options.setup.choices.gtw.name'), value: 'gtw' },
                            { name: getCommandMetadata('commandMetadata.autosetup.subcommands.games.options.setup.choices.wordsnake.name'), value: 'wordsnake' }
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
                            { name: getCommandMetadata('commandMetadata.autosetup.subcommands.welcome.options.setup.choices.welcomechannel.name'), value: 'welcomechannel' },
                            { name: getCommandMetadata('commandMetadata.autosetup.subcommands.welcome.options.setup.choices.welcomerole.name'), value: 'welcomerole' },
                            { name: getCommandMetadata('commandMetadata.autosetup.subcommands.welcome.options.setup.choices.leavechannel.name'), value: 'leavechannel' }
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

 
