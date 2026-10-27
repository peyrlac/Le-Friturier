const { getJson } = require('../../handlers/http');
const generator = require('generate-password');

module.exports = async (client, interaction, args) => {

    const password = generator.generate({
        length: 10,
        symbols: true,
        numbers: true
    });

    const user = interaction.options.getUser('user');

    if (!user) return client.errUsage({ usage: "hack [mention user]", type: 'editreply' }, interaction)

    function wait(ms) {
        let start = new Date().getTime();
        let end = start;
        while (end < start + ms) {
            end = new Date().getTime();
        }
    }

    client.embed({
        titleKey: 'fun.hackTitle',
        descKey: 'fun.hackStarted',
        variables: { user: String(user) },
        type: 'editreply'
    }, interaction).then(msg => {

        wait(140);
        client.embed({
        titleKey: 'fun.hackTitle',
            descKey: 'fun.hackSearchingUser',
            type: 'edit',
        }, msg).then(i => {

            wait(133);
            client.embed({
        titleKey: 'fun.hackTitle',
                descKey: 'fun.hackSearchingIp',
                type: 'edit',
            }, msg).then(i => {

                wait(140);
                client.embed({
        titleKey: 'fun.hackTitle',
                    descKey: 'fun.hackIpFound',
                    fields: [
                        {
                            name: '🔗┆IP Adress',
                            value: `\`\`\`127.0.0.1\`\`\``,
                            inline: true,
                        }
                    ],
                    type: 'edit',
                }, msg).then(i => {

                    wait(60);
                    client.embed({
        titleKey: 'fun.hackTitle',
                        descKey: 'fun.hackSearchingLogin',
                        type: 'edit',
                    }, msg).then(i => {

                        wait(230);
                        client.embed({
        titleKey: 'fun.hackTitle',
                            descKey: 'fun.hackLoginFound',
                            fields: [
                                {
                                    name: '📨┆Email',
                                    value: `\`\`\`${user.username}onDiscord@gmail.com\`\`\``
                                },
                                {
                                    name: '🔑┆Password',
                                    value: `\`\`\`${password}\`\`\``
                                }
                            ],
                            type: 'edit',
                        }, msg).then(i => {

                            wait(200);
                            client.embed({
        titleKey: 'fun.hackTitle',
                                descKey: 'fun.hackSearchingToken',
                                type: 'edit'
                            }, msg).then(i => {

                                wait(200);
                                getJson(`https://some-random-api.com/bottoken?${user.id}`).then(async (json) => {
                                    client.embed({
        titleKey: 'fun.hackTitle',
                                    descKey: 'fun.hackTokenFound',
                                        fields: [
                                            {
                                                name: '🔧┆Token',
                                                value: `\`\`\`${json.token}\`\`\``,
                                                inline: true
                                            }
                                        ],
                                        type: 'edit',
                                    }, msg).then(i => {

                                        wait(140);
                                        client.embed({
        titleKey: 'fun.hackTitle',
                                        descKey: 'fun.hackReporting',
                                            type: 'edit',
                                        }, msg).then(i => {

                                            wait(180);
                                            client.succNormal({ key: 'fun.hackSuccess', variables: { user: String(user) }, type: 'edit' }, msg);
                                            client.embed({
                                                titleKey: 'fun.hackPranked',
                                                image: "https://media1.tenor.com/images/05006ed09075a0d6965383797c3cea00/tenor.gif?itemid=17987788",
                                            }, interaction.user)
                                        })
                                    })
                                }).catch(() => client.errNormal({ key: 'fun.hackRemoteError', type: 'editreply' }, interaction))
                            })
                        })
                    })
                })
            })
        })
    })

}


