const thanksSchema = require("../../database/models/thanks");
const thanksAuthor = require("../../database/models/thanksAuthor");

module.exports = async (client, interaction, args) => {

    const target = interaction.options.getUser('user');
    if (!target) return client.errUsage({ usage: "thanks [mention user]", type: 'editreply' }, interaction);

    if (target.id === interaction.user.id) return client.errNormal({ key: 'thanks.self', type: 'editreply' }, interaction);

    const authorRecord = await thanksAuthor.findOne({ User: target.id, Author: interaction.user.id });
    if (authorRecord) {
        return client.errNormal({ key: 'thanks.alreadyGiven', type: 'editreply' }, interaction);
    }

    const data = await thanksSchema.findOne({ User: target.id });
    let received = 1;
    if (data) {
        data.Received += 1;
        received = data.Received;
        await data.save();
    }
    else {
        await new thanksSchema({
            User: target.id,
            UserTag: target.tag,
            Received: received,
        }).save();
    }

    await new thanksAuthor({
        User: target.id,
        Author: interaction.user.id,
    }).save();

    return client.succNormal({ key: 'thanks.success', variables: { user: target.id, received }, type: 'editreply' }, interaction);
}


