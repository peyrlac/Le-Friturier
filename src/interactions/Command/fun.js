const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    localizationKey: 'commandMetadata.fun',
    data: new SlashCommandBuilder()
        .setName('fun')
        .setDescription(getCommandMetadata('commandMetadata.fun.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.fun.subcommands.help.description'))
        )

        // Meme Commands

        .addSubcommandGroup((group) =>
            group
                .setName('meme')
                .setDescription(getCommandMetadata('commandMetadata.fun.subcommandGroups.meme.description'))
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('confused')
                        .setDescription(getCommandMetadata('commandMetadata.fun.subcommandGroups.meme.subcommands.confused.description'))
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('cleverrate')
                        .setDescription(getCommandMetadata('commandMetadata.fun.subcommandGroups.meme.subcommands.cleverrate.description'))
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('dinochrome')
                        .setDescription(getCommandMetadata('commandMetadata.fun.subcommandGroups.meme.subcommands.dinochrome.description'))
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('epicgamerrate')
                        .setDescription(getCommandMetadata('commandMetadata.fun.subcommandGroups.meme.subcommands.epicgamerrate.description'))
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('howgay')
                        .setDescription(getCommandMetadata('commandMetadata.fun.subcommandGroups.meme.subcommands.howgay.description'))
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('roast')
                        .setDescription(getCommandMetadata('commandMetadata.fun.subcommandGroups.meme.subcommands.roast.description'))
                        .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.fun.common.selectUser')).setRequired(true))
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('simprate')
                        .setDescription(getCommandMetadata('commandMetadata.fun.subcommandGroups.meme.subcommands.simprate.description'))
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('stankrate')
                        .setDescription(getCommandMetadata('commandMetadata.fun.subcommandGroups.meme.subcommands.stankrate.description'))
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('rickroll')
                        .setDescription(getCommandMetadata('commandMetadata.fun.subcommandGroups.meme.subcommands.rickroll.description'))
                )
        )

        // User Commands

        .addSubcommandGroup((group) =>
            group
                .setName('user')
                .setDescription(getCommandMetadata('commandMetadata.fun.subcommandGroups.user.description'))
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('hack')
                        .setDescription(getCommandMetadata('commandMetadata.fun.subcommandGroups.user.subcommands.hack.description'))
                        .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.fun.common.selectUser')).setRequired(true))
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('hug')
                        .setDescription(getCommandMetadata('commandMetadata.fun.subcommandGroups.user.subcommands.hug.description'))
                        .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.fun.common.selectUser')).setRequired(true))
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('kill')
                        .setDescription(getCommandMetadata('commandMetadata.fun.subcommandGroups.user.subcommands.kill.description'))
                        .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.fun.common.selectUser')).setRequired(true))
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('lovemeter')
                        .setDescription(getCommandMetadata('commandMetadata.fun.subcommandGroups.user.subcommands.lovemeter.description'))
                        .addUserOption(option => option.setName('user1').setDescription(getCommandMetadata('commandMetadata.fun.common.selectUser')).setRequired(true))
                        .addUserOption(option => option.setName('user2').setDescription(getCommandMetadata('commandMetadata.fun.common.selectUser')).setRequired(true))
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('sudo')
                        .setDescription(getCommandMetadata('commandMetadata.fun.subcommandGroups.user.subcommands.sudo.description'))
                        .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.fun.common.selectUser')).setRequired(true))
                        .addStringOption(option => option.setName('text').setDescription(getCommandMetadata('commandMetadata.fun.common.enterText')).setRequired(true))
                )
        )

        // Text Commands

        .addSubcommandGroup((group) =>
            group
                .setName('text')
                .setDescription(getCommandMetadata('commandMetadata.fun.subcommandGroups.text.description'))
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('ascii')
                        .setDescription(getCommandMetadata('commandMetadata.fun.subcommandGroups.text.subcommands.ascii.description'))
                        .addStringOption(option => option.setName('text').setDescription(getCommandMetadata('commandMetadata.fun.common.enterText')).setRequired(true))
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('gif')
                        .setDescription(getCommandMetadata('commandMetadata.fun.subcommandGroups.text.subcommands.gif.description'))
                        .addStringOption(option => option.setName('text').setDescription(getCommandMetadata('commandMetadata.fun.common.enterText')).setRequired(true))
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('reverse')
                        .setDescription(getCommandMetadata('commandMetadata.fun.subcommandGroups.text.subcommands.reverse.description'))
                        .addStringOption(option => option.setName('text').setDescription(getCommandMetadata('commandMetadata.fun.common.enterText')).setRequired(true))
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('say')
                        .setDescription(getCommandMetadata('commandMetadata.fun.subcommandGroups.text.subcommands.say.description'))
                        .addStringOption(option => option.setName('text').setDescription(getCommandMetadata('commandMetadata.fun.common.enterText')).setRequired(true))
                )
        )

        // Extra Commands

        .addSubcommandGroup((group) =>
            group
                .setName('extra')
                .setDescription(getCommandMetadata('commandMetadata.fun.subcommandGroups.extra.description'))
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('birdfact')
                        .setDescription(getCommandMetadata('commandMetadata.fun.subcommandGroups.extra.subcommands.birdfact.description'))
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('catfact')
                        .setDescription(getCommandMetadata('commandMetadata.fun.subcommandGroups.extra.subcommands.catfact.description'))
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('dogfact')
                        .setDescription(getCommandMetadata('commandMetadata.fun.subcommandGroups.extra.subcommands.dogfact.description'))
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('fact')
                        .setDescription(getCommandMetadata('commandMetadata.fun.subcommandGroups.extra.subcommands.fact.description'))
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('koalafact')
                        .setDescription(getCommandMetadata('commandMetadata.fun.subcommandGroups.extra.subcommands.koalafact.description'))
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('pandafact')
                        .setDescription(getCommandMetadata('commandMetadata.fun.subcommandGroups.extra.subcommands.pandafact.description'))
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('token')
                        .setDescription(getCommandMetadata('commandMetadata.fun.subcommandGroups.extra.subcommands.token.description'))
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('worldclock')
                        .setDescription(getCommandMetadata('commandMetadata.fun.subcommandGroups.extra.subcommands.worldclock.description'))
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('xmas')
                        .setDescription(getCommandMetadata('commandMetadata.fun.subcommandGroups.extra.subcommands.xmas.description'))
                )
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

 
