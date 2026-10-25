const Schema = require("../../database/models/family");

module.exports = async (client, interaction, args) => {
    const target = interaction.options.getUser("membre");
    const author = interaction.user;

    if (author.id == target.id) return client.errNormal({
        error: "Tu ne peux pas te renier toi-même",
        type: "editreply"
    }, interaction);

    if (target.bot) return client.errNormal({
        error: "Tu ne peux pas renier un robot",
        type: "editreply"
    }, interaction);

    const [authorData, targetData] = await Promise.all([
        Schema.findOne({ Guild: interaction.guild.id, User: author.id }),
        Schema.findOne({ Guild: interaction.guild.id, User: target.id })
    ]);

    const authorChildren = Array.isArray(authorData?.Children) ? authorData.Children : [];
    const authorParents = Array.isArray(authorData?.Parent) ? authorData.Parent : [];
    const isChild = authorChildren.includes(target.id);
    const isParent = authorParents.includes(target.id);

    if (!isChild && !isParent) {
        return client.errNormal({ error: "Tu n\'as pas d\'enfants/parents pour le moment", type: "editreply" }, interaction);
    }

    const authorUpdate = {};
    const targetUpdate = {};

    if (isChild) {
        authorUpdate.Children = target.id;
        targetUpdate.Parent = author.id;
    }
    if (isParent) {
        authorUpdate.Parent = target.id;
        targetUpdate.Children = author.id;
    }

    await Promise.all([
        Schema.findOneAndUpdate(
            { Guild: interaction.guild.id, User: author.id },
            { $pull: authorUpdate },
            { new: true }
        ),
        Schema.findOneAndUpdate(
            { Guild: interaction.guild.id, User: target.id },
            { $pull: targetUpdate },
            { new: true }
        )
    ]);

    return client.embed({
        title: "👪・Renié",
        desc: author + " a renié <@!" + target.id + ">",
        type: "editreply"
    }, interaction);
};
