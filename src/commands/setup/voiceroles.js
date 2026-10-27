const Discord = require('discord.js');
const voiceRoles = require("../../database/models/voiceRoles");

module.exports = async (client, interaction, args) => {
    // Vérifier les permissions
    if (!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.ManageRoles)) {
        return client.errNormal({ 
            key: 'voiceRoles.noPermission',
            type: 'editreply' 
        }, interaction);
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "setup") {
        const channel = interaction.options.getChannel('channel');
        
        // Vérifier que c'est un salon vocal
        if (channel.type !== Discord.ChannelType.GuildVoice) {
            return client.errNormal({ 
                key: 'voiceRoles.invalidChannel',
                type: 'editreply' 
            }, interaction);
        }

        // Créer un rôle avec le même nom que le salon
        const role = await interaction.guild.roles.create({
            name: `🔊 ${channel.name}`,
            color: 'Blue',
            reason: 'Rôle automatique pour salon vocal'
        });

        // Sauvegarder dans la base de données
        const data = await voiceRoles.findOne({ Guild: interaction.guild.id, VoiceChannel: channel.id });
        if (data) {
            data.Role = role.id;
            await data.save();
        } else {
            await new voiceRoles({
                Guild: interaction.guild.id,
                VoiceChannel: channel.id,
                Role: role.id
            }).save();
        }

        return client.succNormal({
            key: 'voiceRoles.setupSuccess',
            fields: [
                {
                    name: await client.t(interaction, 'voiceRoles.channel'),
                    value: `${channel} (${channel.id})`
                },
                {
                    name: await client.t(interaction, 'voiceRoles.role'),
                    value: `${role} (${role.id})`
                }
            ],
            type: 'editreply'
        }, interaction);
    } else if (subcommand === "setupall") {
        // Récupérer tous les salons vocaux
        const voiceChannels = interaction.guild.channels.cache.filter(c => c.type === Discord.ChannelType.GuildVoice);
        
        if (voiceChannels.size === 0) {
            return client.errNormal({ 
                key: 'voiceRoles.noChannels',
                type: 'editreply' 
            }, interaction);
        }

        let setupCount = 0;
        
        // Créer un message de chargement
        await client.simpleEmbed({
            text: await client.t(interaction, 'voiceRoles.progress', { count: voiceChannels.size }),
            type: 'editreply'
        }, interaction);

        // Pour chaque salon vocal, créer un rôle et l'associer
        for (const [id, channel] of voiceChannels) {
            try {
                // Vérifier si une configuration existe déjà
                const existingConfig = await voiceRoles.findOne({ Guild: interaction.guild.id, VoiceChannel: id });
                if (existingConfig) continue;

                // Créer un rôle avec le même nom que le salon
                const role = await interaction.guild.roles.create({
                    name: `🔊 ${channel.name}`,
                    color: 'Blue',
                    reason: 'Rôle automatique pour salon vocal'
                });

                // Sauvegarder dans la base de données
                await new voiceRoles({
                    Guild: interaction.guild.id,
                    VoiceChannel: id,
                    Role: role.id
                }).save();

                setupCount++;
            } catch (error) {
                console.error(`Erreur lors de la configuration du salon ${channel.name}:`, error);
            }
        }

        return client.succNormal({
            key: 'voiceRoles.setupAllSuccess',
            fields: [
                {
                    name: await client.t(interaction, 'voiceRoles.configuredChannels'),
                    value: `${setupCount}/${voiceChannels.size}`
                }
            ],
            type: 'editreply'
        }, interaction);
    }
}
