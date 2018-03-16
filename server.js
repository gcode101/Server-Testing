const express = require('express');
const morgan = require('morgan');

const Movie = require('./models');

const server = express();
server.use(morgan('combined'));
server.use(express.json());

server.get('/movies', (req, res) => {
	Movie.find({}, (err, movies) => {
		if (err) res.status(500).json({ error: 'Internal server error' });
		res.json(movies);
	});
});

server.post('/movies', (req, res) => {
	const { name, genre, rating } = req.body;
	const newMovie = new Movie({ name, genre, rating });
	newMovie.save()
		.then(movie => {
			res.json(movie);
		})
		.catch(err => {
			res.status(422);
			res.json({ error: 'Invalid input data sent to server' });
		});
});

server.put('/movie', (req, res) => {
	const { name, genre, rating, id } = req.body;
	Movie.findById(id, (err, movie) => {
		if (err) {
			res.status(404).json({ error: 'No movie found' });
			return;
		}
		if (name) {
			movie.name = name;
		}
		if (genre) {
			movie.genre = genre;
		}
		if (rating) {
			movie.rating = rating;
		}
		movie.save()
			.then(savedMovie => {
				res.json(savedMovie);
			})
			.catch(err => {
				res.status(500).json({ error: 'Failed to update movie' });
			});
	});
});

module.exports = server;
