const Discord = require('discord.js');

const Schema = require("../../database/models/family");

module.exports = async (client, interaction, args) => {
    const target = interaction.options.getUser('membre');
    const author = interaction.user;

    if (author.id == target.id) return client.errNormal({
        error: "Tu ne peux pas t'adopter toi-même",
        type: 'editreply'
    }, interaction);

    if (target.bot) return client.errNormal({
        error: "Tu ne peux pas adopter un robot",
        type: 'editreply'
    }, interaction);

    const familyMember = await Schema.findOne({ Guild: interaction.guild.id, User: target.id, Parent: author.id });
    const familyMember2 = await Schema.findOne({ Guild: interaction.guild.id, User: author.id, Parent: target.id });
    const familyMember3 = await Schema.findOne({ Guild: interaction.guild.id, User: author.id, Partner: target.id });

    if (familyMember || familyMember2 || familyMember3) {
        return client.errNormal({
            error: `Tu ne peux pas adopter un membre de ta famille !`,
            type: 'editreply'
        }, interaction);
    }

    const checkAdopt = await Schema.findOne({ Guild: interaction.guild.id, Children: target.id });
    if (checkAdopt) {
        return client.errNormal({
            error: `Cette personne a déjà été adoptée !`,
            type: 'editreply'
        }, interaction);
    }

    const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId('adopt_yes')
                .setEmoji('✅')
                .setStyle(Discord.ButtonStyle.Success),
            new Discord.ButtonBuilder()
                .setCustomId('adopt_deny')
                .setEmoji('❌')
                .setStyle(Discord.ButtonStyle.Danger),
        );

    await client.embed({
        title: `👪・Adoption`,
        desc: `${author} a demandé d'adopter ${target} ! \n${target}, clique sur un des boutons`,
        components: [row],
        content: `${target}`,
        image: 'https://media2.giphy.com/media/y7XmH8QgILhS5tXCCk/giphy.gif',
        type: 'editreply',
    }, interaction);

    const filter = i => i.user.id === target.id;

    try {
        const component = await interaction.channel.awaitMessageComponent({
            filter,
            componentType: Discord.ComponentType.Button,
            time: 60000
        });

        if (component.customId === "adopt_yes") {
            const authorData = await Schema.findOne({ Guild: interaction.guild.id, User: author.id });
            if (authorData) {
                const children = Array.isArray(authorData.Children) ? authorData.Children : [];
                if (!children.includes(target.id)) children.push(target.id);
                authorData.Children = children;
                await authorData.save();
            }
            else {
                await new Schema({
                    Guild: interaction.guild.id,
                    User: author.id,
                    Children: [target.id]
                }).save();
            }

            const targetData = await Schema.findOne({ Guild: interaction.guild.id, User: target.id });
            if (targetData) {
                const parents = Array.isArray(targetData.Parent) ? targetData.Parent : [];
                if (!parents.includes(author.id)) parents.push(author.id);
                targetData.Parent = parents;
                await targetData.save();
            }
            else {
                await new Schema({
                    Guild: interaction.guild.id,
                    User: target.id,
                    Parent: [author.id]
                }).save();
            }

            return client.embed({
                title: `👪・Adoption acceptée`,
                desc: `${author} est maintenant l'heureux parent de ${target}! 🎉`,
                components: [],
                image: 'https://media1.giphy.com/media/xUySTUZ8A2RJBQitEc/giphy.gif',
                type: 'editreply'
            }, interaction);
        }

        return client.embed({
            title: `👪・Adoption refusée`,
            desc: `${target} ne veut pas être adopté.e par ${author}`,
            components: [],
            image: 'https://media0.giphy.com/media/ISOckXUybVfQ4/giphy.gif',
            type: 'editreply'
        }, interaction);
    }
    catch {
        return client.embed({
            title: `👪・Adoption refusée`,
            desc: `${target} n'a pas répondu ! L'adoption a été annulée`,
            components: [],
            image: 'https://media.tenor.com/-Rngjigx2HAAAAAd/alone.gif',
            type: 'editreply'
        }, interaction);
    }
};
