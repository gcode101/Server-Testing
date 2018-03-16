const mongoose = require('mongoose');

const Movie = require('./models');

const chai = require('chai');
const chaihttp = require('chai-http');
const { expect } = chai;
const sinon = require('sinon');

const server = require('./server');
chai.use(chaihttp);

describe('Server', () => {

	let testMovie1 = null, testMovie2 = null;
	let testMovie1_id = null, testMovie2_id = null;

	before((done) => {
		mongoose.connect('mongodb://localhost/test');
		const db = mongoose.connection;
		db.on('error', () => console.error('connection error'));
		db.once('open', () => {
			console.log('database connected');
		});
		done();
	});

	after((done) => {
		const db = mongoose.connection;
		db.dropDatabase(() => {
			mongoose.connection.close(done);
		});
		done();
	});

	beforeEach((done) => {
		const movie1 = new Movie({
				name: 'The Matrix',
				genre: 'Science Fiction',
				rating: '8.7/10'
		});
		const movie2 = new Movie({
				name: 'The Terminator',
				genre: 'Science Fiction',
				rating: '8/10'
		});
		movie1.save()
			.then(movie => {
				testMovie1 = movie;
				testMovie1_id = movie._id;
			})
			.catch(err => {
				console.error('Error saving movie1');
			});
		movie2.save()
			.then(movie => {
				testMovie2 = movie;
				testMovie2_id = movie._id;
			})
			.catch(err => {
				console.error('Error saving movie2');
			});
			done();
	});

	afterEach((done) => {
		Movie.remove({}, err => {
			if (err) console.error('Error removing test data');
		});
		done();
	});

	describe('[POST] /movies', () => {
		it('should add a new movie', (done) => {
			const newMovie = {
				name: 'The Matrix',
				genre: 'Science Fiction',
				rating: '8.7/10'
			};
			chai.request(server)
				.post('/movies')
				.send(newMovie)
				.end((err, res) => {
					expect(res.status).to.equal(200);
					expect(res.body.name).to.equal('The Matrix');
				});
				done();
		})
		it('should send back a 422 for bad data', (done) => {
			const newMovie = {
				name: 'The Matrix',
				type: 'Science Fiction',
				rating: '8.7/10'
			};
			chai.request(server)
				.post('/movies')
				.send(newMovie)
				.end((err, res) => {
					if (err) {
						const expected = 'Invalid input data sent to server';
						expect(err.status).to.equal(422);
						const { error } = err.response.body;
						expect(error).to.equal(expected);
					}
				});
				done();
		});
	});

	describe('[GET] /movies', () => {
		it('should return all movies in the database', (done) => {
			chai.request(server)
				.get('/movies')
				.end((err, res) => {
					expect(res.status).to.equal(200);
					expect(res.body[0]).to.equal(testMovie1);
					expect(res.body[1]).to.equal(testMovie2);
					expect(res.body[0]._id).to.equal(testMovie1_id);
					expect(res.body[1]._id).to.equal(testMovie2_id);
				});
				done();
		});
	})

	describe('[PUT] /movie', () => {
		it('should update a movie', (done) => {
			const updatedMovieName = 'Constantine'
			const updatedMovieGenre = 'Fiction'
			const updatedMovie = {
				id: testMovie1_id,
				name: updatedMovieName,
				genre: updatedMovieGenre,
				rating: '5.6/10'
			};
			chai.request(server)
				.put('/movie')
				.send(updatedMovie)
				.end((err, res) => {
					expect(res.body.name).to.equal(updatedMovieName);
					expect(res.body.genre).to.equal(updatedMovieGenre);
				});
				done();
		});
		it('should return a status of 404 for a nonexistent band', (done) => {
			const updatedMovie = {
				id: -1,
				name: 'Training Day',
				genre: 'Drama',
				rating: '7.8/10'
			};
			chai.request(server)
				.put('/band')
				.send(updatedMovie)
				.end((err, res) => {
					expect(err.status).to.equal(404);
				});
				done();
		});
	});

});
