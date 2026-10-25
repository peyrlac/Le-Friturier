const Discord = require('discord.js');
const figlet = require('figlet');

module.exports = async (client, interaction, args) => {
    const msg = interaction.options.getString('text');

    if (msg.length > 2000) return client.errNormal({ key: 'fun.asciiTooLong', type: 'editreply' }, interaction);

    figlet.text(msg, function (err, data) {

        if (err) {
            return client.errNormal({ key: 'errors.generic', type: 'editreply' }, interaction);
        }

        client.embed({
            titleKey: 'fun.asciiTitle',
            desc: `\`\`\` ${data} \`\`\``,
            type: 'editreply',
        }, interaction);
    })
}


