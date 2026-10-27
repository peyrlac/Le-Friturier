const Discord = require('discord.js');
const BotStatus = require('../../database/models/bot-status');
const { applyBotStatus, renderStatusActivity } = require('../../handlers/functions/botStatus');
const logger = require('../../handlers/logger');

module.exports = async (client, interaction) => {
    try {
        await interaction.editReply({ content: '⏳ Mise à jour de la présence globale...' });

        const perms = await client.checkUserPerms({
            flags: [Discord.PermissionsBitField.Flags.Administrator],
            perms: [Discord.PermissionsBitField.Flags.Administrator],
        }, interaction);

        if (perms === false) return;

        const activity = interaction.options.getString('activity', true).trim();
        const type = interaction.options.getString('type', true);
        const presence = interaction.options.getString('presence') || 'online';

        const status = await BotStatus.findOneAndUpdate(
        { Key: 'global' },
        {
            Key: 'global',
            Activity: activity,
            Type: type,
            Presence: presence,
            UpdatedBy: interaction.user.id,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
        ).lean();

        const activityTypes = {
        Playing: Discord.ActivityType.Playing,
        Listening: Discord.ActivityType.Listening,
        Watching: Discord.ActivityType.Watching,
        Streaming: Discord.ActivityType.Streaming,
        Competing: Discord.ActivityType.Competing,
        };
        const renderedActivity = renderStatusActivity(activity, { client });

        await applyBotStatus(client, status);

        const response = interaction.editReply({
            content: `✅ Présence globale mise à jour : **${type} ${activity}** (${presence}).`,
        });

        if (client.shard?.broadcastEval) {
            client.shard.broadcastEval(
            async (shardClient, context) => {
                shardClient.user.setPresence({
                    activities: [{ name: context.activity, type: context.type }],
                    status: context.presence,
                });
                return true;
            },
            { context: { activity: renderedActivity, type: activityTypes[type], presence } },
            ).catch(error => {
                logger.warn('SYSTEM', 'La propagation de la présence aux autres shards a échoué', error.message);
            });
        }

        return response;
    } catch (error) {
        logger.error('SYSTEM', 'Échec de /config status', error);
        if (interaction.deferred || interaction.replied) {
            return interaction.editReply({ content: '❌ Impossible de mettre à jour la présence globale.' }).catch(() => null);
        }
        return interaction.reply({ content: '❌ Impossible de mettre à jour la présence globale.', flags: Discord.MessageFlags.Ephemeral }).catch(() => null);
    }
};
