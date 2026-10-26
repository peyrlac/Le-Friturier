const Discord = require('discord.js');

const Schema = require("../../database/models/economy");
const Schema2 = require("../../database/models/economyTimeout");

module.exports = async (client, interaction, args) => {
  let user = interaction.user;
  let timeout = 31557600000;
  let amount = 5000;

  const dataTime = await Schema2.findOne({ Guild: interaction.guild.id, User: user.id });
    if (dataTime && dataTime.Yearly !== null && timeout - (Date.now() - dataTime.Yearly) > 0) {
      let time = (dataTime.Yearly / 1000 + timeout / 1000).toFixed(0);
      return client.errWait({
        time: time,
        type: 'editreply'
      }, interaction);
    }
    else {
      client.succNormal({
        key: 'economy.yearly.success',
        variables: { amount },
        fields: [
          {
          name: `${client.emotes.economy.coins}┆${await client.t(interaction, 'economy.earned')}`,
            value: `$${amount}`,
            inline: true
          }
        ],
        type: 'editreply'
      }, interaction);

      if (dataTime) {
        dataTime.Yearly = Date.now();
        await dataTime.save();
      }
      else {
        await new Schema2({
          Guild: interaction.guild.id,
          User: user.id,
          Yearly: Date.now()
        }).save();
      }

      await client.addMoney(interaction, user, amount);
    }
}
