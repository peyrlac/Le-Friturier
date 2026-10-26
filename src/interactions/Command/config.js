const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const { ChannelType } = require('discord.js');
const Discord = require('discord.js');
const { FEATURE_REGISTRY } = require('../../handlers/features');

module.exports = {
    localizationKey: 'commandMetadata.config',
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Ajustez le bot à votre goût')
        .addSubcommand(subcommand =>
            subcommand
                .setName('language')
                .setDescription('Choisir la langue du serveur')
                .addStringOption(option => option
                    .setName('language')
                    .setDescription('Choisissez une langue')
                    .setRequired(true)
                    .addChoices(
                        { name: 'Français', value: 'fr' },
                        { name: 'English', value: 'en' },
                    )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription('Obtenez des informations sur les commandes de catégorie de configuration')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('levels')
                .setDescription('Activer / désactiver les niveaux')
                .addBooleanOption(option => option.setName('boolean').setDescription('Sélectionnez un booléen').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('setcolor')
                .setDescription('Définir une couleur intégrée personnalisée')
                .addStringOption(option => option.setName("color").setDescription("Entrez dans une couleur hexagonale").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('setverify')
                .setDescription('Setup the verify panel')
                .addBooleanOption(option => option.setName('enable').setDescription('Select a boolean').setRequired(true))
                .addChannelOption(option => option.setName('channel').setDescription('Select a channel').setRequired(true).addChannelTypes(ChannelType.GuildText))
                .addRoleOption(option => option.setName('role').setDescription('Select a role').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('setchannelname')
                .setDescription('Définir un nom de canal personnalisé pour les statistiques du serveur')
                .addStringOption(option => option.setName("name").setDescription("Entrez un nom pour la chaîne ou envoyez HELP pour les args").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('levelmessage')
                .setDescription('Définir le message de niveau de bot')
                .addStringOption(option => option.setName("message").setDescription("Entrez un message pour les niveaux ou envoyez HELP pour les args").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('welcomemessage')
                .setDescription('Définir le message de bienvenue')
                .addStringOption(option => option.setName("message").setDescription("Entrez un message de bienvenue ou envoyez HELP pour les args").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('leavemessage')
                .setDescription('Définissez le message de congé')
                .addStringOption(option => option.setName("message").setDescription("Entrez un message de congé ou envoyez HELP pour les args").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('ticketmessage')
                .setDescription('Définissez le message du ticket du bot')
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription('Type de message de ticket')
                        .setRequired(true)
                        .addChoices(
                            { name: 'open', value: 'open' },
                            { name: 'closeDM', value: 'close' }
                        )
                )
                .addStringOption(option => option.setName("message").setDescription("Entrez un message pour le billet").setRequired(true))
        )
        .addSubcommandGroup(group =>
            group
                .setName('feature')
                .setDescription('Gérer les fonctionnalités du serveur')
                .addSubcommand(subcommand => subcommand
                    .setName('list')
                    .setDescription('Afficher l’état des fonctionnalités'))
                .addSubcommand(subcommand => subcommand
                    .setName('set')
                    .setDescription('Activer ou désactiver une fonctionnalité')
                    .addStringOption(option => option
                        .setName('feature')
                        .setDescription('Fonctionnalité à modifier')
                        .setRequired(true)
                        .addChoices(...Object.keys(FEATURE_REGISTRY).map(name => ({ name, value: name }))))
                    .addBooleanOption(option => option
                        .setName('enabled')
                        .setDescription('Activer la fonctionnalité')
                        .setRequired(true)))
                .addSubcommand(subcommand => subcommand
                    .setName('reset')
                    .setDescription('Réinitialiser une fonctionnalité')
                    .addStringOption(option => option
                        .setName('feature')
                        .setDescription('Fonctionnalité à réinitialiser')
                        .setRequired(true)
                        .addChoices(...Object.keys(FEATURE_REGISTRY).map(name => ({ name, value: name })))))
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

 
