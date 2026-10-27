const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const ms = require('ms');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setName(getCommandMetadata('commandMetadata.profile.name'))
        .setDescription(getCommandMetadata('commandMetadata.profile.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.profile.subcommands.help.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription(getCommandMetadata('commandMetadata.profile.subcommands.create.description'))
        ).addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription(getCommandMetadata('commandMetadata.profile.subcommands.delete.description'))
        ).
        addSubcommand(subcommand =>
            subcommand
                .setName('profile')
                .setDescription(getCommandMetadata('commandMetadata.profile.subcommands.profile.description'))
                .addUserOption((option) =>
                    option.setName('user').setDescription(getCommandMetadata('commandMetadata.profile.subcommands.profile.options.user.description')).setRequired(false),
                )
        ).
        addSubcommand(subcommand =>
            subcommand
                .setName('aboutme')
                .setDescription(getCommandMetadata('commandMetadata.profile.subcommands.aboutme.description'))
                .addStringOption(option => option.setName('text').setDescription(getCommandMetadata('commandMetadata.profile.subcommands.aboutme.options.text.description')).setRequired(true))
        ).
        addSubcommand(subcommand =>
            subcommand
                .setName('age')
                .setDescription(getCommandMetadata('commandMetadata.profile.subcommands.age.description'))
                .addNumberOption(option => option.setName('number').setDescription(getCommandMetadata('commandMetadata.profile.subcommands.age.options.number.description')).setMinValue(13).setMaxValue(120).setRequired(true))
        ).
        addSubcommand(subcommand =>
            subcommand
                .setName('bday')
                .setDescription(getCommandMetadata('commandMetadata.profile.subcommands.bday.description'))
                .addStringOption(option => option.setName('bday').setDescription(getCommandMetadata('commandMetadata.profile.subcommands.bday.options.bday.description')).setRequired(true))
        )

        .addSubcommandGroup((group) =>
            group
                .setName('actor')
                .setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.actor.description'))
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('addactor')
                        .setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.actor.subcommands.addactor.description'))
                        .addStringOption(option => option.setName('actor').setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.actor.subcommands.addactor.options.actor.description')).setRequired(true)),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('delactor')
                        .setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.actor.subcommands.delactor.description'))
                        .addStringOption(option => option.setName('actor').setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.actor.subcommands.delactor.options.actor.description')).setRequired(true)),
                )
        ).
        addSubcommandGroup((group) =>
            group
                .setName('artist')
                .setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.artist.description'))
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('addartist')
                        .setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.artist.subcommands.addartist.description'))
                        .addStringOption(option => option.setName('artist').setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.artist.subcommands.addartist.options.artist.description')).setRequired(true)),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('delartist')
                        .setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.artist.subcommands.delartist.description'))
                        .addStringOption(option => option.setName('artist').setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.artist.subcommands.delartist.options.artist.description')).setRequired(true)),
                )
        ).
        addSubcommand(subcommand =>
            subcommand
                .setName('color')
                .setDescription(getCommandMetadata('commandMetadata.profile.subcommands.color.description'))
                .addStringOption(option => option.setName('color').setDescription(getCommandMetadata('commandMetadata.profile.subcommands.color.options.color.description')).setRequired(true)),

        ).addSubcommandGroup((group) =>
            group
                .setName('food')
                .setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.food.description'))
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('addfood')
                        .setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.food.subcommands.addfood.description'))
                        .addStringOption(option => option.setName('food').setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.food.subcommands.addfood.options.food.description')).setRequired(true)),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('delfood')
                        .setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.food.subcommands.delfood.description'))
                        .addStringOption(option => option.setName('food').setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.food.subcommands.delfood.options.food.description')).setRequired(true)),
                )
        ).addSubcommandGroup((group) =>
            group
                .setName('movie')
                .setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.movie.description'))
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('addmovie')
                        .setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.movie.subcommands.addmovie.description'))
                        .addStringOption(option => option.setName('movie').setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.movie.subcommands.addmovie.options.movie.description')).setRequired(true)),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('delmovie')
                        .setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.movie.subcommands.delmovie.description'))
                        .addStringOption(option => option.setName('movie').setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.movie.subcommands.delmovie.options.movie.description')).setRequired(true)),
                )
        ).addSubcommandGroup((group) =>
            group
                .setName('pet')
                .setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.pet.description'))
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('addpet')
                        .setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.pet.subcommands.addpet.description'))
                        .addStringOption(option => option.setName('pet').setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.pet.subcommands.addpet.options.pet.description')).setRequired(true)),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('delpet')
                        .setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.pet.subcommands.delpet.description'))
                        .addStringOption(option => option.setName('pet').setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.pet.subcommands.delpet.options.pet.description')).setRequired(true)),
                )
        ).addSubcommandGroup((group) =>
            group
                .setName('song')
                .setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.song.description'))
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('addsong')
                        .setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.song.subcommands.addsong.description'))
                        .addStringOption(option => option.setName('song').setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.song.subcommands.addsong.options.song.description')).setRequired(true)),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('delsong')
                        .setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.song.subcommands.delsong.description'))
                        .addStringOption(option => option.setName('song').setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.song.subcommands.delsong.options.song.description')).setRequired(true)),
                )
        ).
        addSubcommand(subcommand =>
            subcommand
                .setName('gender')
                .setDescription(getCommandMetadata('commandMetadata.profile.subcommands.gender.description'))

        ).addSubcommandGroup((group) =>
            group
                .setName('hobbies')
                .setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.hobbies.description'))
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('addhobby')
                        .setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.hobbies.subcommands.addhobby.description'))
                        .addStringOption(option => option.setName('hobby').setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.hobbies.subcommands.addhobby.options.hobby.description')).setRequired(true)),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('delhobby')
                        .setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.hobbies.subcommands.delhobby.description'))
                        .addStringOption(option => option.setName('hobby').setDescription(getCommandMetadata('commandMetadata.profile.subcommandGroups.hobbies.subcommands.delhobby.options.hobby.description')).setRequired(true)),
                )
        ).
        addSubcommand(subcommand =>
            subcommand
                .setName('origin')
                .setDescription(getCommandMetadata('commandMetadata.profile.subcommands.origin.description'))
                .addStringOption(option => option.setName('country').setDescription(getCommandMetadata('commandMetadata.profile.subcommands.origin.options.country.description')).setRequired(true))
        ).
        addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription(getCommandMetadata('commandMetadata.profile.subcommands.status.description'))
                .addStringOption(option => option.setName('text').setDescription(getCommandMetadata('commandMetadata.profile.subcommands.status.options.text.description')).setRequired(true))
        ),

    localizationKey: 'commandMetadata.profile',

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

 
