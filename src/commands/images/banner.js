const { getJson } = require('../../handlers/http');

module.exports = async (client, interaction, args) => {
  const user = interaction.options.getUser('user') || interaction.user;

  try {
    const { banner, accent_color } = await getJson(`https://discord.com/api/users/${user.id}`, {
      headers: { Authorization: `Bot ${client.token}` },
    });

    if (banner) {
      const extension = banner.startsWith("a_") ? ".gif" : ".png";
      const url = `https://cdn.discordapp.com/banners/${user.id}/${banner}${extension}?size=1024`;

      client.embed({
        title: `🖼・User Banner`,
        image: url,
        type: 'editreply'
      }, interaction)
    }
    else {
      if (accent_color) {

        client.embed({
          title: `🖼・User Banner`,
          desc: `${user} doesn't have a banner but they do have a accent color`,
          color: accent_color,
          type: 'editreply'
        }, interaction)
      }
      else {
        client.embed({
          title: `🖼・User Banner`,
          desc: `${user} doesn't have a banner but they do have a accent color`,
          color: accent_color,
          type: 'editreply'
        }, interaction)
      }
    }
  } catch {
    return client.errNormal({ error: 'Unable to retrieve this user banner.', type: 'editreply' }, interaction);
  }
}

 
