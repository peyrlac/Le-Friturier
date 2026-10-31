const mongoose = require('mongoose');
const { Client, Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { generateCalendarLinks } = require('../../assets/utils/calendar');
const chalk = require('chalk');
const logger = require('../../handlers/logger');

// Définir le sous-schéma pour un rappel individuel
const ReminderStateSchema = new mongoose.Schema({
    sent: { type: Boolean, default: false, required: true },
    timestamp: { type: Number, default: null }
}, { _id: false });

// Définir le sous-schéma pour sentReminders avec la nouvelle structure
const ReminderSchema = new mongoose.Schema({
    month: { type: ReminderStateSchema, default: () => ({ sent: false, timestamp: null }), required: true },
    week: { type: ReminderStateSchema, default: () => ({ sent: false, timestamp: null }), required: true },
    day: { type: ReminderStateSchema, default: () => ({ sent: false, timestamp: null }), required: true }
}, { _id: false });

const EventThreadSchema = new mongoose.Schema({
    eventName: { type: String, required: true },
    eventId: { type: String, required: true },
    threadId: { type: String, required: true },
    followupMessageId: { type: String },  // ID du message de description
    scheduledStartTimestamp: { type: Number, required: true },
    sentReminders: { type: ReminderSchema, required: true, default: () => ({}) },
    version: { type: Number, default: 2 }
});

const Schema = new mongoose.Schema({
    Guild: { type: String, required: true },
    Channel: { type: String, required: true },
    EventThreads: [EventThreadSchema]
});

// Définir les seuils exacts pour les rappels (identiques à ceux dans eventReminders.js)
const reminderTimes = {
    month: 30 * 24 * 60 * 60 * 1000,  // 30 jours en ms
    week: 7 * 24 * 60 * 60 * 1000,    // 7 jours en ms
    day: 24 * 60 * 60 * 1000          // 1 jour en ms
};

// Fonction pour initialiser les rappels en fonction de la date
function initializeRemindersForTimestamp(timestamp) {
    const now = Date.now();
    const timeUntilEvent = timestamp - now;

    // Initialiser tous les rappels à false par défaut
    const reminders = {
        month: { sent: false, timestamp: null },
        week: { sent: false, timestamp: null },
        day: { sent: false, timestamp: null }
    };

    // Si on est plus proche qu'un seuil, marquer ce rappel et tous les rappels plus lointains comme envoyés
    if (timeUntilEvent <= reminderTimes.day) {
        reminders.day = { sent: true, timestamp: now };
        reminders.week = { sent: true, timestamp: now };
        reminders.month = { sent: true, timestamp: now };
    } else if (timeUntilEvent <= reminderTimes.week) {
        reminders.week = { sent: true, timestamp: now };
        reminders.month = { sent: true, timestamp: now };
    } else if (timeUntilEvent <= reminderTimes.month) {
        reminders.month = { sent: true, timestamp: now };
    }

    console.log('État des rappels initialisé:', {
        timeUntilEvent: formatTimeForLogs(timeUntilEvent),
        reminders,
        explanation: {
            month: `${reminders.month.sent ? 'Désactivé' : 'Activé'} (seuil: ${formatTimeForLogs(reminderTimes.month)})`,
            week: `${reminders.week.sent ? 'Désactivé' : 'Activé'} (seuil: ${formatTimeForLogs(reminderTimes.week)})`,
            day: `${reminders.day.sent ? 'Désactivé' : 'Activé'} (seuil: ${formatTimeForLogs(reminderTimes.day)})`
        }
    });

    return reminders;
}

function getActivityEmoji(text) {
    const searchText = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll("'", "").toLowerCase();
    const collapsedText = searchText.replace(/(.)\1+/g, '$1');
    const singularText = searchText.replace(/\b([a-z]+)(s|x)\b/g, '$1');
    const collapsedSingularText = collapsedText.replace(/\b([a-z]+)(s|x)\b/g, '$1');
    const searchVariants = [
        searchText,
        collapsedText,
        singularText,
        collapsedSingularText
    ];
    const themes = [
        { emoji: '⭐', regex: /\b(cugnon)\b/i},
        { emoji: '🕯️', regex: /\b(hommage)\b/i},
        { emoji: '🎵', regex: /\b(musique|concert|festival|ardentes|playlist|ecoute|album|chanson|chanteur|clubber|club|cluber|notes)\b/i},
        { emoji: '🎪', regex: /\b(japan day|made in asia|comic con|comic-con|cosplay)\b/i},
        { emoji: '🌊', regex: /\b(aqualibi|aqualand|piscine|aquaparc|plage)\b/i},
        { emoji: '🎢', regex: /\b(parc|asterix|walibi|disney|attraction|attractions|rollercoaster)\b/i},
        { emoji: '🎳', regex: /\b(bowling|escape|quizz|vr|activite)\b/i},
        { emoji: '🎬', regex: /\b(cinema|film|stream|twitch|netflix|film|video|youtube|animation)\b/i},
        { emoji: '🎨', regex: /\b(experience|theatre|peinture|art|musee|nuit blanche|nuit de l art|musees|expos|expo)\b/i},
        { emoji: '🎮', regex: /\b(pokemon|tournoi|game|gaming|jeux video|ps5|switch|xbox|jouer)\b/i},
        { emoji: '🍣', regex: /\b(hosaku|sushi|yayami|japonais|coreen)\b/i},
        { emoji: '🍔', regex: /\b(huggy|huggys|bk|burger king|burger|burgers|frites|frite)\b/i},
        { emoji: '🍜', regex: /\b(resto|restau|restaurant|buffet|cuisine|manger|recette|repas|nourriture)\b/i},
        { emoji: '🎉', regex: /\b(soiree|anniversaire|annif|anniv|teuf|fete)\b/i},
        { emoji: '🍻', regex: /\b(boite|sortie|verre|bar|zodiak)\b/i},
    ];

    for (const theme of themes) {
        if (searchVariants.some(variant => theme.regex.test(variant))) {
            return theme.emoji; // ou return theme pour plus de détails
        }
    }

    return '📆';
}

// Fonction utilitaire pour formater le temps en jours, heures, minutes
function formatTimeForLogs(ms) {
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    return `${days}j ${hours}h ${minutes}m`;
}

async function clearOldEventsFromDatabase(client) {
    const startedAt = Date.now();
    try {
        logger.info('CLEANUP', 'Nettoyage des événements en base démarré');
        
        const ONE_MONTH = 30 * 24 * 60 * 60 * 1000; // 30 jours en millisecondes
        const TWO_HOURS = 2 * 60 * 60 * 1000; // 2 heures en millisecondes
        const THIRTY_MINUTES = 30 * 60 * 1000; // 30 minutes en millisecondes
        const ZERO_MINUTES = 0 * 60 * 1000; // 0 minutes en millisecondes
        const now = Date.now();
        
        // Récupérer toutes les guildes
        const guilds = await AnnouncementChannels.find({});
        logger.info('CLEANUP', `${guilds.length} serveur(s) à traiter`);
        
        let totalEventsProcessed = 0;
        let totalEventsRemoved = 0;
        let totalGuildsUpdated = 0;
        const processedGuilds = [];
        const removedEvents = [];
        
        for (const guildData of guilds) {
            try {
                // Vérifier si la guilde a des événements
                if (!Array.isArray(guildData.EventThreads) || guildData.EventThreads.length === 0) {
                    const cachedGuild = client.guilds.cache.get(guildData.Guild);
                    processedGuilds.push({
                        id: guildData.Guild,
                        name: cachedGuild?.name || 'Serveur sans nom',
                        events: 0,
                    });
                    logger.warn('CLEANUP', `Aucun événement trouvé pour ${cachedGuild?.name || guildData.Guild}`);
                    continue;
                }

                console.log(chalk.blue(chalk.bold(`Cleanup`)), (chalk.white(`>>`)), chalk.green(`Processing guild ${guildData.Guild} with ${guildData.EventThreads.length} events`));

                let hasUpdates = false;
                const updatedEvents = [];

                // Récupérer la guilde Discord une seule fois
                const discordGuild = await client.guilds.fetch(guildData.Guild).catch(error => {
                    console.error(chalk.blue(chalk.bold(`Cleanup`)), (chalk.white(`>>`)), chalk.red(`Failed to fetch guild ${guildData.Guild}:`), error);
                    return null;
                });

                if (!discordGuild) {
                    console.log(chalk.blue(chalk.bold(`Cleanup`)), (chalk.white(`>>`)), chalk.yellow(`Skipping guild ${guildData.Guild} - Cannot access`));
                    continue;
                }

                processedGuilds.push({
                    id: guildData.Guild,
                    name: discordGuild.name || 'Serveur sans nom',
                    events: guildData.EventThreads.length,
                });

                // Traiter chaque événement
                for (const eventThread of guildData.EventThreads) {
                    try {
                        totalEventsProcessed++;
                        const timeSinceEvent = now - eventThread.scheduledStartTimestamp;
                        
                        // Si le timestamp est null ou undefined, on le récupère depuis Discord
                        if (!eventThread.scheduledStartTimestamp) {
                            try {
                                const guild = await client.guilds.fetch(guildData.Guild);
                                const discordEvent = await guild.scheduledEvents.fetch(eventThread.eventId);
                                
                                if (discordEvent) {
                                    eventThread.scheduledStartTimestamp = discordEvent.scheduledStartTimestamp;
                                    
                                    // Mettre à jour la base de données avec le nouveau timestamp
                                    await AnnouncementChannels.updateOne(
                                        { 
                                            Guild: guildData.Guild,
                                            'EventThreads.eventId': eventThread.eventId
                                        },
                                        { 
                                            $set: { 
                                                'EventThreads.$.scheduledStartTimestamp': eventThread.scheduledStartTimestamp
                                            }
                                        }
                                    );
                                    
                                    console.log(chalk.blue(chalk.bold(`Event`)), (chalk.white(`>>`)), chalk.green(`Updated timestamp for event`), chalk.red(`${eventThread.eventName}`));
                                } else {
                                    console.log(chalk.blue(chalk.bold(`Event`)), (chalk.white(`>>`)), chalk.red(`Could not find Discord event`), chalk.yellow(`${eventThread.eventName}`));
                                    continue;
                                }
                            } catch (error) {
                                console.error(`Error fetching Discord event ${eventThread.eventName}:`, error);
                                continue;
                            }
                        }

                        // Si l'événement est trop vieux, on passe au suivant sans l'ajouter à updatedEvents
                        if (timeSinceEvent >= ONE_MONTH && eventThread.scheduledStartTimestamp) {
                            console.log(chalk.blue(chalk.bold(`Cleanup`)), (chalk.white(`>>`)), chalk.yellow(`Removing old event ${eventThread.eventName} from guild ${guildData.Guild} (${Math.floor(timeSinceEvent / 60000)} minutes old)`));
                            totalEventsRemoved++;
                            removedEvents.push({
                                guildId: guildData.Guild,
                                guildName: discordGuild.name || 'Serveur sans nom',
                                eventId: eventThread.eventId,
                                eventName: eventThread.eventName || 'Événement sans nom',
                            });
                            continue;
                        }

                        // Si l'événement n'a pas de version ou est en version 1, on met à jour sa description
                        if (!eventThread.version || eventThread.version === 1) {
                            try {
                                const discordEvent = await discordGuild.scheduledEvents.fetch(eventThread.eventId);
                                if (discordEvent) {
                                    // 1. Mettre à jour la description dans Discord
                                    //const newDescription = (discordEvent.description || "") + ".";
                                    //await discordEvent.edit({ description: newDescription });
                        
                                    // 2. Mettre à jour le followupMessage dans le thread
                                    const thread = await client.channels.fetch(eventThread.threadId).catch(() => null);
                                    if (thread?.isThread() && eventThread.followupMessageId) {
                                        const followupMessage = await thread.messages.fetch(eventThread.followupMessageId).catch(() => null);
                                        if (followupMessage) {
                                            const start = discordEvent.scheduledStartTimestamp;
                                            const end = discordEvent.scheduledEndTimestamp || (start + 60 * 60 * 1000);
                                            const calendarLinks = generateCalendarLinks({
                                                title: discordEvent.name,
                                                description: discordEvent.description,
                                                location: discordEvent.entityMetadata.location,
                                                startDate: new Date(start).toISOString(),
                                                endDate: new Date(end).toISOString()
                                            });
                                            const calendarButton = new ActionRowBuilder()
                                            .addComponents(
                                                new ButtonBuilder()
                                                    .setLabel('Ajouter à Google agenda')
                                                    .setStyle(ButtonStyle.Link)
                                                    .setURL(calendarLinks.google)
                                            )
                                            .addComponents(
                                                new ButtonBuilder()
                                                    .setLabel('Ajouter à Outlook')
                                                    .setStyle(ButtonStyle.Link)
                                                    .setURL(calendarLinks.outlook)
                                            );
                                            const embed = new EmbedBuilder()
                                                .setTitle("\`📌\`  Informations importantes")
                                                .setDescription(discordEvent.description) // Utiliser la nouvelle description
                                                .setColor(0x0099FF)
                                                .setTimestamp(new Date(eventThread.scheduledStartTimestamp))
                                            
                                                if (discordEvent.creator) {
                                                    embed.setFooter({ 
                                                        text: discordEvent.creator.globalName || discordEvent.creator.username || discordEvent.creator.tag,
                                                        iconURL: discordEvent.creator.avatarURL() 
                                                    });
                                                } else if (discordEvent.creatorId) {
                                                    const creator = await client.users.fetch(discordEvent.creatorId).catch(() => null);
                                                    if (creator) {
                                                        embed.setFooter({ 
                                                            text: creator.globalName || creator.username || creator.tag,
                                                            iconURL: creator.avatarURL() 
                                                        });
                                                    }
                                                }
                                            await followupMessage.edit({ content: "", embeds: [embed], components: [calendarButton] });
                                            console.log(chalk.green(`Updated followupMessage for ${eventThread.eventName}`));
                                        }
                                    }
                        
                                    // 3. Mettre à jour la version
                                    eventThread.version = 2;
                                    hasUpdates = true;
                                }
                            } catch (error) {
                                console.error(`Failed to update event ${eventThread.eventName}:`, error);
                            }
                        }

                        // Garder l'événement dans la liste mise à jour
                        updatedEvents.push(eventThread);
                    } catch (eventError) {
                        console.error(chalk.blue(chalk.bold(`Cleanup`)), (chalk.white(`>>`)), chalk.red(`Error processing event ${eventThread.eventName}:`), eventError);
                    }
                }

                // Mettre à jour la base de données si nécessaire
                if (hasUpdates || updatedEvents.length !== guildData.EventThreads.length) {
                    const removedCount = guildData.EventThreads.length - updatedEvents.length;
                    console.log(chalk.blue(chalk.bold(`Cleanup`)), (chalk.white(`>>`)), chalk.green(`Guild ${guildData.Guild}: Removed ${removedCount} old events, ${updatedEvents.length} events remaining`));

                    await AnnouncementChannels.updateOne(
                        { Guild: guildData.Guild },
                        { $set: { EventThreads: updatedEvents } }
                    );
                    totalGuildsUpdated++;
                }
            } catch (error) {
                console.error(chalk.blue(chalk.bold(`Cleanup`)), (chalk.white(`>>`)), chalk.red(`Error processing guild ${guildData.Guild}:`), error);
            }
        }

        const summary = {
            guildsProcessed: guilds.length,
            guildsUpdated: totalGuildsUpdated,
            eventsProcessed: totalEventsProcessed,
            eventsRemoved: totalEventsRemoved,
            guilds: processedGuilds,
            removedEvents,
        };

        logger.success('CLEANUP', `Nettoyage terminé en ${Date.now() - startedAt} ms`, summary);
        return summary;

    } catch (error) {
        console.error(chalk.blue(chalk.bold(`Cleanup`)), (chalk.white(`>>`)), chalk.red(`Error in clearOldEventsFromDatabase:`), error);
        throw error; // Propager l'erreur pour la gestion dans clientReady
    }
}

// Middleware pour s'assurer que sentReminders est toujours initialisé correctement
EventThreadSchema.pre('save', function(next) {
    if (!this.sentReminders || typeof this.sentReminders !== 'object') {
        this.sentReminders = initializeRemindersForTimestamp(this.scheduledStartTimestamp);
    } else {
        // Vérifier et corriger chaque type de rappel
        const now = Date.now();
        const timeUntilEvent = this.scheduledStartTimestamp - now;
        const newReminders = initializeRemindersForTimestamp(this.scheduledStartTimestamp);

        // S'assurer que chaque rappel a la bonne structure
        ['month', 'week', 'day'].forEach(type => {
            if (!this.sentReminders[type] || typeof this.sentReminders[type] !== 'object') {
                this.sentReminders[type] = newReminders[type];
            } else {
                // S'assurer que les propriétés sont du bon type
                if (typeof this.sentReminders[type].sent !== 'boolean') {
                    this.sentReminders[type].sent = newReminders[type].sent;
                }
                if (typeof this.sentReminders[type].timestamp !== 'number' && this.sentReminders[type].timestamp !== null) {
                    this.sentReminders[type].timestamp = newReminders[type].timestamp;
                }
            }
        });
    }
    next();
});

// Exporter le modèle et la fonction de migration
const AnnouncementChannels = mongoose.model("announcement-channels", Schema);

module.exports = {
    model: AnnouncementChannels,
    getActivityEmoji,
    clearOldEventsFromDatabase
};
