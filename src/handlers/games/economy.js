const Discord = require('discord.js');

const Schema = require("../../database/models/economy");
const itemSchema = require("../../database/models/economyItems");

module.exports = async (client) => {
    client.addMoney = async function (interaction, user, amount) {
        return Schema.findOneAndUpdate(
            { Guild: interaction.guild.id, User: user.id },
            {
                $inc: { Money: amount },
                $setOnInsert: { Guild: interaction.guild.id, User: user.id, Bank: 0 }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
    }

    client.removeMoney = async function (interaction, user, amount) {
        return Schema.findOneAndUpdate(
            { Guild: interaction.guild.id, User: user.id, Money: { $gte: amount } },
            { $inc: { Money: -amount } },
            { new: true }
        );
    }

    client.buyItem = async function (interaction, user, item) {
        const data = await itemSchema.findOne({ Guild: interaction.guild.id, User: user.id });

        if (item == "FishingRod") {
            await itemSchema.findOneAndUpdate(
                { Guild: interaction.guild.id, User: user.id },
                { $set: { FishingRod: true } },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }
    }
}
