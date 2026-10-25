const Schema = require('../../database/models/profile');
const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {

    const data = await Schema.findOne({ User: interaction.user.id });
    if (data) {
            const [male, female, other] = await Promise.all([
                client.t(interaction, 'profile.genderMale'),
                client.t(interaction, 'profile.genderFemale'),
                client.t(interaction, 'profile.genderOther'),
            ]);
            const menu = new Discord.StringSelectMenuBuilder()
                .setCustomId('gender-setup')
                .setPlaceholder('❌┆Nothing selected')
                .addOptions(
                    {
                        emoji: "👨",
                        label: male,
                        value: `Male`,
                    },
                    {
                        emoji: "👩",
                        label: female,
                        value: `Female`,
                    },
                    {
                        emoji: "👪",
                        label: other,
                        value: `Other`,
                    }
                );

            const row = new Discord.ActionRowBuilder()
                .addComponents(menu)

            await client.embed({
                descKey: 'profile.genderPrompt',
                type: 'editreply',
                components: [row],
            }, interaction);

            const filter = i => i.user.id === interaction.user.id;
            const i = await interaction.channel.awaitMessageComponent({ filter, max: 1, componentType: Discord.ComponentType.StringSelect });
            if (i.customId == 'gender-setup') {
                        data.Gender = i.values[0];
                        await data.save();

                        client.succNormal({
                            key: 'profile.genderSuccess',
                            variables: { gender: i.values[0] },
                            type: 'editreply',
                            components: [],
                        }, interaction);
            }
    } else {
        return client.errNormal({ key: 'profile.notFound', type: 'editreply' }, interaction);
    }
}
