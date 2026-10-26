const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
  const channel = interaction.options.getChannel('channel');

  client.embed({
      title: await client.t(interaction, 'guild.channelInfo.title'),
      desc: await client.t(interaction, 'guild.channelInfo.description', { channel: channel.id }),
      fields: [
          {
              name: await client.t(interaction, 'guild.channelInfo.type'),
              value: `${channel.type}`,
              inline: true,
          },
          {
              name: await client.t(interaction, 'guild.channelInfo.id'),
              value: `${channel.id}`,
              inline: true,
          },
          {
              name: await client.t(interaction, 'guild.channelInfo.type'),
              value: `${channel.type}`,
              inline: true,
          },
          {
              name: await client.t(interaction, 'guild.channelInfo.createdAt'),
              value: `${channel.createdAt}`,
              inline: true,
          },
          {
              name: await client.t(interaction, 'guild.channelInfo.topic'),
              value: `${channel.topic ? channel.topic : await client.t(interaction, 'guild.channelInfo.notAvailable')}`,
              inline: true,
          },
          {
              name: await client.t(interaction, 'guild.channelInfo.nsfw'),
              value: `${channel.nsfw}`,
              inline: true,
          },
          {
              name: await client.t(interaction, 'guild.channelInfo.parent'),
              value: `${channel.parentID ? channel.parentID : await client.t(interaction, 'guild.channelInfo.notAvailable')}`,
              inline: true,
          },
      ],
      type: 'editreply'
  }, interaction)
}

