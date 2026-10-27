module.exports = async (client, interaction, args) => {

    let link = `https://some-random-api.com/canvas/wasted/?avatar=${interaction.user.avatarURL({ size: 1024, extension: 'png' })}`

    client.embed({
        titleKey: 'images.generatedImageTitle',
        image: link,
        type: 'editreply'
    }, interaction)
}


