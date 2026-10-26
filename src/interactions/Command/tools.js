const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    data: new SlashCommandBuilder()
        .setName(getCommandMetadata('commandMetadata.tools.name'))
        .setDescription(getCommandMetadata('commandMetadata.tools.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.tools.subcommands.help.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('anagram')
                .setDescription(getCommandMetadata('commandMetadata.tools.subcommands.anagram.description'))
                .addStringOption(option => option.setName('word').setDescription(getCommandMetadata('commandMetadata.tools.subcommands.anagram.options.word.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('button')
                .setDescription(getCommandMetadata('commandMetadata.tools.subcommands.button.description'))
                .addStringOption(option => option.setName('url').setDescription(getCommandMetadata('commandMetadata.tools.subcommands.button.options.url.description')).setRequired(true))
                .addStringOption(option => option.setName('text').setDescription(getCommandMetadata('commandMetadata.tools.subcommands.button.options.text.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('calculator')
                .setDescription(getCommandMetadata('commandMetadata.tools.subcommands.calculator.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('decode')
                .setDescription(getCommandMetadata('commandMetadata.tools.subcommands.decode.description'))
                .addStringOption(option => option.setName('code').setDescription(getCommandMetadata('commandMetadata.tools.subcommands.decode.options.code.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('emojify')
                .setDescription(getCommandMetadata('commandMetadata.tools.subcommands.emojify.description'))
                .addStringOption(option => option.setName('text').setDescription(getCommandMetadata('commandMetadata.tools.subcommands.emojify.options.text.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('encode')
                .setDescription(getCommandMetadata('commandMetadata.tools.subcommands.encode.description'))
                .addStringOption(option => option.setName('text').setDescription(getCommandMetadata('commandMetadata.tools.subcommands.encode.options.text.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('enlarge')
                .setDescription(getCommandMetadata('commandMetadata.tools.subcommands.enlarge.description'))
                .addStringOption(option => option.setName('emoji').setDescription(getCommandMetadata('commandMetadata.tools.subcommands.enlarge.options.emoji.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('mcskin')
                .setDescription(getCommandMetadata('commandMetadata.tools.subcommands.mcskin.description'))
                .addStringOption(option => option.setName('name').setDescription(getCommandMetadata('commandMetadata.tools.subcommands.mcskin.options.name.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('mcstatus')
                .setDescription(getCommandMetadata('commandMetadata.tools.subcommands.mcstatus.description'))
                .addStringOption(option => option.setName('ip').setDescription(getCommandMetadata('commandMetadata.tools.subcommands.mcstatus.options.ip.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('pwdgen')
                .setDescription(getCommandMetadata('commandMetadata.tools.subcommands.pwdgen.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('qrcode')
                .setDescription(getCommandMetadata('commandMetadata.tools.subcommands.qrcode.description'))
                .addStringOption(option => option.setName('text').setDescription(getCommandMetadata('commandMetadata.tools.subcommands.qrcode.options.text.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remind')
                .setDescription(getCommandMetadata('commandMetadata.tools.subcommands.remind.description'))
                .addStringOption(option => option.setName('time').setDescription(getCommandMetadata('commandMetadata.tools.subcommands.remind.options.time.description')).setRequired(true))
                .addStringOption(option => option.setName('message').setDescription(getCommandMetadata('commandMetadata.tools.subcommands.remind.options.message.description')).setRequired(true))

        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('sourcebin')
                .setDescription(getCommandMetadata('commandMetadata.tools.subcommands.sourcebin.description'))
                .addStringOption(option => option.setName('language').setDescription(getCommandMetadata('commandMetadata.tools.subcommands.sourcebin.options.language.description')).setRequired(true))
                .addStringOption(option => option.setName('code').setDescription(getCommandMetadata('commandMetadata.tools.subcommands.sourcebin.options.code.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('url')
                .setDescription(getCommandMetadata('commandMetadata.tools.subcommands.url.description'))
                .addStringOption(option => option.setName('site').setDescription(getCommandMetadata('commandMetadata.tools.subcommands.url.options.site.description')).setRequired(true))
                .addStringOption(option => option.setName('code').setDescription(getCommandMetadata('commandMetadata.tools.subcommands.url.options.code.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('review')
                .setDescription(getCommandMetadata('commandMetadata.tools.subcommands.review.description'))
                .addNumberOption(option => option.setName('stars').setDescription(getCommandMetadata('commandMetadata.tools.subcommands.review.options.stars.description')).setMinValue(1).setMaxValue(5).setRequired(true))
                .addStringOption(option => option.setName('message').setDescription(getCommandMetadata('commandMetadata.tools.subcommands.review.options.message.description')))
        )
    ,

    localizationKey: 'commandMetadata.tools',

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

 
