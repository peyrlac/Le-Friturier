const fr = require('../../locales/fr.json');
const en = require('../../locales/en.json');
const Functions = require('../../database/models/functions');

const LOCALES = { fr, en };
const SUPPORTED_LOCALES = Object.freeze(['fr', 'en']);
const DEFAULT_LOCALE = 'fr';

function getValue(source, key) {
    return key.split('.').reduce((value, part) => value?.[part], source);
}

function interpolate(value, variables) {
    return value.replace(/\{([^{}]+)\}/g, (match, name) => {
        return Object.prototype.hasOwnProperty.call(variables, name)
            ? String(variables[name])
            : match;
    });
}

function createI18n({ warn = message => console.warn(message) } = {}) {
    function t(locale, key, variables = {}) {
        const requestedLocale = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
        const resolve = source => getValue(source, key) ?? getValue(source, `commands.${key}`);
        const value = resolve(LOCALES[requestedLocale]) ?? resolve(LOCALES[DEFAULT_LOCALE]);

        if (typeof value !== 'string') {
            if (process.env.NODE_ENV !== 'production') {
                warn(`[i18n] Missing translation: ${key}`);
            }
            return key;
        }

        return interpolate(value, variables);
    }

    return { t };
}

async function resolveLocale(interaction) {
    if (!interaction?.guild?.id) return DEFAULT_LOCALE;

    const data = await Functions.findOne({ Guild: interaction.guild.id }).select('Language').lean();
    return SUPPORTED_LOCALES.includes(data?.Language) ? data.Language : DEFAULT_LOCALE;
}

function initializeI18n(client) {
    const i18n = createI18n();

    client.i18n = i18n;
    client.getLocale = resolveLocale;
    client.t = async (interaction, key, variables = {}) => {
        return i18n.t(await resolveLocale(interaction), key, variables);
    };
}

function mergeLocalizedValues(frenchValue, englishValue) {
    if (typeof frenchValue === 'string' || typeof englishValue === 'string') {
        return {
            fr: frenchValue ?? englishValue,
            en: englishValue ?? frenchValue
        };
    }

    if (!frenchValue && !englishValue) return undefined;

    const result = {};
    for (const key of new Set([
        ...Object.keys(frenchValue || {}),
        ...Object.keys(englishValue || {})
    ])) {
        const value = mergeLocalizedValues(frenchValue?.[key], englishValue?.[key]);
        if (value !== undefined) result[key] = value;
    }
    return result;
}

function resolveCommandLocalizations(command) {
    if (command?.localizations) return command.localizations;
    if (!command?.localizationKey) return undefined;

    const frenchMetadata = getValue(fr, command.localizationKey);
    const englishMetadata = getValue(en, command.localizationKey);
    if (!frenchMetadata && !englishMetadata) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn(`[i18n] Missing command metadata: ${command.localizationKey}`);
        }
        return undefined;
    }

    return mergeLocalizedValues(frenchMetadata, englishMetadata);
}

function getCommandMetadata(key) {
    return getValue(fr, key) ?? getValue(en, key);
}

function applyCommandLocalizations(command) {
    const localizations = resolveCommandLocalizations(command);
    const builder = command?.data;
    if (!localizations || !builder) return command;

    const discordLocale = (locale) => locale === 'en' ? 'en-US' : locale;
    const serializeLocales = (values) => Object.fromEntries(
        Object.entries(values).map(([locale, value]) => [discordLocale(locale), value])
    );

    const applyBuilderLocalizations = (target, values) => {
        if (!target || !values) return;

        if (values.name && typeof target.setNameLocalizations === 'function') {
            target.setNameLocalizations(serializeLocales(values.name));
        }
        if (values.description && typeof target.setDescriptionLocalizations === 'function') {
            target.setDescriptionLocalizations(serializeLocales(values.description));
        }

        const children = Array.isArray(target.options) ? target.options : [];
        for (const [name, childValues] of Object.entries(values.subcommandGroups || {})) {
            const child = children.find(option => option.name === name);
            applyBuilderLocalizations(child, childValues);
        }
        for (const [name, childValues] of Object.entries(values.subcommands || {})) {
            const child = children.find(option => option.name === name);
            applyBuilderLocalizations(child, childValues);
        }
        for (const [name, childValues] of Object.entries(values.options || {})) {
            const child = children.find(option => option.name === name);
            applyBuilderLocalizations(child, childValues);
        }
    };

    applyBuilderLocalizations(builder, localizations);

    return command;
}

initializeI18n.createI18n = createI18n;
initializeI18n.DEFAULT_LOCALE = DEFAULT_LOCALE;
initializeI18n.SUPPORTED_LOCALES = SUPPORTED_LOCALES;
initializeI18n.applyCommandLocalizations = applyCommandLocalizations;
initializeI18n.resolveCommandLocalizations = resolveCommandLocalizations;
initializeI18n.getCommandMetadata = getCommandMetadata;

module.exports = initializeI18n;
