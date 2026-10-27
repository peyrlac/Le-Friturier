const Discord = require('discord.js');

const TempSchema = require("../../database/models/tempban");

module.exports = async (client, interaction, args) => {
  const perms = await client.checkPerms({
    flags: [Discord.PermissionsBitField.Flags.BanMembers],
    perms: [Discord.PermissionsBitField.Flags.BanMembers]
  }, interaction)

  if (perms == false) return;

  const member = await interaction.guild.members.fetch(interaction.options.getUser('user').id);
  const reason = interaction.options.getString('reason') || 'Not given';

  if (member.permissions.has(Discord.PermissionsBitField.Flags.BanMembers) || member.permissions.has(Discord.PermissionsBitField.Flags.BanMembers)) return client.errNormal({
    key: "errors.moderation.cannotModerate",
    type: 'editreply'
  }, interaction);

  client.embed({
    title: `🔨・Ban`,
    desc: `You've been banned in **${interaction.guild.name}**`,
    fields: [
      {
        name: "👤┆Banned by",
        value: interaction.user.tag,
        inline: true
      },
      {
        name: "💬┆Reason",
        value: reason,
        inline: true
      }
    ]
  }, member).then(async function () {
    member.ban({ reason: reason })
    client.succNormal({
      key: 'errors.moderation.banNotified',
      fields: [
        {
          name: "👤┆Banned user",
          value: member.user.tag,
          inline: true
        },
        {
          name: "💬┆Reason",
          value: reason,
          inline: true
        }
      ],
      type: 'editreply'
    }, interaction);

    const expires = new Date()
    expires.setMinutes(expires.getMinutes() + parseInt(interaction.options.getNumber('time')))

    await new TempSchema({
      guildId: interaction.guild.id,
      userId: member.id,
      expires,
    }).save();

  }).catch(async function () {
    member.ban({ reason: reason })
    client.succNormal({
      key: 'errors.moderation.banNotNotified',
      type: 'editreply'
    }, interaction);

    const expires = new Date()
    expires.setMinutes(expires.getMinutes() + parseInt(interaction.options.getNumber('time')))

    await new TempSchema({
      guildId: interaction.guild.id,
      userId: member.id,
      expires,
    }).save();
  });
}

 
