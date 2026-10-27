
module.exports = async (client, interaction, args) => {

    const image = interaction.options.getString('image-url');
    const channel = interaction.options.getChannel('channel');

    if (!channel) return client.errNormal({ key: 'images.channelNotFound', type: 'editreply' }, interaction)

    client.succNormal({
        key: 'images.imageSent',
        variables: { channel: String(channel) },
        type: 'editreply'
    }, interaction)

    client.simpleEmbed({
        image: `${image}`
    }, channel)
}


