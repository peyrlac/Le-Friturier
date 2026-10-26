const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const { ChannelType } = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    localizationKey: 'commandMetadata.images',

    // Meme Images

    data: new SlashCommandBuilder()
        .setName('images')
        .setDescription(getCommandMetadata('commandMetadata.images.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.images.subcommands.help.description'))
        )
        .addSubcommandGroup((group) =>
            group
                .setName('memes')
                .setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.memes.description'))
                .addSubcommand((subcommand) =>
                subcommand.setName('clyde').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.memes.subcommands.clyde.description'))
                        .addStringOption(option => option.setName('text').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.memes.subcommands.clyde.options.text.description')).setRequired(true))

                )
                .addSubcommand((subcommand) =>
                    subcommand.setName('drake').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.memes.subcommands.drake.description'))
                        .addStringOption(option => option.setName('text1').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.memes.subcommands.drake.options.text1.description')).setRequired(true))
                        .addStringOption(option => option.setName('text2').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.memes.subcommands.drake.options.text2.description')).setRequired(true)),

                )
                .addSubcommand((subcommand) =>
                    subcommand.setName('meme').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.memes.subcommands.meme.description')),
                )
                .addSubcommand((subcommand) =>
                    subcommand.setName('pooh').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.memes.subcommands.pooh.description'))
                        .addStringOption(option => option.setName('text1').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.memes.subcommands.pooh.options.text1.description')).setRequired(true))
                        .addStringOption(option => option.setName('text2').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.memes.subcommands.pooh.options.text2.description')).setRequired(true)),

                )
                .addSubcommand((subcommand) =>
                    subcommand.setName('trumptweet').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.memes.subcommands.trumptweet.description'))
                        .addStringOption(option => option.setName('text').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.memes.subcommands.trumptweet.options.text.description')).setRequired(true))
                )
                .addSubcommand((subcommand) =>
                    subcommand.setName('tweet').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.memes.subcommands.tweet.description'))
                        .addStringOption(option => option.setName('text').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.memes.subcommands.tweet.options.text.description')).setRequired(true))
                )
                .addSubcommand((subcommand) =>
                    subcommand.setName('wasted').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.memes.subcommands.wasted.description')),
                )

        )

        // Animal Images

        .addSubcommandGroup((group) =>
            group
                .setName('animals')
                .setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.animals.description'))
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('bird')
                        .setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.animals.subcommands.bird.description')),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('cat')
                        .setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.animals.subcommands.cat.description'))
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('dog')
                        .setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.animals.subcommands.dog.description'))
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('fox')
                        .setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.animals.subcommands.fox.description'))
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('koala')
                        .setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.animals.subcommands.koala.description'))
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('panda')
                        .setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.animals.subcommands.panda.description'))
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('redpanda')
                        .setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.animals.subcommands.redpanda.description'))
                )
        )

        // User Images

        .addSubcommandGroup((group) =>
            group
                .setName('user')
                .setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.description'))
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('ad')
                        .setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.ad.description'))
                        .addUserOption((option) =>
                            option.setName('user').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.ad.options.user.description')).setRequired(true),
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('avatar')
                        .setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.avatar.description'))
                        .addUserOption((option) =>
                            option.setName('user').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.avatar.options.user.description')).setRequired(true),
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('banner')
                        .setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.banner.description'))
                        .addUserOption((option) =>
                            option.setName('user').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.banner.options.user.description')).setRequired(true),
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('bed')
                        .setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.bed.description'))
                        .addUserOption((option) =>
                            option.setName('user').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.bed.options.user.description')).setRequired(true),
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('blur')
                        .setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.blur.description'))
                        .addUserOption((option) =>
                            option.setName('user').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.blur.options.user.description')).setRequired(true),
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('burn')
                        .setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.burn.description'))
                        .addUserOption((option) =>
                            option.setName('user').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.burn.options.user.description')).setRequired(true),
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('clown')
                        .setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.clown.description'))
                        .addUserOption((option) =>
                            option.setName('user').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.clown.options.user.description')).setRequired(true),
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('colorify')
                        .setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.colorify.description'))
                        .addUserOption((option) =>
                            option.setName('user').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.colorify.options.user.description')).setRequired(true),
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('darkness')
                        .setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.darkness.description'))
                        .addUserOption((option) =>
                            option.setName('user').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.darkness.options.user.description')).setRequired(true),
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('facepalm')
                        .setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.facepalm.description'))
                        .addUserOption((option) =>
                            option.setName('user').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.facepalm.options.user.description')).setRequired(true),
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('greyscale')
                        .setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.greyscale.description'))
                        .addUserOption((option) =>
                            option.setName('user').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.greyscale.options.user.description')).setRequired(true),
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('invert')
                        .setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.invert.description'))
                        .addUserOption((option) =>
                            option.setName('user').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.invert.options.user.description')).setRequired(true),
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('kiss')
                        .setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.kiss.description'))
                        .addUserOption((option) =>
                            option.setName('user').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.kiss.options.user.description')).setRequired(true),
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('podium')
                        .setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.podium.description'))
                        .addUserOption((option) =>
                            option.setName('user1').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.podium.options.user1.description')).setRequired(true),
                        )
                        .addUserOption((option) =>
                            option.setName('user2').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.podium.options.user2.description')).setRequired(true),
                        )
                        .addUserOption((option) =>
                            option.setName('user3').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.podium.options.user3.description')).setRequired(true),
                        )

                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('spank')
                        .setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.spank.description'))
                        .addUserOption((option) =>
                            option.setName('user').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.spank.options.user.description')).setRequired(true),
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('wanted')
                        .setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.wanted.description'))
                        .addUserOption((option) =>
                            option.setName('user').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.user.subcommands.wanted.options.user.description')).setRequired(true),
                        )
                )
        )

        // Extra Images

        .addSubcommandGroup((group) =>
            group
                .setName('extra')
                .setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.extra.description'))
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('car')
                        .setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.extra.subcommands.car.description')),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('glass')
                        .setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.extra.subcommands.glass.description')),
                )
                .addSubcommand((subcommand) =>
                    subcommand.setName('image').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.extra.subcommands.image.description'))
                        .addChannelOption(option => option.setName('channel').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.extra.subcommands.image.options.channel.description')).setRequired(true).addChannelTypes(ChannelType.GuildText))
                        .addStringOption(option => option.setName('image-url').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.extra.subcommands.image.options.image-url.description')).setRequired(true))
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('triggered')
                        .setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.extra.subcommands.triggered.description')),
                )
                .addSubcommand((subcommand) =>
                    subcommand.setName('wallpaper').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.extra.subcommands.wallpaper.description'))
                        .addStringOption(option => option.setName('name').setDescription(getCommandMetadata('commandMetadata.images.subcommandGroups.extra.subcommands.wallpaper.options.name.description')).setRequired(true))
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


 
