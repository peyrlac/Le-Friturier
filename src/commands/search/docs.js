const { getJson } = require('../../handlers/http');

module.exports = async (client, interaction, args) => {

    let name = interaction.options.getString('name');

    const uri = `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(
        name
    )}`;

    try {
        const data = await getJson(uri);
        if (data && !data.error) {
            return interaction.editReply({ embeds: [data] })
        } else {
            return client.errNormal({
                key: 'search.docsNotFound',
                type: 'editreply' 
            }, interaction)
        }
    } catch {
        return client.errNormal({ key: 'search.docsNotFound', type: 'editreply' }, interaction);
    }
}

 
