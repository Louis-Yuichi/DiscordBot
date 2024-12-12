const fs = require('fs');
let economyData;

if (fs.existsSync('../economy.json'))
{
	economyData = JSON.parse(fs.readFileSync('../economy.json', 'utf-8'));
}

else
{
	economyData = { guilds: {} };
}

function saveEconomyData()
{
	fs.writeFileSync('../economy.json', JSON.stringify(economyData, null, 4));
}

function getUserData(guildId, userId)
{
	if (!economyData.guilds[guildId])
	{
		economyData.guilds[guildId] = { users: {} };
	}

	if (!economyData.guilds[guildId].users[userId])
	{
		economyData.guilds[guildId].users[userId] =
		{
			pierre: 0,
			fer: 0,
			or: 0,
			emeraude: 0,
			ruby: 0,
			jade: 0,
			diamant: 0,
			inventory: [],
		};
	}

	return economyData.guilds[guildId].users[userId];
}

module.exports = { saveEconomyData, getUserData };