module.exports =
{
	name: 'acheter',
	description: 'Acheter un objet du shop',
	options:
	[
		{
			name: 'objet',
			type: 3,
			description: 'Nom de l\'objet à acheter',
			required: true,
		},
	],

	async execute(interaction)
	{
		await interaction.reply(`en dev...`);
	}
};