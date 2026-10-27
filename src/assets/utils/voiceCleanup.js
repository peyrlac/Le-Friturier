const Discord = require('discord.js');
const voiceRoles = require("../../database/models/voiceRoles");
const logger = require('../../handlers/logger');

module.exports = async (client) => {
    logger.info('VOICE', 'Lancement de la vérification');
    const startedAt = Date.now();
    let guildsProcessed = 0;
    let voiceRulesProcessed = 0;
    let rolesAdded = 0;
    let rolesRemoved = 0;
    const processedGuilds = [];
    const roleChanges = [];

    try {
        // Attendre que tous les shards soient prêts
        await client.shard.fetchClientValues('guilds.cache.size');
        
        for (const [guildId, guild] of client.guilds.cache) {
            guildsProcessed++;
            processedGuilds.push({
                id: guildId,
                name: guild.name || 'Serveur sans nom',
            });
            try {
                const voiceRoleEntries = await voiceRoles.find({ Guild: guildId });
                if (!voiceRoleEntries.length) continue;

                for (const entry of voiceRoleEntries) {
                    voiceRulesProcessed++;
                    const voiceChannel = guild.channels.cache.get(entry.VoiceChannel);
                    const role = guild.roles.cache.get(entry.Role);

                    if (!voiceChannel || !role) {
                        await voiceRoles.deleteOne({ _id: entry._id });
                        continue;
                    }

                    // Récupération sécurisée des membres
                    let members;
                    try {
                        members = guild.members.cache;
                    } catch (error) {
                        logger.warn('VOICE', `Impossible de lire les membres de ${guildId}; utilisation du cache`, error.message);
                        continue;
                    }

                    // Vérification des membres
                    const membersInVoice = voiceChannel.members;
                    members.forEach((member) => {
                        const hasRole = member.roles.cache.has(role.id);
                        const isInVoice = membersInVoice.has(member.id);

                        if (isInVoice && !hasRole) {
                            member.roles.add(role).catch(error => logger.warn('VOICE', `Impossible d’ajouter le rôle ${role.id}`, error.message));
                            rolesAdded++;
                            roleChanges.push({
                                guildId,
                                guildName: guild.name || 'Serveur sans nom',
                                memberId: member.id,
                                memberName: member.displayName || member.user?.username || 'Membre sans nom',
                                roleId: role.id,
                                action: 'add',
                            });
                        } else if (!isInVoice && hasRole) {
                            member.roles.remove(role).catch(error => logger.warn('VOICE', `Impossible de retirer le rôle ${role.id}`, error.message));
                            rolesRemoved++;
                            roleChanges.push({
                                guildId,
                                guildName: guild.name || 'Serveur sans nom',
                                memberId: member.id,
                                memberName: member.displayName || member.user?.username || 'Membre sans nom',
                                roleId: role.id,
                                action: 'remove',
                            });
                        }
                    });
                }
            } catch (guildError) {
                logger.error('VOICE', `Erreur sur le serveur ${guildId}`, guildError.message);
            }
        }
        logger.success('VOICE', `Nettoyage terminé en ${Date.now() - startedAt} ms`, {
            guildsProcessed,
            voiceRulesProcessed,
            rolesAdded,
            rolesRemoved,
            guilds: processedGuilds,
            roleChanges,
        });
    } catch (globalError) {
        logger.error('VOICE', 'Erreur globale', globalError.message);
    }
};
