const Discord = require('discord.js');
const Schema = require("../../database/models/customCommandAdvanced");

module.exports = async (client, interaction, args) => {
    const name = interaction.options.getString('command').toLowerCase();
    const response = interaction.options.getString('text');
    const existing = await Schema.findOne({ Guild: interaction.guild.id, Name: name });
    if (existing) {
        return client.errNormal({ key: 'customCommands.duplicate', type: 'editreply' }, interaction);
    }

    const row = new Discord.ActionRowBuilder().addComponents(
        new Discord.StringSelectMenuBuilder()
            .setCustomId('customSelect')
            .setPlaceholder('❌・Rien de sélectionné')
            .addOptions([
                { label: 'Embed', description: 'Envoyer un message dans un embed', value: 'command-embed' },
                { label: 'Normal', description: 'Envoyer un message comme d’habitude', value: 'command-normal' },
                { label: 'Privée', description: 'Envoyer le message en DM', value: 'command-dm' }
            ])
    );

    await client.embed({ descKey: 'customCommands.promptAction', components: [row], type: 'editreply' }, interaction);
    const selected = await interaction.channel.awaitMessageComponent({
        filter: i => i.user.id === interaction.user.id,
        componentType: Discord.ComponentType.StringSelect,
        time: 60000
    });
    await selected.deferUpdate();

    const actions = {
        'command-embed': 'Embed',
        'command-normal': 'Normal',
        'command-dm': 'DM'
    };
    const action = actions[selected.values[0]];
    if (!action) return;

    await new Schema({ Guild: interaction.guild.id, Name: name, Responce: response, Action: action }).save();
    await interaction.guild.commands.create({ name, description: 'Commande de serveur personnalisée' });

    return client.succNormal({
        key: 'customCommands.added',
        fields: [{ name: '🔧・Commande', value: `\`\`\`${name}\`\`\``, inline: true }],
        components: [],
        type: 'editreply'
    }, selected);
};
