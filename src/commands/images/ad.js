const Discord = require('discord.js');
const pop = require("popcat-wrapper");

module.exports = async (client, interaction, args) => {

    const member = interaction.options.getUser('user');

    const userAvatar = member.displayAvatarURL({ dynamic: false, size: 1024, extension: 'png' });

    const image = await pop.ad(userAvatar);
    let attach = new Discord.AttachmentBuilder(image, { name: "ad.png" });

    const embed = client.templateEmbed()
        .setTitle(await client.t(interaction, 'images.adTitle'))
        .setImage("attachment://ad.png");
    interaction.editReply({ files: [attach], embeds: [embed] });
}
