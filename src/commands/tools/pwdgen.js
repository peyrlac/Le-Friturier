const Discord = require('discord.js');
const generator = require('generate-password');

module.exports = async (client, interaction, args) => {

    const password = generator.generate({
        length: 12,
        symbols: true,
        numbers: true
    });

    client.succNormal({ key: 'tools.passwordSent', type: 'editreply' }, interaction);

    client.succNormal({
        key: 'tools.generatedPassword',
        fields: [
            {
                name: await client.t(interaction, 'tools.password'),
                value: `${password}`,
                inline: true,
            },
            {
                name: await client.t(interaction, 'tools.length'),
                value: `12`,
                inline: true,
            }
        ]
    }, interaction.user)

}
