
module.exports = async (client, interaction, args) => {

    var result = Math.ceil(Math.random() * 100);

    client.embed({
        titleKey: 'fun.cleverRateTitle',
        descKey: 'fun.cleverRate',
        variables: { result },
        type: 'editreply'
    }, interaction)
}


