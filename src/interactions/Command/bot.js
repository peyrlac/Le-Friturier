const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const { FEATURE_REGISTRY } = require('../../handlers/features');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot')
        .setDescription('Informations sur le bot')
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription('Obtenez des informations sur les commandes de la catégorie de bot')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('Obtenez des informations sur le bot')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('ping')
                .setDescription('Voir les bots ping dans MS')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('changelogs')
                .setDescription('Obtenez les changelogs du bot')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('donate')
                .setDescription('Obtenez le lien de don de bot')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('links')
                .setDescription('Obtenez un message avec tous les liens de bot')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('owner')
                .setDescription('Obtenez des informations sur le propriétaire')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('socials')
                .setDescription('Obtenez le bot social')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('support')
                .setDescription('Obtenez une invitation du serveur d\'assistance')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('uptime')
                .setDescription('Montrez la disponibilité du bot')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('vote')
                .setDescription('Voyez si vous avez voté')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('feedback')
                .setDescription('Envoyez votre opinion sur le bot aux développeurs')
                .addStringOption(option => option.setName("feedback").setDescription("Vos réactions").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('feature')
                .setDescription('Gérer les arrêts globaux des fonctionnalités')
                .addStringOption(option => option
                    .setName('action')
                    .setDescription('Action à effectuer')
                    .setRequired(true)
                    .addChoices(
                        { name: 'Lister', value: 'list' },
                        { name: 'Modifier', value: 'set' },
                        { name: 'Réinitialiser', value: 'reset' }
                    ))
                .addStringOption(option => option
                    .setName('feature')
                    .setDescription('Fonctionnalité à modifier')
                    .setRequired(false)
                    .addChoices(...Object.keys(FEATURE_REGISTRY).map(name => ({ name, value: name }))))
                .addBooleanOption(option => option
                    .setName('enabled')
                    .setDescription('Activer la fonctionnalité')
                    .setRequired(false))
        ),
    localizations: {
        name: { fr: 'bot', en: 'bot' },
        description: { fr: 'Obtenir des informations sur le bot', en: 'Get information about the bot' },
        subcommands: {
            feature: { description: { fr: 'Gérer les arrêts globaux des fonctionnalités', en: 'Manage global feature switches' } }
        }
    },

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

 
