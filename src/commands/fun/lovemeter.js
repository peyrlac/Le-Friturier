
module.exports = async (client, interaction, args) => {

    const user1 = interaction.options.getUser('user1');
    const user2 = interaction.options.getUser('user2');

    if (!user1 || !user2) return client.errUsage({ usage: "lovemeter [user1]", type: 'editreply' }, interaction);

    if (user1 == user2) return client.errNormal({ key: 'fun.loveSameUser', type: 'editreply' }, interaction);

    var result = Math.ceil(Math.random() * 100);

    client.embed({
        titleKey: 'fun.loveTitle',
        descKey: 'fun.loveDescription',
        variables: { user1: String(user1), user2: String(user2), result },
        fields: [
            {
                name: await client.t(interaction, 'fun.loveNameOne'),
                value: `${user1}`,
                inline: true,
            },
            {
                name: await client.t(interaction, 'fun.loveNameTwo'),
                value: `${user2}`,
                inline: true,
            },
            {
                name: await client.t(interaction, 'fun.loveResult'),
                value: await client.t(interaction, 'fun.loveMatch', { user1: String(user1), user2: String(user2), result }),
                inline: false,
            },
        ],
        type: 'editreply'
    }, interaction)
}


