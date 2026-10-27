const Discord = require('discord.js');

const Schema = require("../../database/models/economy");
const Schema2 = require("../../database/models/economyTimeout");

module.exports = async (client, interaction, args) => {
  let user = interaction.user;
  let timeout = 2419200000;
  let amount = 1000;

  const dataTime = await Schema2.findOne({ Guild: interaction.guild.id, User: user.id });
    if (dataTime && dataTime.Monthly !== null && timeout - (Date.now() - dataTime.Monthly) > 0) {
      let time = (dataTime.Monthly / 1000 + timeout / 1000).toFixed(0);
      return client.errWait({
        time: time,
        type: 'editreply'
      }, interaction);
    }
    else {

      client.succNormal({
        key: 'economy.monthly.success',
        variables: { amount },
        fields: [
          {
          name: `${client.emotes.economy.coins}┆${await client.t(interaction, 'economy.amount')}`,
            value: `$${amount}`,
            inline: true
          }
        ],
        type: 'editreply'
      }, interaction);

      if (dataTime) {
        dataTime.Monthly = Date.now();
        await dataTime.save();
      }
      else {
        await new Schema2({
          Guild: interaction.guild.id,
          User: user.id,
          Monthly: Date.now()
        }).save();
      }

      await client.addMoney(interaction, user, amount);
    }
}
