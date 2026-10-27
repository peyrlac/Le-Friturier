const Schema = require("../../database/models/reviewChannels");

module.exports = async (client, interaction, args) => {
    const stars = interaction.options.getNumber('stars');
    const message = interaction.options.getString('message') || await client.t(interaction, 'review.notGiven');

    if (stars < 1 || stars > 5) {
        return client.errNormal({ key: 'review.starsInvalid', type: 'editreply' }, interaction);
    }

    const data = await Schema.findOne({ Guild: interaction.guild.id });
    if (!data) {
        return client.errNormal({ key: 'review.noChannel', type: 'editreply' }, interaction);
    }

    const channel = interaction.guild.channels.cache.get(data.Channel);
    if (!channel) {
        return client.errNormal({ key: 'review.noChannel', type: 'editreply' }, interaction);
    }

    const totalStars = ':star:'.repeat(stars);
    await client.succNormal({ key: 'review.submitted', type: 'editreply' }, interaction);

    return client.embed({
        title: await client.t(interaction, 'review.title', { user: interaction.user.tag }),
        descKey: 'review.newReview',
        fields: [
            { name: await client.t(interaction, 'review.stars'), value: totalStars, inline: true },
            { name: await client.t(interaction, 'review.note'), value: message, inline: true }
        ]
    }, channel);
};
