const Discord = require('discord.js');
const logger = require('../../handlers/logger');
const Schema = require('../../database/models/channelActivity');
const voiceCleanup = require('../../assets/utils/voiceCleanup');
const { model: AnnouncementChannels, clearOldEventsFromDatabase } = require('../../database/models/announcement-channels');
const { ReminderManager, createManager } = require('../../handlers/functions/eventReminders');
const statistics = require('../../handlers/functions/statistics');


module.exports = async (client) => {
    const channelSorter = require('../../handlers/functions/channelSorter')(client);
    const reminderManager = createManager();
    const statisticsManager = statistics.createManager();

    // Migrer les anciennes configurations vers le mode automatique.
    try {
        await Promise.all([
            Schema.updateMany(
                { $or: [{ Mode: { $exists: false } }, { Mode: null }] },
                { $set: { Mode: 'automatic' } }
            ),
            Schema.updateMany(
                { $or: [{ PinnedOrder: { $exists: false } }, { PinnedOrder: null }] },
                { $set: { PinnedOrder: 'first' } }
            )
        ]);
    } catch (error) {
        logger.error('SYSTEM', 'Échec de migration des configurations du Channel Sorter', error);
    }

    // Debug: confirm clientReady handler started
    logger.info('SYSTEM', 'Handler clientReady démarré');

    const startLogs = new Discord.WebhookClient({
        id: client.webhooks.startLogs.id,
        token: client.webhooks.startLogs.token,
    });

    // Nettoyage des anciens événements et vérification des rappels sont indépendants.
    const cleanupPromise = (async () => {
        logger.info('EVENTS', 'Nettoyage des événements démarré');
        try {
            await clearOldEventsFromDatabase(client);
            logger.success('EVENTS', 'Nettoyage des événements terminé');
        } catch (error) {
            logger.error('EVENTS', 'Échec du nettoyage des événements', error);
        }
    })();

    const remindersPromise = reminderManager.checkEventReminders(client).catch(error => {
        logger.error('EVENTS', 'Échec de la vérification initiale des rappels', error);
    });

    await Promise.all([cleanupPromise, remindersPromise]);

    logger.success('SYSTEM', `Shard #${client.shard.ids[0] + 1} prêt`);
    logger.success('SYSTEM', `Bot connecté sur ${client.guilds.cache.size} serveur(s)`);

    // Cleanup voice role
    try {
        await voiceCleanup(client);
    } catch (err) {
        logger.error('VOICE', 'Le nettoyage vocal a échoué, le démarrage continue', err);
    }

    // Debug: run an initial tracking pass immediately to verify the scheduler and fetches
    try {
        logger.info('STATISTICS', 'Synchronisation initiale de l’activité vocale');
        // createManager returns a StatisticsManager instance whose method accepts (client)
        await statisticsManager.trackAllVoiceActivity(client);
        logger.success('STATISTICS', 'Synchronisation initiale de l’activité vocale terminée');
    } catch (err) {
        logger.error('STATISTICS', 'Échec de la synchronisation initiale de l’activité vocale', err);
    }

    let embed = new Discord.EmbedBuilder()
        .setTitle(`🆙・Finishing shard`)
        .setDescription(`A shard just finished`)
        .addFields(
            { name: "🆔┆ID", value: `${client.shard.ids[0] + 1}/${client.options.shardCount}`, inline: true },
            { name: "📃┆State", value: `Ready`, inline: true },
        )
        .setColor(client.config.colors.normal);
    startLogs.send({
        username: 'Bot Logs',
        embeds: [embed],
    });

    setInterval(async function () {
        const promises = [
            client.shard.fetchClientValues('guilds.cache.size'),
            // Ajout du tri des salons comme nouvelle promesse
            Schema.find({ IsActive: true }).then(configs => 
                Promise.all(configs.map(config => 
                    config.Mode === 'manual'
                        ? Promise.resolve()
                        : channelSorter.sortChannels(
                            client,
                            config.Guild,
                            config.Category,
                            config.Mode || 'automatic',
                            config.PinnedOrder || 'first'
                        )
                ))
            ),
            // Vérification des rappels d'événements
            reminderManager.checkEventReminders(client),
            
            // Track voice activity for each voice channel
            statisticsManager.trackAllVoiceActivity(client)
        ];
        return Promise.all(promises)
            .then(results => {
                const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
                let statuttext;

                if (process.env.DISCORD_STATUS) {
                    statuttext = process.env.DISCORD_STATUS.split(', ').map(status => ({
                        name: status,
                        type: Discord.ActivityType.Watching // Default type, change if necessary
                    }));
                } else {
                    statuttext = [
                        { name: `League of Legends`, type: Discord.ActivityType.Playing },
                        { name: `Minecraft`, type: Discord.ActivityType.Playing },
                        { name: `Rocket League`, type: Discord.ActivityType.Playing },
                        { name: `si aucune rebellion ne se forme`, type: Discord.ActivityType.Watching },
                        { name: `le crépitement de la friture`, type: Discord.ActivityType.Listening },
                        { name: `si Pierre fait pas de bêtises`, type: Discord.ActivityType.Watching },
                        { name: `si ça joue à LoL`, type: Discord.ActivityType.Watching },
                        { name: `si Yuumi a fini sa sieste`, type: Discord.ActivityType.Watching },
                        { name: `si Lisa a bu son camfé aujourd'hui`, type: Discord.ActivityType.Watching },
                        { name: `si Eliott et Mathieu ont ouvert le café jazz`, type: Discord.ActivityType.Watching },
                        { name: `si Davy sait toujours dessiner des bateaux`, type: Discord.ActivityType.Watching },
                        { name: `si Richard a trouvé le chemin de l'hosaku`, type: Discord.ActivityType.Watching },
                        { name: `si Diana est toujours chafouine`, type: Discord.ActivityType.Watching },
                        { name: `si Thibault maitrise toujours les 4 éléments`, type: Discord.ActivityType.Watching },
                        { name: `si Thomas a ajouté un nouveau film à sa liste`, type: Discord.ActivityType.Watching },
                        { name: `si une séance cinéma se prépare`, type: Discord.ActivityType.Watching },
                        { name: `si Richard a trouvé le chemin de l'hosaku`, type: Discord.ActivityType.Watching },
                        { name: `si Mathias et Charlotte profitent du soleil`, type: Discord.ActivityType.Watching },
                        { name: `si Ben peut me soulever. J'ai chaud`, type: Discord.ActivityType.Watching },
                        { name: `si Théo est toujours aussi magnifique`, type: Discord.ActivityType.Watching },
                        { name: `si Peter est toujours suspicious :peterSus:`, type: Discord.ActivityType.Watching },
                        { name: `si de nouveaux sons sur la soundboard ont été ajoutés`, type: Discord.ActivityType.Watching },
                        { name: `si on a encore banni un random`, type: Discord.ActivityType.Watching },
                        { name: `si il y a un anniversaire aujourd'hui`, type: Discord.ActivityType.Watching },
                        { name: `${totalGuilds} serveurs`, type: Discord.ActivityType.Watching }
                    ];
                }

                const randomText = statuttext[Math.floor(Math.random() * statuttext.length)];

                // Vérification supplémentaire pour s'assurer que randomText est bien défini et a les propriétés nécessaires
                if (randomText && typeof randomText.name === 'string' && typeof randomText.type === 'number') {
                    client.user.setPresence({ activities: [{ name: randomText.name, type: randomText.type }], status: 'online' });
                } else {
                    logger.warn('SYSTEM', 'Format ou type d’activité invalide', randomText);
                }
            })
            .catch(error => {
                logger.error('SYSTEM', 'Erreur dans l’intervalle d’activité', error);
            });
    }, 60000);

    client.player.init(client.user.id);
};
