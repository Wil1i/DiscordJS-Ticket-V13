const { Permissions } = require("discord.js")
const config = require("../../config.json")
const db = require("quick.db")

module.exports = {
    name : "pending",
    description : "Set a ticket to pending mode",
    execute(client, message){

        // This command needs seeticket role or administrator permission
        const canSeeTicket = db.get(`roles-canseeticket`) || config.roles.seeticket
        if(!message.member.roles.cache.has(canSeeTicket) && !message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return;

        // Check if channel exist
        const cehckChannel = db.has(`ticket_${message.channel.id}`)
        if(!cehckChannel) return

        message.delete()
        const userMention = message.mentions.users.first()
        const roleMention = message.mentions.roles.first()
        if(userMention){ // If user wants to pending ticket to a user 

            message.channel.setName(`pending-${userMention.username}`)
            message.channel.send({content : `>>> **Ticket Pending to ${userMention} By <@${message.author.id}>**`})

        }else if(roleMention){ // If user wants to pending ticket to a role

            message.channel.setName(`pending-${roleMention.name}`)
            message.channel.send({content : `>>> **Ticket Pending to ${roleMention} By <@${message.author.id}>**`})

        }


    }
}