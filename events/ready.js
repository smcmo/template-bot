module.exports = {
	name: 'ready',
	async execute(client) {
		console.log(`Bot online, logged in as ${client.user.tag}`);
	},
};
