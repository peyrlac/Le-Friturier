const invites = require("../../database/models/invites");
const invitedBy = require("../../database/models/inviteBy");
const welcomeSchema = require("../../database/models/welcomeChannels");
const messages = require("../../database/models/inviteMessages");
const rewards = require("../../database/models/inviteRewards");


module.exports = async (client, member, invite, inviter) => {
    const messageData = await messages.findOne({ Guild: member.guild.id });

    if (!invite || !inviter) {
        if (messageData && messageData.inviteJoin) {
            var joinMessage = messageData.inviteJoin;
            joinMessage = joinMessage.replace(`{user:username}`, member.user.username)
            joinMessage = joinMessage.replace(`{user:discriminator}`, member.user.discriminator)
            joinMessage = joinMessage.replace(`{user:tag}`, member.user.tag)
            joinMessage = joinMessage.replace(`{user:mention}`, member)

            joinMessage = joinMessage.replace(`{inviter:username}`, "System")
            joinMessage = joinMessage.replace(`{inviter:discriminator}`, "#0000")
            joinMessage = joinMessage.replace(`{inviter:tag}`, "System#0000")
            joinMessage = joinMessage.replace(`{inviter:mention}`, "System")
            joinMessage = joinMessage.replace(`{inviter:invites}`, "∞")
            joinMessage = joinMessage.replace(`{inviter:invites:left}`, "∞")

            joinMessage = joinMessage.replace(`{guild:name}`, member.guild.name)
            joinMessage = joinMessage.replace(`{guild:members}`, member.guild.memberCount)

            await sendWelcome(client, member, joinMessage);
        } else {
            await sendWelcome(client, member, `I cannot trace how **${member} | ${member.user.tag}** has been joined`);
        }
    }
    else {
        const data = await invites.findOne({ Guild: member.guild.id, User: inviter.id });

        if (data) {
            data.Invites += 1;
            data.Total += 1;
            await data.save();

            if (messageData?.inviteJoin) {
                var joinMessage = messageData.inviteJoin;
                joinMessage = joinMessage.replace(`{user:username}`, member.user.username)
                joinMessage = joinMessage.replace(`{user:discriminator}`, member.user.discriminator)
                joinMessage = joinMessage.replace(`{user:tag}`, member.user.tag)
                joinMessage = joinMessage.replace(`{user:mention}`, member)

                joinMessage = joinMessage.replace(`{inviter:username}`, inviter.username)
                joinMessage = joinMessage.replace(`{inviter:discriminator}`, inviter.discriminator)
                joinMessage = joinMessage.replace(`{inviter:tag}`, inviter.tag)
                joinMessage = joinMessage.replace(`{inviter:mention}`, inviter)
                joinMessage = joinMessage.replace(`{inviter:invites}`, data.Invites)
                joinMessage = joinMessage.replace(`{inviter:invites:left}`, data.Left)

                joinMessage = joinMessage.replace(`{guild:name}`, member.guild.name)
                joinMessage = joinMessage.replace(`{guild:members}`, member.guild.memberCount)

                await sendWelcome(client, member, joinMessage);
            }
            else {
                await sendWelcome(client, member, `**${member} | ${member.user.tag}** was invited by ${inviter.tag} **(${data.Invites} invites)**`);
            }

            const reward = await rewards.findOne({ Guild: member.guild.id, Invites: data.Invites });
            if (reward) {
                const role = member.guild.roles.cache.get(reward.Role);
                if (role) await member.roles.add(role);
            }
        }
        else {
            await new invites({
                Guild: member.guild.id,
                User: inviter.id,
                Invites: 1,
                Total: 1,
                Left: 0
            }).save();

            if (messageData?.inviteJoin) {
                var joinMessage = messageData.inviteJoin;
                joinMessage = joinMessage.replace(`{user:username}`, member.user.username)
                joinMessage = joinMessage.replace(`{user:discriminator}`, member.user.discriminator)
                joinMessage = joinMessage.replace(`{user:tag}`, member.user.tag)
                joinMessage = joinMessage.replace(`{user:mention}`, member)

                joinMessage = joinMessage.replace(`{inviter:username}`, inviter.username)
                joinMessage = joinMessage.replace(`{inviter:discriminator}`, inviter.discriminator)
                joinMessage = joinMessage.replace(`{inviter:tag}`, inviter.tag)
                joinMessage = joinMessage.replace(`{inviter:mention}`, inviter)
                joinMessage = joinMessage.replace(`{inviter:invites}`, "1")
                joinMessage = joinMessage.replace(`{inviter:invites:left}`, "0")

                joinMessage = joinMessage.replace(`{guild:name}`, member.guild.name)
                joinMessage = joinMessage.replace(`{guild:members}`, member.guild.memberCount)

                await sendWelcome(client, member, joinMessage);
            }
            else {
                await sendWelcome(client, member, `**${member} | ${member.user.tag}** was invited by ${inviter.tag} **(1 invites)**`);
            }
        }

        await invitedBy.findOneAndUpdate(
            { Guild: member.guild.id },
            {
                $set: {
                    inviteUser: inviter.id,
                    User: member.id
                }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
    }
};

async function sendWelcome(client, member, description) {
    const channelData = await welcomeSchema.findOne({ Guild: member.guild.id });
    if (!channelData) return;

    const channel = member.guild.channels.cache.get(channelData.Channel);
    if (!channel) return;

    try {
        await client.embed({
            title: `👋・Welcome`,
            desc: description
        }, channel);
    }
    catch (error) {
        console.error("Failed to send welcome message", error);
    }
}
