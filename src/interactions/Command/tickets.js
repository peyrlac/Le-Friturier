const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

const ticketSchema = require("../../database/models/tickets");
const ticketChannels = require("../../database/models/ticketChannels");

module.exports = {
    localizationKey: 'commandMetadata.tickets',
    data: new SlashCommandBuilder()
        .setName(getCommandMetadata('commandMetadata.tickets.name'))
        .setDescription(getCommandMetadata('commandMetadata.tickets.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.tickets.subcommands.help.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription(getCommandMetadata('commandMetadata.tickets.subcommands.add.description'))
                .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.tickets.subcommands.add.options.user.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('claim')
                .setDescription(getCommandMetadata('commandMetadata.tickets.subcommands.claim.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('close')
                .setDescription(getCommandMetadata('commandMetadata.tickets.subcommands.close.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription(getCommandMetadata('commandMetadata.tickets.subcommands.delete.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('information')
                .setDescription(getCommandMetadata('commandMetadata.tickets.subcommands.information.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('lower')
                .setDescription(getCommandMetadata('commandMetadata.tickets.subcommands.lower.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription(getCommandMetadata('commandMetadata.tickets.subcommands.create.description'))
                .addStringOption(option => option.setName('reason').setDescription(getCommandMetadata('commandMetadata.tickets.subcommands.create.options.reason.description')))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('notice')
                .setDescription(getCommandMetadata('commandMetadata.tickets.subcommands.notice.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('open')
                .setDescription(getCommandMetadata('commandMetadata.tickets.subcommands.open.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('raise')
                .setDescription(getCommandMetadata('commandMetadata.tickets.subcommands.raise.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription(getCommandMetadata('commandMetadata.tickets.subcommands.remove.description'))
                .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.tickets.subcommands.remove.options.user.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('rename')
                .setDescription(getCommandMetadata('commandMetadata.tickets.subcommands.rename.description'))
                .addStringOption(option => option.setName('name').setDescription(getCommandMetadata('commandMetadata.tickets.subcommands.rename.options.name.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('transcript')
                .setDescription(getCommandMetadata('commandMetadata.tickets.subcommands.transcript.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('unclaim')
                .setDescription(getCommandMetadata('commandMetadata.tickets.subcommands.unclaim.description'))
        )
    ,
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

 
