const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {

    const code = interaction.options.getString('code');

    if (isNaN(parseInt(code))) return client.errNormal({
        key: 'tools.decodeInvalid',
        type: 'editreply'
    }, interaction);

    let decode = code.split(' ')
        .map(bin => String.fromCharCode(parseInt(bin, 2)))
        .join('');

    client.embed({
        titleKey: 'common.successTitle',
        descKey: 'tools.decodeDescription',
        fields: [
            {
                name: `${await client.t(interaction, 'tools.input')}`,
                value: `\`\`\`${code}\`\`\``,
                inline: false,
            },
            {
                name: `${await client.t(interaction, 'tools.output')}`,
                value: `\`\`\`${decode}\`\`\``,
                inline: false,
            },
        ],
        type: 'editreply'
    }, interaction)

}

