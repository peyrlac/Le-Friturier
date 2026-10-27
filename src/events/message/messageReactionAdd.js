const Discord = require("discord.js");

const StarBoard = require("../../database/models/starboardChannels");

module.exports = async (client, reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch().catch(() => { });
  if (reaction.partial) await reaction.fetch().catch(() => { });

  if (reaction.emoji.name === "⭐") {
	const data = await StarBoard.findOne({ Guild: reaction.message.guild.id });
    if (!data) return;
      
    if (reaction.message.author.id === user.id)
      return client.errNormal({
        key: 'starboard.cannotStarOwn',
        variables: { message: reaction.message.cleanContent },
      }, client.users.cache.get(user.id));

    if (reaction.message.author.bot) return client.errNormal({
      key: 'starboard.cannotStarBot',
      variables: { message: reaction.message.cleanContent },
    }, client.users.cache.get(user.id));

    const starboardChannel = reaction.message.guild.channels.cache.get(data.Channel);
    if (!starboardChannel) return client.errNormal({
      key: 'starboard.noChannel',
    }, client.users.cache.get(user.id));

    const fetch = await starboardChannel.messages.fetch({ limit: 100 });
    const stars = fetch.find(m =>
      m.embeds[0] &&
      m.embeds[0].footer &&
      m.embeds[0].footer.text.endsWith(reaction.message.id)
    );

    if (stars) {
      const foundStar = stars.embeds[0];
      const image = reaction.message.attachments.size > 0 ? await extension(reaction, reaction.message.attachments.first()?.url) : "";
      const starMsg = await starboardChannel.messages.fetch(stars.id);
      client.embed({
        title: await client.t(reaction.message, 'starboard.title'),
        desc: foundStar.description,
        image: image,
        fields: [
          {
            name: await client.t(reaction.message, 'starboard.stars'),
            value: `${reaction.count}`,
            inline: true
          },
          {
            name: await client.t(reaction.message, 'starboard.message'),
            value: await client.t(reaction.message, 'starboard.jump', { url: reaction.message.url }),
            inline: true
          },
          {
            name: await client.t(reaction.message, 'starboard.author'),
            value: `${reaction.message.author} (${reaction.message.author.tag})`,
            inline: true
          }
        ],
        footer: `${client.config.discord.footer} | ${reaction.message.id}`,
        type: 'edit'
      }, starMsg)
    }
    if (!stars) {
      const image = reaction.message.attachments.size > 0 ? await extension(reaction, reaction.message.attachments.first()?.url) : "";
      if (image === "" && reaction.message.cleanContent.length < 1) return client.errNormal({
        key: 'starboard.emptyMessage',
        type: 'ephemeral'
      }, reaction.message);

      client.embed({
        title: await client.t(reaction.message, 'starboard.title'),
        desc: reaction.message.cleanContent,
        image: image,
        fields: [
          {
            name: await client.t(reaction.message, 'starboard.stars'),
            value: `${reaction.count}`,
            inline: true
          },
          {
            name: await client.t(reaction.message, 'starboard.message'),
            value: await client.t(reaction.message, 'starboard.jump', { url: reaction.message.url }),
            inline: true
          },
          {
            name: await client.t(reaction.message, 'starboard.author'),
            value: `${reaction.message.author} (${reaction.message.author.tag})`,
            inline: true
          }
        ],
        footer: `${client.config.discord.footer} | ${reaction.message.id}`
      }, starboardChannel)
    }
  }
};

function extension(reaction, attachment) {
  const imageLink = attachment.split(".");
  const typeOfImage = imageLink[imageLink.length - 1];
  const image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage);
  if (!image) return "";
  return attachment;
}

 
