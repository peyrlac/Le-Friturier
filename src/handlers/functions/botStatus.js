const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const BotStatus = require('../../database/models/bot-status');

const activityTypes = {
    Playing: Discord.ActivityType.Playing,
    Listening: Discord.ActivityType.Listening,
    Watching: Discord.ActivityType.Watching,
    Streaming: Discord.ActivityType.Streaming,
    Competing: Discord.ActivityType.Competing,
};

function loadStatusPool() {
    if (process.env.DISCORD_STATUS) {
        return process.env.DISCORD_STATUS.split(',')
            .map(status => status.trim())
            .filter(Boolean)
            .map(name => ({ name, type: Discord.ActivityType.Watching }));
    }

    const filePath = path.join(__dirname, '../../assets/statuses.txt');
    return fs.readFileSync(filePath, 'utf8')
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'))
        .map(line => {
            const separator = line.indexOf('|');
            const typeName = separator === -1 ? 'Watching' : line.slice(0, separator).trim();
            const name = separator === -1 ? line : line.slice(separator + 1).trim();
            return {
                name,
                type: activityTypes[typeName] ?? Discord.ActivityType.Watching,
            };
        })
        .filter(status => status.name);
}

async function getBotStatus() {
    return BotStatus.findOne({ Key: 'global' }).lean();
}

function renderStatusActivity(activity, context = {}) {
    const values = {
        guilds: context.guilds ?? context.client?.guilds?.cache?.size ?? 'les serveurs',
        users: context.users ?? getCachedUsers(context.client),
        membersInVoice: context.membersInVoice ?? getMembersInVoice(context.client),
        channels: context.channels ?? getCachedChannels(context.client),
        commands: context.commands ?? context.client?.commands?.size ?? 'les commandes',
        version: context.version ?? require('../../../package.json').version,
        uptime: context.uptime ?? 'quelques instants',
        shard: context.shard ?? 1,
        time: context.time ?? new Date().toLocaleTimeString('fr-BE'),
        date: context.date ?? new Date().toLocaleDateString('fr-BE'),
    };

    return activity.replace(/\{(guilds|users|membersInVoice|channels|commands|version|uptime|shard|time|date)\}/gi, (_, key) => {
        const matchingKey = Object.keys(values).find(candidate => candidate.toLowerCase() === key.toLowerCase());
        return values[matchingKey] ?? `{${key}}`;
    });
}

function getCachedUsers(client) {
    return client?.guilds?.cache?.reduce((total, guild) => total + (guild.memberCount || guild.members.cache.size), 0) || 'les utilisateurs';
}

function getMembersInVoice(client) {
    return client?.guilds?.cache?.reduce((total, guild) => total + guild.voiceStates.cache.filter(state => state.channelId).size, 0) || 0;
}

function getCachedChannels(client) {
    return client?.guilds?.cache?.reduce((total, guild) => total + guild.channels.cache.size, 0) || 0;
}

async function applyBotStatus(client, status = null, context = {}) {
    const configured = status || await getBotStatus();
    if (!configured) return null;
    const type = activityTypes[configured.Type] ?? Discord.ActivityType.Playing;
    client.user.setPresence({
        activities: [{ name: renderStatusActivity(configured.Activity, { ...context, client }), type }],
        status: configured.Presence || 'online',
    });

    return configured;
}

module.exports = {
    applyBotStatus,
    getBotStatus,
    loadStatusPool,
    renderStatusActivity,
};
