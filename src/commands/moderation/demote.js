const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
  const perms = await client.checkPerms({
    flags: [Discord.PermissionsBitField.Flags.BanMembers],
    perms: [Discord.PermissionsBitField.Flags.BanMembers]
  }, interaction)

  if (perms == false) return;

  const member = await interaction.guild.members.fetch(interaction.options.getUser('user').id);

  member.roles.remove(member.roles.highest.id).then(async r => {
    client.embed({
      titleKey: 'moderationExtras.demoteTitle',
      descKey: 'moderationExtras.demoteNotice',
      variables: { guild: interaction.guild.name },
      fields: [
        {
          name: await client.t(interaction, 'moderationExtras.moderator'),
          value: interaction.user.tag,
          inline: true
        },
      ]
    }, member).catch(() => { })

    client.succNormal({
      key: 'moderationExtras.demoted', fields: [
        {
          name: await client.t(interaction, 'moderationExtras.user'),
          value: `${member}`,
          inline: true
        }
      ],
      type: 'editreply'
    }, interaction);
  }).catch(e => {
    client.errNormal({
      key: 'moderationExtras.demoteFailed',
      type: 'editreply'
    }, interaction)
  });
}

