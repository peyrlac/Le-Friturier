const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription(getCommandMetadata('commandMetadata.search.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.search.subcommands.help.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('bing')
                .setDescription(getCommandMetadata('commandMetadata.search.subcommands.bing.description'))
                .addStringOption(option => option.setName('name').setDescription(getCommandMetadata('commandMetadata.search.subcommands.bing.options.name.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('ddg')
                .setDescription(getCommandMetadata('commandMetadata.search.subcommands.ddg.description'))
                .addStringOption(option => option.setName('name').setDescription(getCommandMetadata('commandMetadata.search.subcommands.ddg.options.name.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('google')
                .setDescription(getCommandMetadata('commandMetadata.search.subcommands.google.description'))
                .addStringOption(option => option.setName('name').setDescription(getCommandMetadata('commandMetadata.search.subcommands.google.options.name.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('youtube')
                .setDescription(getCommandMetadata('commandMetadata.search.subcommands.youtube.description'))
                .addStringOption(option => option.setName('name').setDescription(getCommandMetadata('commandMetadata.search.subcommands.youtube.options.name.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('corona')
                .setDescription(getCommandMetadata('commandMetadata.search.subcommands.corona.description'))
                .addStringOption(option => option.setName('country').setDescription(getCommandMetadata('commandMetadata.search.subcommands.corona.options.country.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand 
                .setName('crypto')
                .setDescription(getCommandMetadata('commandMetadata.search.subcommands.crypto.description'))
                .addStringOption(option => option.setName('coin').setDescription(getCommandMetadata('commandMetadata.search.subcommands.crypto.options.coin.description')).setRequired(true))
                .addStringOption(option => option.setName('currency').setDescription(getCommandMetadata('commandMetadata.search.subcommands.crypto.options.currency.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('docs')
                .setDescription(getCommandMetadata('commandMetadata.search.subcommands.docs.description'))
                .addStringOption(option => option.setName('name').setDescription(getCommandMetadata('commandMetadata.search.subcommands.docs.options.name.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('github')
                .setDescription(getCommandMetadata('commandMetadata.search.subcommands.github.description'))
                .addStringOption(option => option.setName('name').setDescription(getCommandMetadata('commandMetadata.search.subcommands.github.options.name.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('hexcolour')
                .setDescription(getCommandMetadata('commandMetadata.search.subcommands.hexcolour.description'))
                .addStringOption(option => option.setName('color').setDescription(getCommandMetadata('commandMetadata.search.subcommands.hexcolour.options.color.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('itunes')
                .setDescription(getCommandMetadata('commandMetadata.search.subcommands.itunes.description'))
                .addStringOption(option => option.setName('song').setDescription(getCommandMetadata('commandMetadata.search.subcommands.itunes.options.song.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('npm')
                .setDescription(getCommandMetadata('commandMetadata.search.subcommands.npm.description'))
                .addStringOption(option => option.setName('name').setDescription(getCommandMetadata('commandMetadata.search.subcommands.npm.options.name.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('steam')
                .setDescription(getCommandMetadata('commandMetadata.search.subcommands.steam.description'))
                .addStringOption(option => option.setName('name').setDescription(getCommandMetadata('commandMetadata.search.subcommands.steam.options.name.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('translate')
                .setDescription(getCommandMetadata('commandMetadata.search.subcommands.translate.description'))
                .addStringOption(option => option.setName('language').setDescription(getCommandMetadata('commandMetadata.search.subcommands.translate.options.language.description')).setRequired(true))
                .addStringOption(option => option.setName('text').setDescription(getCommandMetadata('commandMetadata.search.subcommands.translate.options.text.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('weather')
                .setDescription(getCommandMetadata('commandMetadata.search.subcommands.weather.description'))
                .addStringOption(option => option.setName('location').setDescription(getCommandMetadata('commandMetadata.search.subcommands.weather.options.location.description')).setRequired(true))
        )
    ,

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    localizationKey: 'commandMetadata.search',

    run: async (client, interaction, args) => {
        await interaction.deferReply();
        client.loadSubcommands(client, interaction, args);
    },
};

 
