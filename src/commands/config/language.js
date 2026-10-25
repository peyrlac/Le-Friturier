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
            key: 'errors.unsupportedLanguage',
            type: 'editreply',
        }, interaction);
    }

    await Schema.findOneAndUpdate(
        { Guild: interaction.guild.id },
        { $set: { Language: language } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return client.succNormal({
        key: 'commands.config.language.success',
        variables: { language: language === 'fr' ? 'Français' : 'English' },
        type: 'editreply',
    }, interaction);
};
