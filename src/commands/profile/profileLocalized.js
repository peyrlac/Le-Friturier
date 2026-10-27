const badgeModel = require('../../database/models/badge');
const Profile = require('../../database/models/profile');
const Credits = require('../../database/models/votecredits');

const valueOr = (value, fallback) => value || fallback;
const listOr = (value, fallback) => Array.isArray(value) && value.length ? value.join(', ') : fallback;

module.exports = async (client, interaction) => {
    const badgeFlags = {
        DEVELOPER: client.emotes.badges.developer,
        EVENT: client.emotes.badges.event,
        BOOSTER: client.emotes.badges.booster,
        BUGS: client.emotes.badges.bug,
        MANAGEMENT: client.emotes.badges.management,
        PREMIUM: client.emotes.badges.premium,
        SUPPORTER: client.emotes.badges.supporter,
        TEAM: client.emotes.badges.team,
        PARTNER: client.emotes.badges.partner,
        VOTER: client.emotes.badges.voter,
        SUPPORT: client.emotes.badges.support,
        MODERATOR: client.emotes.badges.moderator,
        DESIGNER: client.emotes.badges.designer,
        MARKETING: client.emotes.badges.marketing,
        ACTIVE: client.emotes.badges.active,
        VIP: client.emotes.badges.vip
    };
    const discordFlags = {
        ActiveDeveloper: 'Active Developer',
        BugHunterLevel1: 'Discord Bug Hunter',
        BugHunterLevel2: 'Discord Bug Hunter',
        CertifiedModerator: 'Certified Moderator',
        HypeSquadOnlineHouse1: 'House Bravery Member',
        HypeSquadOnlineHouse2: 'House Brilliance Member',
        HypeSquadOnlineHouse3: 'House Balance Member',
        HypeSquadEvents: 'HypeSquad Events',
        PremiumEarlySupporter: 'Early Supporter',
        Partner: 'Partner',
        Quarantined: 'Quarantined',
        Spammer: 'Spammer',
        Staff: 'Discord Staff',
        TeamPseudoUser: 'Discord Team',
        VerifiedBot: 'Verified Bot',
        VerifiedDeveloper: '(early) Verified Bot Developer'
    };

    const user = interaction.options.getUser('user') || interaction.user;
    const data = await Profile.findOne({ User: user.id });
    if (!data) return client.errNormal({ key: 'profile.notFound', type: 'editreply' }, interaction);

    const [badges, creditData, notSet, fieldNames] = await Promise.all([
        badgeModel.findOne({ User: user.id }),
        Credits.findOne({ User: user.id }),
        client.t(interaction, 'profile.notSet'),
        Promise.all([
            'user', 'discriminator', 'id', 'gender', 'age', 'birthday', 'color',
            'pets', 'food', 'songs', 'artists', 'movies', 'actors', 'origin',
            'hobbies', 'status', 'botBadges', 'discordBadges', 'credits', 'aboutMe'
        ].map(name => client.t(interaction, 'profile.fields.' + name)))
    ]);

    const credits = badges && Array.isArray(badges.FLAGS) && badges.FLAGS.includes('DEVELOPER')
        ? '∞'
        : creditData ? creditData.Credits : notSet;
    const userFlags = user.flags ? user.flags.toArray() : [];
    const botBadges = badges && Array.isArray(badges.FLAGS)
        ? badges.FLAGS.map(flag => badgeFlags[flag] || flag).join(' ')
        : notSet;
    const discordBadges = userFlags.length
        ? userFlags.map(flag => discordFlags[flag] || flag).join(', ')
        : notSet;
    const [userLabel, discriminatorLabel, idLabel, genderLabel, ageLabel, birthdayLabel,
        colorLabel, petsLabel, foodLabel, songsLabel, artistsLabel, moviesLabel,
        actorsLabel, originLabel, hobbiesLabel, statusLabel, botBadgesLabel,
        discordBadgesLabel, creditsLabel, aboutMeLabel] = fieldNames;

    return client.embed({
        titleKey: 'profile.title',
        variables: { user: client.user.username },
        desc: '_____',
        thumbnail: user.avatarURL({ dynamic: true }),
        fields: [
            { name: userLabel, value: user.username, inline: true },
            { name: discriminatorLabel, value: user.discriminator, inline: true },
            { name: idLabel, value: user.id, inline: true },
            { name: genderLabel, value: valueOr(data.Gender, notSet), inline: true },
            { name: ageLabel, value: valueOr(data.Age, notSet), inline: true },
            { name: birthdayLabel, value: valueOr(data.Birthday, notSet), inline: true },
            { name: colorLabel, value: valueOr(data.Color, notSet), inline: true },
            { name: petsLabel, value: listOr(data.Pets, notSet), inline: true },
            { name: foodLabel, value: listOr(data.Food, notSet), inline: true },
            { name: songsLabel, value: listOr(data.Songs, notSet), inline: true },
            { name: artistsLabel, value: listOr(data.Artists, notSet), inline: true },
            { name: moviesLabel, value: listOr(data.Movies, notSet), inline: true },
            { name: actorsLabel, value: listOr(data.Actors, notSet), inline: true },
            { name: originLabel, value: valueOr(data.Orgin, notSet), inline: true },
            { name: hobbiesLabel, value: listOr(data.Hobbys, notSet), inline: true },
            { name: statusLabel, value: valueOr(data.Status, notSet), inline: true },
            { name: botBadgesLabel, value: botBadges, inline: true },
            { name: discordBadgesLabel, value: discordBadges, inline: true },
            { name: creditsLabel, value: String(credits), inline: true },
            { name: aboutMeLabel, value: valueOr(data.Aboutme, notSet), inline: false }
        ],
        type: 'editreply'
    }, interaction);
};
