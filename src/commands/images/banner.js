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
        titleKey: 'images.bannerTitle',
        image: url,
        type: 'editreply'
      }, interaction)
    }
    else {
      if (accent_color) {

        client.embed({
        titleKey: 'images.bannerTitle',
          descKey: 'images.bannerNoBanner',
          variables: { user: String(user) },
          color: accent_color,
          type: 'editreply'
        }, interaction)
      }
      else {
        client.embed({
        titleKey: 'images.bannerTitle',
          descKey: 'images.bannerNoBannerNoAccent',
          variables: { user: String(user) },
          color: accent_color,
          type: 'editreply'
        }, interaction)
      }
    }
  } catch {
    return client.errNormal({ key: 'images.bannerError', type: 'editreply' }, interaction);
  }
}


