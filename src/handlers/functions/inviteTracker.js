const Discord = require("discord.js");

module.exports = async (client) => {
const logger = require('../logger');
const guildInvites = new Map();

    client.on(Discord.Events.InviteCreate, async invite => {
        try {
            await refreshGuildInvites(invite.guild);
        }
        catch (error) {
            logger.error('INVITES', 'Échec du rafraîchissement après création d’une invitation', error);
        }
    })

    client.once(Discord.Events.ClientReady, async () => {
        setTimeout(() => {
            client.guilds.cache.forEach(guild => {
                refreshGuildInvites(guild).catch(error => {
                    logger.error('INVITES', `Échec de mise en cache pour la guild ${guild.id}`, error);
                });
            });
        }, 1000);
    });

    client.on(Discord.Events.GuildCreate, async guild => {
        try {
            await refreshGuildInvites(guild);
        } catch (error) {
            logger.error('INVITES', `Échec de mise en cache pour la nouvelle guild ${guild.id}`, error);
        }
    });

    client.on(Discord.Events.GuildDelete, async guild => {
        guildInvites.delete(guild.id);
    });

    client.on(Discord.Events.GuildMemberAdd, async member => {
        try {
            const cachedInvites = guildInvites.get(member.guild.id) || new Map();
            const newInvites = await refreshGuildInvites(member.guild);
            const usedInvite = newInvites.find(inv => (cachedInvites.get(inv.code) || 0) < (inv.uses || 0));
            if (!usedInvite) return client.emit("inviteJoin", member, null, null);

            client.emit("inviteJoin", member, usedInvite, usedInvite.inviter);
        } catch (error) {
            logger.error('INVITES', `Échec de résolution de l’invitation pour ${member.id}`, error);
            return client.emit("inviteJoin", member, null, null);
        }
    });

    async function refreshGuildInvites(guild) {
        if (!guild || !guild.invites) return new Map();

        const fetchedInvites = await guild.invites.fetch().catch(error => {
            if (error.code === 50013 || error.code === 10003) return [];
            throw error;
        });
        const codeUses = new Map();
        fetchedInvites.forEach(invite => codeUses.set(invite.code, invite.uses || 0));
        guildInvites.set(guild.id, codeUses);
        return fetchedInvites;
    }
}
