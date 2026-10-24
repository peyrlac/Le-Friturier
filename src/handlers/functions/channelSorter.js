const Schema = require("../../database/models/channelActivity");
const Discord = require('discord.js');

// Map pour stocker les verrous par catégorie
const locks = new Map();
const PINNED_EMOJI = '📌';

module.exports = (client) => {
    async function getLastActivity(channel) {
        if (channel.type !== Discord.ChannelType.GuildForum) {
            const messages = await channel.messages.fetch({ limit: 1 });
            const lastMessage = messages.first();
            return {
                lastMessageTime: lastMessage ? lastMessage.createdTimestamp : 0,
                lastMessageId: lastMessage ? lastMessage.id : '0'
            };
        }

        // Pour un forum, l'activité du salon est celle de son thread le plus récent.
        const activeThreads = await channel.threads.fetchActive();
        const threadActivities = await Promise.all(
            [...activeThreads.threads.values()].map(async thread => {
                try {
                    const messages = await thread.messages.fetch({ limit: 1 });
                    const lastMessage = messages.first();
                    return {
                        lastMessageTime: lastMessage ? lastMessage.createdTimestamp : thread.createdTimestamp,
                        lastMessageId: lastMessage ? lastMessage.id : thread.id
                    };
                } catch (error) {
                    return {
                        lastMessageTime: thread.createdTimestamp,
                        lastMessageId: thread.id
                    };
                }
            })
        );

        return threadActivities.reduce(
            (latest, activity) => activity.lastMessageTime > latest.lastMessageTime ? activity : latest,
            { lastMessageTime: 0, lastMessageId: '0' }
        );
    }

    async function sortChannels(client, guildId, categoryId, mode = 'automatic', pinnedOrder = 'first') {
        // Vérifier si un tri est déjà en cours pour cette catégorie
        const lockKey = `${guildId}-${categoryId}`;
        if (locks.get(lockKey)) {
            console.log(`Tri déjà en cours pour la catégorie ${categoryId}`);
            return;
        }

        try {
            // Poser le verrou
            locks.set(lockKey, true);

            if (mode === 'manual') return;

            const guild = await client.guilds.fetch(guildId);
            if (!guild) return;

            const category = await guild.channels.fetch(categoryId);
            if (!category) return;

            // Vérifier les permissions du bot
            const botMember = await guild.members.fetch(client.user.id);
            const requiredPermissions = [
                Discord.PermissionsBitField.Flags.ManageChannels,
                Discord.PermissionsBitField.Flags.ViewChannel
            ];

            const missingPermissions = category.permissionsFor(botMember).missing(requiredPermissions);
            if (missingPermissions.length > 0) {
                console.log(`Permissions manquantes dans la catégorie ${category.name} (${categoryId}): ${missingPermissions.join(', ')}`);
                // Désactiver le tri pour cette catégorie
                await Schema.findOneAndUpdate(
                    { Guild: guildId, Category: categoryId },
                    { IsActive: false }
                );
                return;
            }

            // Récupérer tous les salons textuels de la catégorie
            const textChannels = category.children.cache.filter(
                channel => [
                    Discord.ChannelType.GuildText,
                    Discord.ChannelType.GuildForum
                ].includes(channel.type)
            );

            // Vérifier les permissions pour chaque salon
            const channelsWithPermissions = textChannels.filter(channel => 
                channel.permissionsFor(botMember).has([
                    Discord.PermissionsBitField.Flags.ManageChannels,
                    Discord.PermissionsBitField.Flags.ViewChannel
                ])
            );

            const orderedChannels = [...channelsWithPermissions.values()]
                .sort((a, b) => a.position - b.position)
                .map(channel => channel.position);

            // En mode hybride, les salons dont la description contient 📌 sont manuels.
            const pinnedChannels = mode === 'hybrid'
                ? [...channelsWithPermissions.values()].filter(channel =>
                    typeof channel.topic === 'string' && channel.topic.includes(PINNED_EMOJI)
                )
                : [];
            const autoChannels = mode === 'hybrid'
                ? [...channelsWithPermissions.values()].filter(channel =>
                    !pinnedChannels.includes(channel)
                )
                : [...channelsWithPermissions.values()];

            // Trier les salons automatiques par dernier message avec plus de précision
            const sortedChannels = await Promise.all(
                [...autoChannels.values()].map(async channel => {
                    try {
                        const activity = await getLastActivity(channel);
                        return {
                            channel: channel,
                            ...activity
                        };
                    } catch (error) {
                        console.error(`Erreur lors de la récupération des messages pour ${channel.name}:`, error);
                        return {
                            channel: channel,
                            lastMessageTime: 0,
                            lastMessageId: '0'
                        };
                    }
                })
            );

            // Trier par timestamp décroissant et utiliser l'ID comme second critère
            sortedChannels.sort((a, b) => {
                if (b.lastMessageTime === a.lastMessageTime) {
                    return b.lastMessageId.localeCompare(a.lastMessageId);
                }
                return b.lastMessageTime - a.lastMessageTime;
            });

            const manuallyOrderedPinnedChannels = pinnedChannels.sort((a, b) => a.position - b.position);
            const channelsToPlace = mode === 'hybrid' && pinnedOrder === 'last'
                ? [...sortedChannels.map(item => item.channel), ...manuallyOrderedPinnedChannels]
                : [...manuallyOrderedPinnedChannels, ...sortedChannels.map(item => item.channel)];

            // Réorganiser les salons gérés en conservant les autres salons de la catégorie.
            for (let i = 0; i < channelsToPlace.length; i++) {
                const channel = channelsToPlace[i];
                const targetPosition = orderedChannels[i];
                if (channel.position !== targetPosition) {
                    try {
                        await channel.setPosition(targetPosition);
                        // Petit délai entre chaque modification pour éviter les conflits
                        await new Promise(resolve => setTimeout(resolve, 100));
                    } catch (error) {
                        console.error(`Erreur lors du changement de position pour ${channel.name}:`, error);
                    }
                }
            }

            // Mettre à jour le timestamp de dernière vérification
            await Schema.findOneAndUpdate(
                { Guild: guildId, Category: categoryId },
                { LastCheck: new Date() }
            );

        } catch (error) {
            console.error(`Erreur lors du tri des salons pour la catégorie ${categoryId}:`, error);
        } finally {
            // Libérer le verrou
            locks.delete(lockKey);
        }
    }

    return {
        sortChannels
    };
};
