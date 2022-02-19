const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const db = require("quick.db")
const config = require("../../config.json")

module.exports = {
    name : "ready",
    description : "Handle when bot is ready",
    execute(client){

        if(!db.has("prefix")) db.set("prefix", config.prefix);
        if(!db.has("color")) db.set("color", config.color);
        if(!db.has("footer")) db.set("footer", config.footer);

        if(!db.has("role-canseeticket")) db.set("role-canseeticket", config.roles.seeticket);

        if(!db.has("ticket-parent-normal")) db.set("ticket-parent-normal", config.parents.normal);
        if(!db.has("ticket-parent-close")) db.set("ticket-parent-close", config.parents.closed);

        if(!db.has("ticket") && db.has("channel")){

            const ticketChannel = client.channels.cache.get(db.get("channel"))
            if(!ticketChannel) return;

            const embed = new MessageEmbed()
            .setColor(db.get("color") || "DARK_BUT_NOT_BLACK")
            .setAuthor("Ticket System")
            .setFooter(db.get("footer") || "")
            .setDescription("For create a ticket, press button `Ticket`")
            .setThumbnail(client.user.displayAvatarURL(), {size : 1024})
            
            const buttons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId("ticket-normal")
                .setLabel("Ticket")
                .setStyle("PRIMARY")
            )

            ticketChannel.send({embeds : [embed], components : [buttons]})
            db.set("ticket", "1")

        }

    }
}
