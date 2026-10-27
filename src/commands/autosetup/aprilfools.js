const Discord = require('discord.js');
const Voice = require('../../database/models/voice');

const voiceChannelNames = [
    "🦀 Le Crabe",
    "🐡 La Carpe",
    "🐬 Le Dauphin",
    "🐳 La Baleine",
];

module.exports = async (client, interaction, args) => {
    try {
        const botPerms = await client.checkBotPerms({
            flags: [Discord.PermissionsBitField.Flags.ManageChannels],
            perms: [Discord.PermissionsBitField.Flags.ManageChannels]
        }, interaction);

        if (botPerms == false) return;

        // Créer la catégorie
        const voiceCategory = await interaction.guild.channels.create({
            name: "🌊 Océan",
            type: Discord.ChannelType.GuildCategory
        });

        // Créer le salon textuel
        const textChannel = await interaction.guild.channels.create({
            name: "🐠・la-crique",
            type: Discord.ChannelType.GuildText,
            parent: voiceCategory.id,
            topic: "🌊 Bienvenue dans la crique ! Créez des threads pour explorer d'autres zones marines !"
        });

        // Créer le salon vocal principal
        const voiceChannel = await interaction.guild.channels.create({
            name: "⛵ Le quai",
            type: Discord.ChannelType.GuildVoice,
            parent: voiceCategory.id
        });

        // Sauvegarder dans la base de données
        const existingVoice = await Voice.findOne({ Guild: interaction.guild.id });
        if (existingVoice) {
            existingVoice.Category = voiceCategory.id;
            existingVoice.Channel = voiceChannel.id;
            existingVoice.Theme = 'aprilfools';
            existingVoice.ChannelName = voiceChannelNames.join('||');
            await existingVoice.save();
        } else {
            await new Voice({
                Guild: interaction.guild.id,
                Channel: voiceChannel.id,
                Category: voiceCategory.id,
                ChannelName: voiceChannelNames.join('||'),
                Theme: 'aprilfools',
                ChannelCount: 0
            }).save();
        }

        client.succNormal({
            key: 'autosetup.aprilfools.success',
            fields: [
                {
                    name: await client.t(interaction, 'autosetup.aprilfools.textChannel'),
                    value: `${textChannel}`
                },
                {
                    name: await client.t(interaction, 'autosetup.aprilfools.voiceChannel'),
                    value: `${voiceChannel}`
                }
            ],
            type: 'editreply'
        }, interaction);

    } catch (error) {
        console.error(error);
        client.errNormal({
            key: 'autosetup.aprilfools.error',
            type: 'editreply'
        }, interaction);
    }
};
