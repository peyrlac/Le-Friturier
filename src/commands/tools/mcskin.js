const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {

    const name = interaction.options.getString('name');

    if (name == null) return client.errUsage({ usage: await client.t(interaction, 'tools.mcskinUsage'), type: 'editreply' }, interaction)

    client.embed({
        title: await client.t(interaction, 'tools.mcskinTitle', { name }),
        image: `https://minotar.net/armor/body/${name}/700.png`,
        type: 'editreply'
    }, interaction)

}

