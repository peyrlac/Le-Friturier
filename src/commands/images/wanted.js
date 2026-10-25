const Discord = require('discord.js');
module.exports = async (client, interaction, args) => {
    const DIG = require("discord-image-generation");
    const user = interaction.options.getUser('user') || interaction.user;

    let userAvatar = user.displayAvatarURL({ size: 1024, dynamic: false, extension: 'png' });
    let img = await new DIG.Wanted().getImage(userAvatar, `€`);
    let attach = new Discord.AttachmentBuilder(img, { name: "wanted.png" });
    const embed = client.templateEmbed().setImage("attachment://wanted.png");
    interaction.editReply({ files: [attach], embeds: [embed] });
}

