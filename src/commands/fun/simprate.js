
module.exports = async (client, interaction, args) => {
    var result = Math.ceil(Math.random() * 100);

    client.embed({
        titleKey: 'fun.simpRateTitle',
        descKey: 'fun.simpRate',
        variables: { result },
        type: 'editreply'
    }, interaction)
}


