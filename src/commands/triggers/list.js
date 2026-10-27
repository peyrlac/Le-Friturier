const Discord = require('discord.js');

const Schema = require("../../database/models/triggers");

module.exports = async (client, interaction, args) => {
    var data = await Schema.find({ Guild: interaction.guild.id });
    if (data.length === 0) return client.errNormal({
        key: 'triggers.noData',
        type: 'editreply'
    }, interaction);
    data = data[0].Triggers;
    let list = ``;
    const labels = await Promise.all(['status', 'type', 'regex', 'regexFlags', 'response', 'emotes', 'mention', 'replied']
        .map(key => client.t(interaction, `triggers.${key}`)));
    const [status, type, regex, regexFlags, response, emotes, mention, replied] = labels;
    const typeString = await Promise.all(['typeUnknown', 'typeReply', 'typeReplyDelete', 'typeDelete', 'typeReact']
        .map(key => client.t(interaction, `triggers.${key}`)));

    for (var i = 0; i < data.length; i++) {
        list += `--------------------- \n
        **${i + 1} - ${data[i].alias}** \n
        ${status} : ${data[i].isActive} \n
        ${type} : ${typeString[data[i].type]} \n
        ${regex} : \`${data[i].regex}\` \n
        ${regexFlags} \`${data[i].regexFlags}\` \n
        ${response} : \`${data[i].response}\` \n
        ${emotes} : \`${data[i].emotes}\` \n
        ${mention} : \`${data[i].mention}\` ${replied} : \`${data[i].replied}\`
        \n`;
    }

    await client.embed({
        title: await client.t(interaction, 'triggers.listTitle'),
        desc: list,
        type: 'editreply'
    }, interaction)
}
