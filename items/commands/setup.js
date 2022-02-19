const Discord = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "setup",
  description: "Setup an ticket system",
  rank: "admin",
  execute(client, message) {
    // Need Administrator permission to run this command
    if (
      !message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)
    )
      return;

    const messageArry = message.content.split(" ");
    const embed = new Discord.MessageEmbed()
      .setColor(db.get("color") || "DARK_BUT_NOT_BLACK")
      .setAuthor("Ticket System")
      .setFooter(db.get("footer"));

    // Available items for setup
    const avItems = [
      "footer",
      "prefix",
      "color",

      "roles-canseeticket",

      "channel",
      "log",
      "ticket-parent-normal",
      "ticket-parent-closed",
    ];

    if (messageArry[2] && avItems.includes(messageArry[1].toLowerCase())) { // If user entered setup name and setup value and setup found
      db.set( // Update target setup
        messageArry[1].toLowerCase(),
        message.content.replace(`${messageArry[0]} ${messageArry[1]} `, "")
      );
      embed.setDescription(
        `**Setting Updated**\n\n**${messageArry[1].toLowerCase()}** : ${
          messageArry[2]
        }`
      );
    } else {

      embed.setDescription(
        `**SYNTAX**: ${db.get("prefix")}${
          this.name
        } [key] [value]\n\n**Keys:**${avItems.join("\n")}`
      );
    }

    message.channel.send({ embeds: [embed] });
  },
};
