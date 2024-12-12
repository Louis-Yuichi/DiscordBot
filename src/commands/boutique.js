const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const boutiqueActive = new Map();

module.exports =
{
	name: 'boutique',
	description: 'Affiche la boutique selon la catégorie demandée',
	options:
	[
		{
			name: 'type',
			type: 3,
			description: 'Choisissez une catégorie d\'objets',
			required: true,
			choices:
			[
				{
					name: 'Attaque',
					value: 'attaque',
				},

				{
					name: 'Défense',
					value: 'défense',
				},
				{
					name: 'Soin',
					value: 'soin',
				},
			],
		},
	],

	async execute(interaction)
	{
		const type = interaction.options.getString('type');

		if (boutiqueActive.has(interaction.user.id))
		{
			const reponseExistante = boutiqueActive.get(interaction.user.id);
			try
			{
				await reponseExistante.delete();
			}

			catch (error)
			{
				console.error("Erreur lors de la suppression de l'embed existant:", error);
			}
		}

		const items =
		{
			attaque:
			[
				{ name: 'Épée en pierre', value: 'stone_sword', price: '1000 pierres' },
				{ name: 'Épée en fer', value: 'iron_sword', price: '2000 pierres' },
				{ name: 'Épée magique', value: 'magic_sword', price: '5000 pierres' },
			],

			défense:
			[
				{ name: 'Bouclier en pierre', value: 'stone_shield', price: '750 pierres' },
				{ name: 'Bouclier en fer', value: 'iron_shield', price: '1500 pierres' },
				{ name: 'Bouclier magique', value: 'magic_shield', price: '3500 pierres' },
			],

			soin:
			[
				{ name: 'Potion de santé', value: 'healing_potion', price: '300 pierres' },
				{ name: 'Potion de santé supérieur', value: 'superior_healing_potion', price: '500 pierres' },
			],
		};

		const MAX_ITEMS_PAGE = 5;
		let pageActuelle = 0;

		const maxPages = Math.ceil(items[type].length / MAX_ITEMS_PAGE);

		const generationBoutique = (page) =>
		{
			const boutique = new EmbedBuilder()
				.setTitle(`Liste des objets pour la catégorie : ${type.charAt(0).toUpperCase() + type.slice(1)}`)
				.setColor('White');

			const debut = page * MAX_ITEMS_PAGE;
			const fin   = debut + MAX_ITEMS_PAGE;

			items[type].slice(debut, fin).forEach(item =>
			{
				const [prixAchat, unit] = item.price.split(' ');
				const prixVente = prixAchat / 2;
				boutique.addFields({ name: item.name, value: `Prix d'achat : ${prixAchat + ' ' + unit}\nPrix de vente : ${prixVente + ' ' + unit}` });
			});

			return boutique;
		};

		const generationBoutons = () =>
		{
			const btnPrecedent = new ButtonBuilder()
				.setCustomId('btn_precedent')
				.setLabel('Page précédente')
				.setStyle(ButtonStyle.Danger)
				.setDisabled(pageActuelle === 0);

			const btnSuivant = new ButtonBuilder()
				.setCustomId('btn_suivant')
				.setLabel('Page suivante')
				.setStyle(ButtonStyle.Success)
				.setDisabled(pageActuelle === maxPages - 1);

			return new ActionRowBuilder().addComponents(btnPrecedent, btnSuivant);
		};

		const reponse = await interaction.reply({ embeds: [generationBoutique(pageActuelle)], components: [generationBoutons()], fetchReply: true });
		boutiqueActive.set(interaction.user.id, reponse);

		const debutCollecteur = () =>
		{
			const filtre = (i) => i.customId === 'btn_precedent' || i.customId === 'btn_suivant';
			const collecteur = reponse.createMessageComponentCollector({ filtre });

			collecteur.on('collect', async (i) =>
			{
				if (i.customId === 'btn_precedent')
				{
					pageActuelle = Math.max(pageActuelle - 1, 0);
				}

				else if (i.customId === 'btn_suivant')
				{
					pageActuelle = Math.min(pageActuelle + 1, maxPages - 1);
				}

				await i.update({ embeds: [generationBoutique(pageActuelle)], components: [generationBoutons()] });
			});
		};

		debutCollecteur();
	},
};