const Discord = require('discord.js');

const Schema = require("../../database/models/family");

module.exports = async (client, interaction, args) => {
    const target = interaction.options.getUser('membre');
    const author = interaction.user;

    if (author.id == target.id) {
        return client.errNormal({ error: "Tu ne peux pas te marier toi-même !", type: 'editreply' }, interaction);
    }

    const [authorPartner, targetPartner, targetIsChild, authorIsChild, authorData] = await Promise.all([
        Schema.findOne({ Guild: interaction.guild.id, Partner: author.id }),
        Schema.findOne({ Guild: interaction.guild.id, Partner: target.id }),
        Schema.findOne({ Guild: interaction.guild.id, User: target.id, Parent: author.id }),
        Schema.findOne({ Guild: interaction.guild.id, User: author.id, Parent: target.id }),
        Schema.findOne({ Guild: interaction.guild.id, User: author.id })
    ]);

    if (authorPartner || targetPartner) {
        return client.errNormal({ error: "Quelqu'un dans le couple est déjà marié.e !", type: 'editreply' }, interaction);
    }

    if (targetIsChild || authorIsChild || (authorData && Array.isArray(authorData.Children) && authorData.Children.includes(target.id))) {
        return client.errNormal({ error: "Tu ne peux pas te marier avec un membre de ta famille !", type: 'editreply' }, interaction);
    }

    const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId('propose_accept')
                .setEmoji('✅')
                .setStyle(Discord.ButtonStyle.Success),
            new Discord.ButtonBuilder()
                .setCustomId('propose_deny')
                .setEmoji('❌')
                .setStyle(Discord.ButtonStyle.Danger),
        );

    await client.embed({
        title: '👰・Demande en mariage',
        desc: `${author} a demandé en mariage ${target} ! \n${target}, clique sur un des boutons`,
        components: [row],
        content: `${target}`,
        image: 'https://media3.giphy.com/media/RjOtCFEUwmUiAavxOH/giphy.gif',
        type: 'editreply'
    }, interaction);

    const filter = i => i.user.id === target.id;

    try {
        const component = await interaction.channel.awaitMessageComponent({
            filter,
            componentType: Discord.ComponentType.Button,
            time: 60000
        });

        if (component.customId === "propose_accept") {
            await Promise.all([
                Schema.findOneAndUpdate(
                    { Guild: interaction.guild.id, User: author.id },
                    { $set: { Partner: target.id } },
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                ),
                Schema.findOneAndUpdate(
                    { Guild: interaction.guild.id, User: target.id },
                    { $set: { Partner: author.id } },
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                )
            ]);

            return client.embed({
                title: '👰・Demande en mariage acceptée',
                desc: `${author} et ${target} sont maintenant marié.es ! 👰🎉`,
                components: [],
                content: `${target}`,
                image: 'https://media4.giphy.com/media/10wwy1cJ8j2aD6/giphy.gif',
                type: 'editreply'
            }, interaction);
        }

        return client.embed({
            title: '👰・Demande en mariage refusée',
            desc: `${target} aime quelqu'un d'autre ou préfère rester seul.e et a décidé.e de ne pas se marier avec ${author}`,
            components: [],
            content: `${target}`,
            image: 'https://media4.giphy.com/media/3ohs7SYIm3yiUbL0yc/giphy.gif',
            type: 'editreply'
        }, interaction);
    }
    catch {
        return client.embed({
            title: '👰・Demande en marriage refusée',
            desc: `${target} n'a pas répondu ! Le mariage est annulé`,
            components: [],
            content: `${target}`,
            image: 'https://media3.giphy.com/media/FKcC27kUBByAo/giphy.gif',
            type: 'editreply'
        }, interaction);
    }
};
