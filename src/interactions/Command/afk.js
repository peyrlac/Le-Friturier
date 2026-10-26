const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');

const Schema = require("../../database/models/music");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Réglez votre AFK')
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription('Obtenez des informations sur les commandes de la catégorie AFK')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Mettez-vous AFK')
                .addStringOption(option => option.setName('reason').setDescription('La raison de votre AFK'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('Afficher tous les utilisateurs AFK')
        )
    ,

    localizations: {
        name: { fr: 'afk', en: 'afk' },
        description: { fr: 'Gérer son statut AFK', en: 'Manage your AFK status' },
        subcommands: {
            help: { description: { fr: 'Voir l’aide de la catégorie AFK', en: 'View AFK category help' } },
            set: {
                description: { fr: 'Se mettre en AFK', en: 'Set your AFK status' },
                options: { reason: { description: { fr: 'Raison de votre AFK', en: 'Reason for your AFK status' } } }
            },
            list: { description: { fr: 'Afficher les utilisateurs AFK', en: 'List AFK users' } }
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

 
