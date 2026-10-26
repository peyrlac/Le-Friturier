const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    localizationKey: 'commandMetadata.soundboard',

    // Meme Images

    data: new SlashCommandBuilder()
        .setName('soundboard')
        .setDescription(getCommandMetadata('commandMetadata.soundboard.description'))

        .addSubcommand((subcommand) =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommands.help.description'))
        )
        
        // Windows Sounds
        .addSubcommandGroup((group) =>
            group
                .setName('windows')
                .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.windows.description'))
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('windowserror')
                        .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.windows.subcommands.windowserror.description'))
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('windowsshutdown')
                        .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.windows.subcommands.windowsshutdown.description'))
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('windowsstartup')
                        .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.windows.subcommands.windowsstartup.description'))
                )
        )

        // Earrape Sounds

        .addSubcommandGroup((group) =>
            group
                .setName('earrape')
                .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.earrape.description'))
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('reee')
                        .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.earrape.subcommands.reee.description'))
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('defaultdance')
                        .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.earrape.subcommands.defaultdance.description'))
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('startup')
                        .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.earrape.subcommands.startup.description'))
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('thomas')
                        .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.earrape.subcommands.thomas.description'))
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('wegothim')
                        .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.earrape.subcommands.wegothim.description'))
                )
        )

        // Song Sounds

        .addSubcommandGroup((group) =>
            group
                .setName('songs')
                .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.songs.description'))
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('dancememe')
                        .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.songs.subcommands.dancememe.description'))
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('despacito')
                        .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.songs.subcommands.despacito.description'))
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('elevator')
                        .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.songs.subcommands.elevator.description'))
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('rickastley')
                        .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.songs.subcommands.rickastley.description'))
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('running')
                        .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.songs.subcommands.running.description'))
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('tobecontinued')
                        .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.songs.subcommands.tobecontinued.description'))
                )
        )

        // Discord Sounds

        .addSubcommandGroup((group) =>
            group
                .setName('discord')
                .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.discord.description'))
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('discordcall')
                        .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.discord.subcommands.discordcall.description')),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('discordjoin')
                        .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.discord.subcommands.discordjoin.description')),
                )
                .addSubcommand((subcommand) =>
                    subcommand.setName('discordleave').setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.discord.subcommands.discordleave.description'))
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('discordnotification')
                        .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.discord.subcommands.discordnotification.description')),
                )
        )

        // Discord Sounds

        .addSubcommandGroup((group) =>
            group
                .setName('memes')
                .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.memes.description'))
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('fbi')
                        .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.memes.subcommands.fbi.description')),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('jeff')
                        .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.memes.subcommands.jeff.description')),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('lambo')
                        .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.memes.subcommands.lambo.description')),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('missionfailed')
                        .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.memes.subcommands.missionfailed.description')),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('moaning')
                        .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.memes.subcommands.moaning.description')),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('nani')
                        .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.memes.subcommands.nani.description')),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('nyancat')
                        .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.memes.subcommands.nyancat.description')),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('ohh')
                        .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.memes.subcommands.ohh.description')),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('rimshot')
                        .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.memes.subcommands.rimshot.description')),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('roblox')
                        .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.memes.subcommands.roblox.description')),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('shotdown')
                        .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.memes.subcommands.shotdown.description')),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('spongebob')
                        .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.memes.subcommands.spongebob.description')),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('wow')
                        .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.memes.subcommands.wow.description')),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('yeet')
                        .setDescription(getCommandMetadata('commandMetadata.soundboard.subcommandGroups.memes.subcommands.yeet.description')),
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


 
