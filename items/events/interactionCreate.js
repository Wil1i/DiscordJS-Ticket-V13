const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageAttachment
} = require("discord.js");
const fetchMessage = require("./fetchMessage1");
const db = require("quick.db");
const config = require("../../config.json");

const afterWelcome = `<@&${config.roles.seeticket}>` // Text for when user created a ticket (outside of embed)
module.exports = {
  name: "interactionCreate",
  description: "Handle when a interaction added",
  async execute(client, interaction) {
    // if interaction is a message component and component type is button (user clicked to button)
    if (
      interaction.type == "MESSAGE_COMPONENT" &&
      interaction.componentType == "BUTTON"
    ) {

      // Default permissions for ticket channel
      const permissions = [ 
        {
          id: interaction.guild.roles.everyone,
          deny: ["VIEW_CHANNEL"],
        },
        {
          id: interaction.user.id,
          allow: ["VIEW_CHANNEL"],
        },
        {
          id: config.roles.seeticket,
          allow: ["VIEW_CHANNEL"],
        },
      ];

      // If user clicked to 'Ticket' button
      if (interaction.customId == "ticket-normal") {

        // Check if user have not any active tickets
        if (db.has(`active_normal_${interaction.user.id}`))
          return interaction.reply({
            content: `You already have a ticket! <#${db.get(
              `active_normal_${interaction.user.id}`
            )}>`,
            ephemeral: true,
          });

          // Create new Ticket
          interaction.guild.channels
          .create(`ticket-${interaction.user.username}`, {
            permissionOverwrites: permissions,
            parent: db.get(`ticket-parent-normal`),
          })
          .then(async (channel) => {
            await interaction.reply({
              content: `Your ticket created. <#${channel.id}>`,
              ephemeral: true,
            });

            db.set(`active_normal_${interaction.user.id}`, channel.id);

            const greetingEmbed = new MessageEmbed()
              .setColor(db.get("color") || "DARK_BUT_NOT_BLACK")
              .setTitle("Welcome To Your Ticket")
              .setDescription(
                "Thank you for opening a ticket, a staff member will be here momentarily!"
              )
              .setFooter(
                `Ticket for ${interaction.user.username}#${interaction.user.discriminator}`
              )
              .setTimestamp();

            const greetingButtons = new MessageActionRow().addComponents(
              new MessageButton()
                .setCustomId("ticket-close")
                .setLabel("Close Ticket")
                .setStyle("DANGER")
            );

            channel.send({
              content: `<@${interaction.user.id}> Welcome!\n${afterWelcome}`,
              embeds: [greetingEmbed],
              components: [greetingButtons],
            });

            db.set(`ticket_${channel.id}`, interaction.user.id); // Set ticket owner in database
            db.set(`ticket_${channel.id}_type`, "normal"); // Set ticket type to normal (you can have many ticket types and have ticket type log for them)
          });
      
      // If user clicked to 'close' button
      } else if (interaction.customId == "ticket-close") {

        if (!db.has(`ticket_${interaction.channelId}`)) // Check if channel is ticket channel (can find it in database)
          return await interaction.reply({
            content: "This channel is not ticket channel.",
            ephemeral: true,
          });

        const logChannel = client.channels.cache.get(db.get(`log`));
        // If can't find log channel nothing happened to ticket channel
        if (logChannel) {
          const userId = db.get(`ticket_${interaction.channel.id}`);
          const findUser = client.users.cache.get(userId) || NaN;
          const logEmbed = new MessageEmbed()
            .setColor(db.get("color"))
            .setFooter(db.get("footer"))
            .addField("Closed Ticket", interaction.channel.name, true)
            .addField(
              "Closed By",
              `<@${interaction.user.id}> | ${interaction.user.username}`,
              true
            )
            .addField(
              "Created By",
              `<@${userId}> | ${findUser.username}`,
              true
            );

          const channelType = db.get(`ticket_${interaction.channelId}_type`);

          interaction.reply("Channel will be deleted in 10 seconds.");
          fetchMessage(interaction, 99).then((data) => {
            const file = new MessageAttachment(data, "log.html");
            logChannel.send({ embeds: [logEmbed], files: [file] }).then(() => {
              setTimeout(() => {
                try {
                  interaction.channel.delete();
                } catch (error) {}
                db.delete(`ticket_${interaction.channelId}`);
                db.delete(`ticket_${interaction.channelId}_type`);
                db.delete(`active_${channelType}_${findUser.id}`);
              }, 10000);
            });
          });
        }else{
          await interaction.reply({
            content : "Can't find log for tickets (setup it with [PREFIX]setup command)",
            ephemeral : true
          })
        }
      }
    }
  },
};
