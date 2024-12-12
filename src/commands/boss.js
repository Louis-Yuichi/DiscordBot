module.exports =
{
	name: 'boss',
	description: 'Combattre un boss',
	options:
	[
		{
			name: 'numero',
			type: 4,
			description: 'Numéro du boss a combattre',
			required: true,
		},
	],

	async execute(interaction)
	{
		await interaction.reply(`en dev...`);
	}
};