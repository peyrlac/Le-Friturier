const Discord = require('discord.js');

const Schema = require("../../database/models/economy");
const Schema2 = require("../../database/models/economyTimeout");

module.exports = async (client, interaction, args) => {
  let user = interaction.user;
  let timeout = 604800000;
  let amount = 500;

  const dataTime = await Schema2.findOne({ Guild: interaction.guild.id, User: user.id });
    if (dataTime && dataTime.Weekly !== null && timeout - (Date.now() - dataTime.Weekly) > 0) {
      let time = (dataTime.Weekly / 1000 + timeout / 1000).toFixed(0);
      return client.errWait({
        time: time,
        type: 'editreply'
      }, interaction);
    }
    else {

      client.succNormal({
        key: 'economy.weekly.success',
        variables: { amount },
        fields: [
          {
            name: `${client.emotes.economy.coins}┆Amount`,
            value: `$${amount}`,
            inline: true
          }
        ],
        type: 'editreply'
      }, interaction);

      if (dataTime) {
        dataTime.Weekly = Date.now();
        await dataTime.save();
      }
      else {
        await new Schema2({
          Guild: interaction.guild.id,
          User: user.id,
          Weekly: Date.now()
        }).save();
      }

      await client.addMoney(interaction, user, amount);
    }
}
