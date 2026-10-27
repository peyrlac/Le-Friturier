const localizedNotes = require('./notesLocalized');

module.exports = async (client, interaction, args) => {
    return localizedNotes(client, interaction, args);
};

