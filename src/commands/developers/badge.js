const Discord = require('discord.js');

const model = require('../../database/models/badge');

const webhookClientLogs = new Discord.WebhookClient({
    id: "",
    token: "",
});

module.exports = async (client, interaction, args) => {
    const badgeFlags = {
        DEVELOPER: client.emotes.badges.developer,
        EVENT: client.emotes.badges.event,
        BOOSTER: client.emotes.badges.booster,
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
        MARKETING: client.emotes.badges.marketing,
        ACTIVE: client.emotes.badges.active,
        VIP: client.emotes.badges.vip
    }

    const boolean = interaction.options.getBoolean('new');
    const member = interaction.options.getUser('user');
    const badge = interaction.options.getString('badge');

    let Badges = await model.findOne({ User: member.id });

    if (!badgeFlags[badge.toUpperCase()]) return client.errNormal({
        key: 'developers.badgeNotFound',
        type: `editreply`
    }, interaction);

    if (boolean == true) {
        if (Badges) {
            if (Badges.FLAGS.includes(badge.toUpperCase())) return client.errNormal({
                key: 'developers.badgeAlreadyAssigned',
                type: `editreply`
            }, interaction);

            let FLAG = badge.toUpperCase();
            let array = Badges.FLAGS;

            array.push(FLAG);

            await model.findOneAndUpdate(
                { User: member.id },
                { $set: { FLAGS: array } },
                { new: true }
            );

            await client.succNormal({
                key: 'developers.badgeAdded',
                variables: { badge: badgeFlags[badge.toUpperCase()], flag: badge.toUpperCase() },
                type: `editreply`
            }, interaction);
        } else {
            const newSettings = new model({ User: member.id, FLAGS: [badge.toUpperCase()] });
            await newSettings.save();

            await client.succNormal({
                key: 'developers.badgeAdded',
                variables: { badge: badgeFlags[badge.toUpperCase()], flag: badge.toUpperCase() },
                type: `editreply`
            }, interaction)
        }

        let embedLogs = new Discord.EmbedBuilder()
            .setTitle(`📛・Badge added`)
            .setDescription(`Added a new badge to ${member} (${member.id})`)
            .addFields(
                { name: "👤┆Added By", value: `${interaction.user} (${interaction.user.tag})`, inline: true },
                { name: `📛┆Badge`, value: `${badgeFlags[badge.toUpperCase()]} (${badge.toUpperCase()})`, inline: true },
            )
            .setColor(client.config.colors.normal)
            .setFooter({ text: client.config.discord.footer})
            .setTimestamp();
        webhookClientLogs.send({
            username: 'Badges bot',
            embeds: [embedLogs],
        });
    }
    else if (boolean == false) {
        if (!Badges) return client.errNormal({
            key: 'developers.badgeMissing',
            type: `editreply`
        }, interaction);

        if (!Badges.FLAGS.includes(badge.toUpperCase())) return client.errNormal({
            key: 'developers.badgeMissing',
            type: `editreply`
        }, interaction);

        let FLAG = badge.toUpperCase();
        let array = Badges.FLAGS;

        for (var i = 0; i < array.length; i++) {

            if (array[i] === FLAG) {
                array.splice(i, 1);
                i--;
            }
        }

        if (!array[0]) {
            let deleted = await model.deleteMany({ User: member.id });
            await client.succNormal({
                key: 'developers.badgeRemovedLast',
                variables: { badge: badgeFlags[badge.toUpperCase()], flag: badge.toUpperCase() },
                type: 'editreply'
            }, interaction);

        } else {
            await model.findOneAndUpdate(
                { User: member.id },
                { $set: { FLAGS: array } },
                { new: true }
            );
            await client.succNormal({
                key: 'developers.badgeRemoved',
                variables: { badge: badgeFlags[badge.toUpperCase()], flag: badge.toUpperCase() },
                type: 'editreply'
            }, interaction);
        }

        let embedLogs = new Discord.EmbedBuilder()
            .setTitle(`📛・Badge removed`)
            .setDescription(`Removed a badge from ${member} (${member.id})`)
            .addFields(
                { name: "👤┆Removed By", value: `${interaction.user} (${interaction.user.tag})`, inline: true },
                { name: `📛┆Badge`, value: `${badgeFlags[badge.toUpperCase()]} (${badge.toUpperCase()})`, inline: true },
            )
            .setColor(client.config.colors.normal)
            .setFooter({ text: client.config.discord.footer })
            .setTimestamp();
        webhookClientLogs.send({
            username: 'Badges bot',
            embeds: [embedLogs],
        });
    }
}


