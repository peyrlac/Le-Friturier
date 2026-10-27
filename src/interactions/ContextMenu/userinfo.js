const { CommandInteraction, Client } = require('discord.js');
const { ContextMenuCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const axios = require("axios");

const model = require('../../database/models/badge');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Userinfo')
        .setType(2),

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        await interaction.deferReply({ ephemeral: false });
        const member = await interaction.guild.members.fetch(interaction.options.getUser('user').id);
        if (!member) return client.errNormal({
            key: 'errors.userNotInGuild',
            type: 'editreply'
        }, interaction);
        const badgeFlags = {
            DEVELOPER: client.emotes.badges.developer,
            BUGS: client.emotes.badges.bug,
            MANAGEMENT: client.emotes.badges.management,
            PREMIUM: client.emotes.badges.premium,
            SUPPORTER: client.emotes.badges.supporter,
            TEAM: client.emotes.badges.team,
            BOOSTER: client.emotes.badges.booster,
            PARTNER: client.emotes.badges.partner,
            VOTER: client.emotes.badges.voter,
            SUPPORT: client.emotes.badges.support,
            MODERATOR: client.emotes.badges.moderator,
            DESIGNER: client.emotes.badges.designer,
            MARKETING: client.emotes.badges.marketing
        }

        const flags = {
            ActiveDeveloper: 'userinfo.flags.activeDeveloper',
            BugHunterLevel1: 'userinfo.flags.bugHunter',
            BugHunterLevel2: 'userinfo.flags.bugHunter',
            CertifiedModerator: 'userinfo.flags.certifiedModerator',
            HypeSquadOnlineHouse1: 'userinfo.flags.houseBravery',
            HypeSquadOnlineHouse2: 'userinfo.flags.houseBrilliance',
            HypeSquadOnlineHouse3: 'userinfo.flags.houseBalance',
            HypeSquadEvents: 'userinfo.flags.hypeSquadEvents',
            PremiumEarlySupporter: 'userinfo.flags.earlySupporter',
            Partner: 'userinfo.flags.partner',
            Quarantined: 'userinfo.flags.quarantined',
            Spammer: 'userinfo.flags.spammer',
            Staff: 'userinfo.flags.discordStaff',
            TeamPseudoUser: 'userinfo.flags.discordTeam',
            VerifiedBot: 'userinfo.flags.verifiedBot',
            VerifiedDeveloper: 'userinfo.flags.verifiedDeveloper',
        }

        let Badges = await model.findOne({ User: member.user.id });
        if (!Badges) Badges = { User: member.user.id }
        const roles = member.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(role => role.toString())
            .slice(0, -1);
        const userFlags = member.user.flags ? member.user.flags.toArray() : [];
        const localizedFlags = userFlags.length
            ? await Promise.all(userFlags.map(flag => client.t(interaction, flags[flag] || 'userinfo.unknownFlag')))
            : [];

        return client.embed({
            title: await client.t(interaction, 'userinfo.title'),
            desc: await client.t(interaction, 'userinfo.description', { user: member.user.username }),
            thumbnail: member.user.displayAvatarURL({ dynamic: true, size: 1024 }),
            image: member.user.bannerURL({ dynamic: true, size: 1024 }),
            fields: [
                {
                    name: await client.t(interaction, 'userinfo.username'),
                    value: `${member.user.username}`,
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'userinfo.discriminator'),
                    value: `${member.user.discriminator}`,
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'userinfo.nickname'),
                    value: `${member.nickname || await client.t(interaction, 'userinfo.noNickname')}`,
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'userinfo.id'),
                    value: `${member.user.id}`,
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'userinfo.flagsLabel'),
                    value: `${localizedFlags.length ? localizedFlags.join(', ') : await client.t(interaction, 'userinfo.noFlags')}`,
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'userinfo.badges'),
                    value: `${Badges.FLAGS ? Badges.FLAGS.map(flag => badgeFlags[flag]).join(' ') : await client.t(interaction, 'userinfo.noBadges')}`,
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'userinfo.discordJoinedAt'),
                    value: `<t:${Math.round(member.user.createdTimestamp / 1000)}>`,
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'userinfo.serverJoinedAt'),
                    value: `<t:${Math.round(member.joinedAt / 1000)}>`,
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'userinfo.roles', { count: roles.length }),
                    value: `${roles.length ? roles.join(', ') : await client.t(interaction, 'userinfo.noRoles')}`,
                    inline: false,
                }
            ],
            type: 'editreply'
        }, interaction)
    },
};


