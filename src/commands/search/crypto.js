const { getJson } = require('../../handlers/http');

module.exports = async (client, interaction, args) => {

    let coin = interaction.options.getString('coin');
    let currency = interaction.options.getString('currency');

    try {
        const data = await getJson(
            `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(coin)}&vs_currencies=${encodeURIComponent(currency)}`
        );

        if (!data[coin]?.[currency]) return client.errNormal({ key: 'search.invalidInputs', type: 'editreply' }, interaction);

        client.embed({ 
            titleKey: 'search.cryptoTitle',
            descKey: 'search.cryptoDescription',
            variables: { coin, amount: data[coin][currency], currency },
            type: 'editreply' 
        }, interaction);
    }
    catch {
        client.errNormal({ 
            key: 'search.invalidInputs',
            type: 'editreply' 
        }, interaction);
    }
}

 
