const server = require('./server');
const PORT = 3333;

server.listen(PORT, () => {
	console.log(`Server running on port: ${PORT}`);
});
