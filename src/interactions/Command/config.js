const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const { ChannelType } = require('discord.js');
const Discord = require('discord.js');
const { FEATURE_REGISTRY } = require('../../handlers/features');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    localizationKey: 'commandMetadata.config',
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription(getCommandMetadata('commandMetadata.config.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('language')
                .setDescription(getCommandMetadata('commandMetadata.config.subcommands.language.description'))
                .addStringOption(option => option
                    .setName('language')
                    .setDescription(getCommandMetadata('commandMetadata.config.subcommands.language.options.language.description'))
                    .setRequired(true)
                    .addChoices(
                        { name: getCommandMetadata('commandMetadata.config.subcommands.language.options.language.choices.fr.name'), value: 'fr' },
                        { name: getCommandMetadata('commandMetadata.config.subcommands.language.options.language.choices.en.name'), value: 'en' },
                    )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.config.subcommands.help.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('Modifier la présence globale du bot ({guilds}, {users}, {uptime}, {shard})')
                .addStringOption(option => option
                    .setName('activity')
                    .setDescription('Texte avec {guilds}, {membersInVoice}, {channels}, {uptime}, {time}, etc.')
                    .setRequired(true)
                    .setMaxLength(128)
                )
                .addStringOption(option => option
                    .setName('type')
                    .setDescription('Type de présence')
                    .setRequired(true)
                    .addChoices(
                        { name: 'Joue à', value: 'Playing' },
                        { name: 'Écoute', value: 'Listening' },
                        { name: 'Regarde', value: 'Watching' },
                        { name: 'Diffuse', value: 'Streaming' },
                        { name: 'Participe à', value: 'Competing' },
                    )
                )
                .addStringOption(option => option
                    .setName('presence')
                    .setDescription('État en ligne du bot')
                    .addChoices(
                        { name: 'En ligne', value: 'online' },
                        { name: 'Inactif', value: 'idle' },
                        { name: 'Ne pas déranger', value: 'dnd' },
                        { name: 'Invisible', value: 'invisible' },
                    )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('levels')
                .setDescription(getCommandMetadata('commandMetadata.config.subcommands.levels.description'))
                .addBooleanOption(option => option.setName('boolean').setDescription(getCommandMetadata('commandMetadata.config.subcommands.levels.options.boolean.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('setcolor')
                .setDescription(getCommandMetadata('commandMetadata.config.subcommands.setcolor.description'))
                .addStringOption(option => option.setName("color").setDescription(getCommandMetadata('commandMetadata.config.subcommands.setcolor.options.color.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('setverify')
                .setDescription(getCommandMetadata('commandMetadata.config.subcommands.setverify.description'))
                .addBooleanOption(option => option.setName('enable').setDescription(getCommandMetadata('commandMetadata.config.subcommands.setverify.options.enable.description')).setRequired(true))
                .addChannelOption(option => option.setName('channel').setDescription(getCommandMetadata('commandMetadata.config.subcommands.setverify.options.channel.description')).setRequired(true).addChannelTypes(ChannelType.GuildText))
                .addRoleOption(option => option.setName('role').setDescription(getCommandMetadata('commandMetadata.config.subcommands.setverify.options.role.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('setchannelname')
                .setDescription(getCommandMetadata('commandMetadata.config.subcommands.setchannelname.description'))
                .addStringOption(option => option.setName("name").setDescription(getCommandMetadata('commandMetadata.config.subcommands.setchannelname.options.name.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('levelmessage')
                .setDescription(getCommandMetadata('commandMetadata.config.subcommands.levelmessage.description'))
                .addStringOption(option => option.setName("message").setDescription(getCommandMetadata('commandMetadata.config.subcommands.levelmessage.options.message.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('welcomemessage')
                .setDescription(getCommandMetadata('commandMetadata.config.subcommands.welcomemessage.description'))
                .addStringOption(option => option.setName("message").setDescription(getCommandMetadata('commandMetadata.config.subcommands.welcomemessage.options.message.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('leavemessage')
                .setDescription(getCommandMetadata('commandMetadata.config.subcommands.leavemessage.description'))
                .addStringOption(option => option.setName("message").setDescription(getCommandMetadata('commandMetadata.config.subcommands.leavemessage.options.message.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('ticketmessage')
                .setDescription(getCommandMetadata('commandMetadata.config.subcommands.ticketmessage.description'))
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription(getCommandMetadata('commandMetadata.config.subcommands.ticketmessage.options.type.description'))
                        .setRequired(true)
                        .addChoices(
                            { name: getCommandMetadata('commandMetadata.config.subcommands.ticketmessage.options.type.choices.open.name'), value: 'open' },
                            { name: getCommandMetadata('commandMetadata.config.subcommands.ticketmessage.options.type.choices.close.name'), value: 'close' }
                        )
                )
                .addStringOption(option => option.setName("message").setDescription(getCommandMetadata('commandMetadata.config.subcommands.ticketmessage.options.message.description')).setRequired(true))
        )
        .addSubcommandGroup(group =>
            group
                .setName('feature')
                .setDescription(getCommandMetadata('commandMetadata.config.subcommandGroups.feature.description'))
                .addSubcommand(subcommand => subcommand
                    .setName('list')
                    .setDescription(getCommandMetadata('commandMetadata.config.subcommandGroups.feature.subcommands.list.description')))
                .addSubcommand(subcommand => subcommand
                    .setName('set')
                    .setDescription(getCommandMetadata('commandMetadata.config.subcommandGroups.feature.subcommands.set.description'))
                    .addStringOption(option => option
                        .setName('feature')
                        .setDescription(getCommandMetadata('commandMetadata.config.subcommandGroups.feature.subcommands.set.options.feature.description'))
                        .setRequired(true)
                        .addChoices(...Object.keys(FEATURE_REGISTRY).map(name => ({ name, value: name }))))
                    .addBooleanOption(option => option
                        .setName('enabled')
                        .setDescription(getCommandMetadata('commandMetadata.config.subcommandGroups.feature.subcommands.set.options.enabled.description'))
                        .setRequired(true)))
                .addSubcommand(subcommand => subcommand
                    .setName('reset')
                    .setDescription(getCommandMetadata('commandMetadata.config.subcommandGroups.feature.subcommands.reset.description'))
                    .addStringOption(option => option
                        .setName('feature')
                        .setDescription(getCommandMetadata('commandMetadata.config.subcommandGroups.feature.subcommands.reset.options.feature.description'))
                        .setRequired(true)
                        .addChoices(...Object.keys(FEATURE_REGISTRY).map(name => ({ name, value: name })))))
        ),

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();
        await client.loadSubcommands(client, interaction, args);
    },
};

 
