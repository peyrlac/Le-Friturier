const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    localizationKey: 'commandMetadata.music',
    data: new SlashCommandBuilder()
        .setName(getCommandMetadata('commandMetadata.music.name'))
        .setDescription(getCommandMetadata('commandMetadata.music.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.music.subcommands.help.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('bassboost')
                .setDescription(getCommandMetadata('commandMetadata.music.subcommands.bassboost.description'))
                .addStringOption(option =>
                    option.setName('level')
                        .setDescription(getCommandMetadata('commandMetadata.music.subcommands.bassboost.options.level.description'))
                        .setRequired(true)
                        .addChoices(
                            { name: '0', value: '0' },
                            { name: '1', value: '1' },
                            { name: '2', value: '2' },
                            { name: '3', value: '3' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('play')
                .setDescription(getCommandMetadata('commandMetadata.music.subcommands.play.description'))
                .addStringOption(option => option.setName('song').setDescription(getCommandMetadata('commandMetadata.music.subcommands.play.options.song.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('clear')
                .setDescription(getCommandMetadata('commandMetadata.music.subcommands.clear.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('loop')
                .setDescription(getCommandMetadata('commandMetadata.music.subcommands.loop.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('lyrics')
                .setDescription(getCommandMetadata('commandMetadata.music.subcommands.lyrics.description'))
                .addStringOption(option => option.setName('song').setDescription(getCommandMetadata('commandMetadata.music.subcommands.lyrics.options.song.description')))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('playing')
                .setDescription(getCommandMetadata('commandMetadata.music.subcommands.playing.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('pause')
                .setDescription(getCommandMetadata('commandMetadata.music.subcommands.pause.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('previous')
                .setDescription(getCommandMetadata('commandMetadata.music.subcommands.previous.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('queue')
                .setDescription(getCommandMetadata('commandMetadata.music.subcommands.queue.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('resume')
                .setDescription(getCommandMetadata('commandMetadata.music.subcommands.resume.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription(getCommandMetadata('commandMetadata.music.subcommands.remove.description'))
                .addNumberOption(option => option.setName('number').setDescription(getCommandMetadata('commandMetadata.music.subcommands.remove.options.number.description')).setMinValue(1).setMaxValue(1000).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('seek')
                .setDescription(getCommandMetadata('commandMetadata.music.subcommands.seek.description'))
                .addNumberOption(option => option.setName('time').setDescription(getCommandMetadata('commandMetadata.music.subcommands.seek.options.time.description')).setMinValue(0).setMaxValue(86400).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('shuffle')
                .setDescription(getCommandMetadata('commandMetadata.music.subcommands.shuffle.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('skip')
                .setDescription(getCommandMetadata('commandMetadata.music.subcommands.skip.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('skipto')
                .setDescription(getCommandMetadata('commandMetadata.music.subcommands.skipto.description'))
                .addNumberOption(option => option.setName('number').setDescription(getCommandMetadata('commandMetadata.music.subcommands.skipto.options.number.description')).setMinValue(1).setMaxValue(1000).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('stop')
                .setDescription(getCommandMetadata('commandMetadata.music.subcommands.stop.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('volume')
                .setDescription(getCommandMetadata('commandMetadata.music.subcommands.volume.description'))
                .addNumberOption(option => option.setName('amount').setDescription(getCommandMetadata('commandMetadata.music.subcommands.volume.options.amount.description')).setMinValue(0).setMaxValue(100))
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

        client.loadSubcommands(client, interaction, args);
    },
};


 
