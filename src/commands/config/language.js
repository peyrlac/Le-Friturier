const Discord = require('discord.js');

const Schema = require('../../database/models/functions');
const { SUPPORTED_LOCALES } = require('../../handlers/i18n');

module.exports = async (client, interaction) => {
    const perms = await client.checkUserPerms({
        flags: [Discord.PermissionsBitField.Flags.ManageGuild],
        perms: [Discord.PermissionsBitField.Flags.ManageGuild],
    }, interaction);

    if (perms === false) return;

    const language = interaction.options.getString('language', true);
    if (!SUPPORTED_LOCALES.includes(language)) {
        return client.errNormal({
            error: 'Unsupported language.',
            type: 'editreply',
        }, interaction);
    }

    await Schema.findOneAndUpdate(
        { Guild: interaction.guild.id },
        { $set: { Language: language } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const languageName = language === 'fr' ? 'Français' : 'English';
    return client.succNormal({
        text: await client.t(interaction, 'commands.config.language.success', { language: languageName }),
        type: 'editreply',
    }, interaction);
};
