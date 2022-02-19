const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  Permissions,
} = require("discord.js");
const db = require("quick.db");
const config = require("../../config.json");

module.exports = {
  name: "panel",
  description: "Create ticket panel",
  execute(client, message) {
    const canSeeTicket = config.roles.seeticket;

    if (
      !message.member.roles.cache.has(canSeeTicket) &&
      !message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
    )
      return;

    message.delete();
    const cmdEmbed = new MessageEmbed()
      .setColor(db.get("color") || "DARK_BUT_NOT_BLACK")
      .setFooter(db.get("footer") || "")
      .setAuthor("Ticket Panel");

    if (db.has("channel")) {
      const ticketChannel = client.channels.cache.get(db.get("channel"));
      if (!ticketChannel) return;

      const embed = new MessageEmbed()
        .setColor(db.get("color") || "DARK_BUT_NOT_BLACK")
        .setAuthor("Ticket")
        .setFooter(db.get("footer") || "")
        .setDescription(
          ":snowflake: To create ticket press `Ticket` button"
        )
        .setThumbnail(message.guild.iconURL({ dynamic: true, size: 1024 }));

      const buttons = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId("ticket-normal")
            .setLabel("Ticket")
            .setStyle("PRIMARY")
        )

      ticketChannel.send({ embeds: [embed], components: [buttons] });
      db.set("ticket", "1");

      cmdEmbed.setDescription(
        `**Ticket Panel Successfully Sent To Channel <#${db.get("channel")}>**`
      );
    } else {
      const setup = require("./setup");
      cmdEmbed.setDescription(
        `Please first setup ticket system using ${db.get("prefix")}${
          setup.name
        }`
      );
    }
    message.channel.send({ embeds: [cmdEmbed] });
  },
};
