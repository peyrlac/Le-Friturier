module.exports = async (client, interaction) => {
    const list = await client.t(interaction, 'triggers.documentation');

    await client.embed({
        title: await client.t(interaction, 'triggers.documentationTitle'),
        desc: list,
        type: 'editreply'
    }, interaction);
};
