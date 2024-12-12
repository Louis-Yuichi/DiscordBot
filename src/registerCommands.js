const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
require('dotenv').config();

const TOKEN = process.env.discordToken;
const ID_CLIENT = process.env.idClient;
const ID_GUILD = process.env.idGuild;

const commands = [];

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles)
{
	const command = require(`./commands/${file}`);
	commands.push(
	{
		name: command.name,
		description: command.description,
		options: command.options || [],
	});
}

const rest = new REST({ version: '9' }).setToken(TOKEN);

(async () =>
{
	try
	{
		console.log('Enregistrement des commandes...');
		await rest.put(Routes.applicationGuildCommands(ID_CLIENT, ID_GUILD), { body: commands });
		console.log('Commandes enregistrées avec succès.');
	}

	catch (error)
	{
		console.error(error);
	}
})();