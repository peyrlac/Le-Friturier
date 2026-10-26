const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('event')
        .setDescription('Commandes liées aux événements')
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription('❓ Obtenir des informations à propos des commandes event.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('participants')
                .setDescription('👥 Voir la liste des participants à un événement')
                .addStringOption(option => 
                    option
                        .setName('event_id')
                        .setDescription('ID de l\'événement (optionnel si dans le thread de l\'événement)')
                        .setRequired(false)
                )
        ),

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    localizationKey: 'commandMetadata.event',

    run: async (client, interaction, args) => {
        await interaction.deferReply({ ephemeral: true });
        client.loadSubcommands(client, interaction, args);
    },
};
