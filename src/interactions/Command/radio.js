const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

const Schema = require("../../database/models/music");

module.exports = {
    localizationKey: 'commandMetadata.radio',
    data: new SlashCommandBuilder()
        .setName(getCommandMetadata('commandMetadata.radio.name'))
        .setDescription(getCommandMetadata('commandMetadata.radio.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.radio.subcommands.help.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('play')
                .setDescription(getCommandMetadata('commandMetadata.radio.subcommands.play.description')),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('stop')
                .setDescription(getCommandMetadata('commandMetadata.radio.subcommands.stop.description')),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('playing')
                .setDescription(getCommandMetadata('commandMetadata.radio.subcommands.playing.description')),
        ),
    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        await interaction.deferReply();
        client.checkBotPerms({
            flags: [Discord.PermissionsBitField.Flags.Connect, Discord.PermissionsBitField.Flags.Speak],
            perms: [Discord.PermissionsBitField.Flags.Connect, Discord.PermissionsBitField.Flags.Speak]
        }, interaction)
        if (!interaction.member.voice.channel) return client.errNormal({
            key: 'voice.notInVoice',
            type: 'editreply' 
        }, interaction);

        client.loadSubcommands(client, interaction, args);
    },
};

 
