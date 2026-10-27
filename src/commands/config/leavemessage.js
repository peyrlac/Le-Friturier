const localizedLeaveMessage = require('./leavemessageLocalized');

module.exports = async (client, interaction, args) => {
    return localizedLeaveMessage(client, interaction, args);
}

