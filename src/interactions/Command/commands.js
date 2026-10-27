const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

const Schema = require("../../database/models/music");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(getCommandMetadata('commandMetadata.commands.name'))
        .setDescription(getCommandMetadata('commandMetadata.commands.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.commands.subcommands.help.description')),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription(getCommandMetadata('commandMetadata.commands.subcommands.add.description'))
                .addStringOption(option => option.setName('command').setDescription(getCommandMetadata('commandMetadata.commands.subcommands.add.options.command.description')).setRequired(true))
                .addStringOption(option => option.setName('text').setDescription(getCommandMetadata('commandMetadata.commands.subcommands.add.options.text.description')).setRequired(true)),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription(getCommandMetadata('commandMetadata.commands.subcommands.delete.description'))
                .addStringOption(option => option.setName('commande').setDescription(getCommandMetadata('commandMetadata.commands.subcommands.delete.options.commande.description')).setRequired(true)),
        )
    ,

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    localizationKey: 'commandMetadata.commands',

    run: async (client, interaction, args) => {
        await interaction.deferReply();
        const perms = await client.checkUserPerms({
            flags: [Discord.PermissionsBitField.Flags.ManageMessages],
            perms: [Discord.PermissionsBitField.Flags.ManageMessages]
        }, interaction)

        if (perms == false) return;
        
        client.loadSubcommands(client, interaction, args);
    },
};

 
