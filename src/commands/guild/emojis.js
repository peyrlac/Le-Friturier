const Discord = require('discord.js');
const model = require('../../database/models/badge');

module.exports = async (client, interaction, args) => {
  let Emojis = "";
  let EmojisAnimated = "";
  let EmojiCount = 0;
  let Animated = 0;
  let OverallEmojis = 0;

  function Emoji(id) {
    return client.emojis.cache.get(id).toString();
  }

  interaction.guild.emojis.cache.forEach((emoji) => {
    OverallEmojis++;
    if (emoji.animated) {
      Animated++;
      EmojisAnimated += Emoji(emoji.id);
    } else {
      EmojiCount++;
      Emojis += Emoji(emoji.id);
    }
  });

  client.embed({
    title: await client.t(interaction, 'guild.emojis.title'),
    desc: await client.t(interaction, 'guild.emojis.description', { count: OverallEmojis, guild: interaction.guild.name }),
    fields: [
      {
        name: await client.t(interaction, 'guild.emojis.animated', { count: Animated }),
        value: EmojisAnimated.substr(0, 1021) + "...",
        inline: false,
      },
      {
        name: await client.t(interaction, 'guild.emojis.standard', { count: EmojiCount }),
        value: Emojis.substr(0, 1021) + "...",
        inline: false,
      },
    ],
    type: 'editreply'
  }, interaction)
}


