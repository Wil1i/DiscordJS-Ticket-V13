const { Permissions } = require("discord.js")
const config = require("../../config.json")
const db = require("quick.db")

module.exports = {
    name : "pending",
    description : "Set a ticket to pending mode",
    execute(client, message){

        const canSeeTicket = db.get(`roles-canseeticket`) || config.roles.seeticket
        if(!message.member.roles.cache.has(canSeeTicket) && !message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return;

        const cehckChannel = db.has(`ticket_${message.channel.id}`)
        if(!cehckChannel) return

        message.delete()
        const userMention = message.mentions.users.first()
        const roleMention = message.mentions.roles.first()
        if(userMention){

            message.channel.setName(`pending-${userMention.username}`)
            message.channel.send({content : `>>> **Ticket Pending to ${userMention} By <@${message.author.id}>**`})

        }else if(roleMention){

            message.channel.setName(`pending-${roleMention.name}`)
            message.channel.send({content : `>>> **Ticket Pending to ${roleMention} By <@${message.author.id}>**`})

        }


    }
}