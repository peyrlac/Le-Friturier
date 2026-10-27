const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('casino')
        .setDescription('Jouer au jeu du casino')
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription('Obtenez des informations sur les commandes de catégorie de casino')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('blackjack')
                .setDescription('Jouez à un jeu de blackjack pour gagner de l\'argent')
                .addNumberOption(option => option.setName('amount').setDescription('Entrez un montant').setMinValue(1).setMaxValue(1000000000).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('crash')
                .setDescription('Plus de risques, plus de récompense')
                .addNumberOption(option => option.setName('amount').setDescription('Entrez un montant').setMinValue(1).setMaxValue(1000000000).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('roulette')
                .setDescription('Jouer à la roulette')
                .addStringOption(option => option.setName('color').setDescription('Entrez dans une couleur hexagonale').setRequired(true))
                .addNumberOption(option => option.setName('amount').setDescription('Entrez un montant').setMinValue(1).setMaxValue(1000000000).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('slots')
                .setDescription('Jouer à des créneaux')
                .addNumberOption(option => option.setName('amount').setDescription('Entrez un montant').setMinValue(1).setMaxValue(1000000000).setRequired(true))
        )
    ,
    localizations: {
        name: { fr: 'casino', en: 'casino' },
        description: { fr: 'Jouer aux jeux du casino', en: 'Play casino games' },
        subcommands: {
            help: { description: { fr: 'Voir les commandes du casino disponibles', en: 'Get information about the casino category commands' } },
            blackjack: { description: { fr: 'Jouer au blackjack pour gagner de l’argent', en: 'Play blackjack to win money' }, options: { amount: { description: { fr: 'Entrez un montant', en: 'Enter an amount' } } } },
            crash: { description: { fr: 'Plus de risques, plus de récompenses', en: 'More risk, more reward' }, options: { amount: { description: { fr: 'Entrez un montant', en: 'Enter an amount' } } } },
            roulette: { description: { fr: 'Jouer à la roulette', en: 'Play roulette' }, options: { color: { description: { fr: 'Entrez une couleur', en: 'Enter a color' } }, amount: { description: { fr: 'Entrez un montant', en: 'Enter an amount' } } } },
            slots: { description: { fr: 'Jouer aux machines à sous', en: 'Play slots' }, options: { amount: { description: { fr: 'Entrez un montant', en: 'Enter an amount' } } } }
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

 
