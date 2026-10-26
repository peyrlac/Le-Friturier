const Discord = require('discord.js');
const translate = require('@iamtraction/google-translate');

module.exports = async (client, interaction, args) => {

    const language = interaction.options.getString('language');
    const text = interaction.options.getString('text');

    translate(text, { to: language }).then(async res => {
        client.embed({
            title: `${client.emotes.normal.check}・${await client.t(interaction, 'search.translateSuccess')}`,
            desc: await client.t(interaction, 'search.translateDescription'),
            fields: [
                {
                    name: await client.t(interaction, 'search.translateInput'),
                    value: `${text}`,
                    inline: false,
                },
                {
                    name: await client.t(interaction, 'search.translateOutput'),
                    value: `${res.text}`,
                    inline: false,
                },
            ],
            type: 'editreply'
        }, interaction);

    }).catch(err => {
        console.log(err)
        client.errNormal({
            key: 'search.invalidLanguage',
            type: 'editreply'
        }, interaction);
    })
}


