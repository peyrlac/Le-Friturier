const { getJson } = require('../../handlers/http');
const Discord = require('discord.js');
module.exports = async (client, interaction, args) => {

    return getJson(`https://www.reddit.com/r/memes` + `.json?sort=top&t=week&limit=100`).then(async (json) => {
        let i = Math.floor(Math.random() * json.data.children.length)
        let image = json.data.children[i].data.url
        let caption = json.data.children[i].data.title
        let embed = new Discord.EmbedBuilder()
            .setTitle(caption)
            .setImage(image)
            .setColor(client.config.colors.normal)
            .setFooter({ text: `👍 ${json.data.children[i].data.ups} | 💬 ${json.data.children[i].data.num_comments}` })
        interaction.editReply({ embeds: [embed] })
    }).catch(() => client.errNormal({ error: 'Unable to retrieve remote data.', type: 'editreply' }, interaction))
}
