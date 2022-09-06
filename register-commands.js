const fs = require('node:fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { clientId, guildIds, token } = require('../config.json');

const commands = [];
const user_commands = [];
const message_commands = [];

const commandFiles = fs
	.readdirSync('./commands')
	.filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`../commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Registering application commands...');

		if (process.argv.includes('--global') || process.argv.includes('-g')) {
			console.log('Command scope: GLOBAL');

			await rest.put(Routes.applicationCommands(clientId), { body: commands });
		} else {
			console.log('Command scope: GUILD');

			for (const guildId of guildIds) {
				await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
					body: commands,
				});
			}
		}

		console.log(
			`Registration of application commands complete. Total commands registered:\n
			CHAT_INPUT: ${commands.length}\n
			USER: ${user_commands.length}\n
			MESSAGE: ${message_commands.length}`
		);
	} catch (error) {
		console.warn('An error occured while registering application commands.');
		console.error(error);
	}
})();
