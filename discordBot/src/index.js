const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const TOKEN = process.env.discordToken;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles)
{
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}


client.on('interactionCreate', async interaction =>
{
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	try
	{
		await command.execute(interaction);
	}

	catch (error)
	{
		console.error(error);
		await interaction.reply({ content: 'Une erreur est survenue lors de l\'exécution de la commande !', ephemeral: true });
	}
});

client.login(TOKEN);