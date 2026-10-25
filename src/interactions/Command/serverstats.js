const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverstats')
        .setDescription('Manage the server stats')
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription('Get information about the server stats category commands')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('boosts')
                .setDescription('Keep track of the boost count')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('tier')
                .setDescription('Keep track of the boost tier count')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('channels')
                .setDescription('Keep track of the channel count')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('stage-channels')
                .setDescription('Keep track of the stage channel count')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('text-channels')
                .setDescription('Keep track of the text channel count')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('voice-channels')
                .setDescription('Keep track of the voice channel count')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('news-channels')
                .setDescription('Keep track of the news channel count')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('members')
                .setDescription('Keep track of the member count')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('bots')
                .setDescription('Keep track of the bots count')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('roles')
                .setDescription('Keep track of the role count')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('emoji')
                .setDescription('Keep track of the emoji\'s count')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('static-emoji')
                .setDescription('Keep track of the static emoji\'s count')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('animated-emoji')
                .setDescription('Keep track of the animated emoji\'s count')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('time')
                .setDescription('Keep track of your current time zone')
                .addStringOption(option =>
                    option.setName('timezone')
                        .setDescription('The timezone you want to set (e.g. Europe/Amsterdam)')
                        .setRequired(true)
                )
        )
    ,

    localizations: {
        name: { fr: 'statistiques', en: 'serverstats' },
        description: {
            fr: 'Gérer les statistiques du serveur',
            en: 'Manage the server stats'
        },
        subcommands: {
            help: {
                description: { fr: 'Voir les commandes de statistiques du serveur', en: 'Get information about the server stats category commands' }
            },
            boosts: {
                description: { fr: 'Suivre le nombre de boosts', en: 'Keep track of the boost count' }
            },
            tier: {
                description: { fr: 'Suivre le niveau de boosts', en: 'Keep track of the boost tier count' }
            },
            channels: {
                description: { fr: 'Suivre le nombre de salons', en: 'Keep track of the channel count' }
            },
            'stage-channels': {
                description: { fr: 'Suivre le nombre de salons stage', en: 'Keep track of the stage channel count' }
            },
            'text-channels': {
                description: { fr: 'Suivre le nombre de salons textuels', en: 'Keep track of the text channel count' }
            },
            'voice-channels': {
                description: { fr: 'Suivre le nombre de salons vocaux', en: 'Keep track of the voice channel count' }
            },
            'news-channels': {
                description: { fr: 'Suivre le nombre de salons d’annonces', en: 'Keep track of the news channel count' }
            },
            members: {
                description: { fr: 'Suivre le nombre de membres', en: 'Keep track of the member count' }
            },
            bots: {
                description: { fr: 'Suivre le nombre de bots', en: 'Keep track of the bots count' }
            },
            roles: {
                description: { fr: 'Suivre le nombre de rôles', en: 'Keep track of the role count' }
            },
            emoji: {
                description: { fr: 'Suivre le nombre d’emojis', en: 'Keep track of the emoji\'s count' }
            },
            'static-emoji': {
                description: { fr: 'Suivre le nombre d’emojis statiques', en: 'Keep track of the static emoji\'s count' }
            },
            'animated-emoji': {
                description: { fr: 'Suivre le nombre d’emojis animés', en: 'Keep track of the animated emoji\'s count' }
            },
            time: {
                description: { fr: 'Suivre votre fuseau horaire actuel', en: 'Keep track of your current time zone' },
                options: {
                    timezone: {
                        description: { fr: 'Fuseau horaire à utiliser (ex. Europe/Amsterdam)', en: 'The timezone you want to set (e.g. Europe/Amsterdam)' }
                    }
                }
            }
        }
    },

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

 
