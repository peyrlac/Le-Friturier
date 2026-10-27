const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
  const perms = await client.checkPerms({
    flags: [Discord.PermissionsBitField.Flags.BanMembers],
    perms: [Discord.PermissionsBitField.Flags.BanMembers]
  }, interaction)

  if (perms == false) return;

  interaction.guild.bans.fetch().then(async banned => {
    const list = await Promise.all(banned.map(async banUser => `${banUser.user.tag}・**${await client.t(interaction, 'moderationExtras.reason')} :** ${banUser.reason || await client.t(interaction, 'moderationExtras.noReason')}`));

    if (list.length == 0) return client.errNormal({
      key: 'moderationExtras.emptyBanlist',
      type: 'editreply'
    }, interaction)

    const title = await client.t(interaction, 'moderationExtras.banlistTitle', { guild: interaction.guild.name });
    await client.createLeaderboard(title, list, interaction);
  }).catch(error => {
    console.log(error)
  })
}

