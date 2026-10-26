const { getJson } = require('../../handlers/http');

module.exports = async (client, interaction, args) => {

    let countries = interaction.options.getString('country');

    try {
        const data = await getJson(`https://covid19.mathdro.id/api/countries/${countries}`);
            let confirmed = data.confirmed.value.toLocaleString()
            let recovered = data.recovered.value.toLocaleString()
            let deaths = data.deaths.value.toLocaleString()


            return client.embed({
                title: await client.t(interaction, 'search.coronaTitle', { country: countries }),
                fields: [{
                    name: await client.t(interaction, 'search.confirmed'),
                    value: `${confirmed}`,
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'search.recovered'),
                    value: `${recovered}`,
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'search.deaths'),
                    value: `${deaths}`,
                    inline: true,
                },
                ], type: 'editreply'
            }, interaction);

    } catch (error) {
        return client.errNormal({ key: 'search.invalidCountry', type: 'editreply' }, interaction);
    }
}

 
