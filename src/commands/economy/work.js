const Discord = require('discord.js');

const Schema = require("../../database/models/economy");
const Schema2 = require("../../database/models/economyTimeout");

module.exports = async (client, interaction, args) => {
  let user = interaction.user;
  let timeout = 600000;

  const dataTime = await Schema2.findOne({ Guild: interaction.guild.id, User: user.id });
    if (dataTime && dataTime.Work !== null && timeout - (Date.now() - dataTime.Work) > 0) {
      let time = (dataTime.Work / 1000 + timeout / 1000).toFixed(0);
      return client.errWait({
        time: time,
        type: 'editreply'
      }, interaction);
    }
    else {
      let replies = ['Programmer', 'Hacker', 'Waiter', 'Busboy', 'Chief', 'Mechanic']

      let result = Math.floor((Math.random() * replies.length));
      let amount = Math.floor(Math.random() * 100) + 1;

      client.succNormal({
        key: 'economy.work.success',
        variables: { job: replies[result], amount },
        fields: [
          {
            name: `🦹‍♂️┆${await client.t(interaction, 'economy.job')}`,
            value: `${replies[result]}`,
            inline: true
          },
          {
            name: `${client.emotes.economy.coins}┆${await client.t(interaction, 'economy.earned')}`,
            value: `$${amount}`,
            inline: true
          }
        ],
        type: 'editreply'
      }, interaction);

      if (dataTime) {
        dataTime.Work = Date.now();
        await dataTime.save();
      }
      else {
        await new Schema2({
          Guild: interaction.guild.id,
          User: user.id,
          Work: Date.now()
        }).save();
      }

      await client.addMoney(interaction, user, amount);
    }
}
