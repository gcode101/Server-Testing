const mongoose = require('mongoose');


const Movie = require('./models');

const chai = require('chai');
const { expect } = chai;
const sinon = require('sinon');

describe('Movies', () => {

	before((done) => {
		mongoose.connect('mongodb:/localhost/test');
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

	describe('getMovieName', () => {
		it('should return the name of the movie', () => {
			const movie = new Movie({
				name: 'The Matrix',
				genre: 'Science Fiction',
				rating: '8.7/10'
			});
			const name = movie.getMovieName();
			expect(name).to.equal('The Matrix');
		});
	});

	describe('getMovieRating', () => {
		it('should return the movie\'s rating', () => {
			const movie = new Movie({
				name: 'The Matrix',
				genre: 'Science Fiction',
				rating: '8.7/10'
			});
			const rating = movie.getMovieRating();
			expect(rating).to.equal('8.7/10');
		});
	});

	describe('getAllMovies', () => {
		it('should return all movies', () => {
			sinon.stub(Movie, 'find');
			Movie.find.yields(null, [
				{ name: 'The Matrix', genre: 'Science Fiction', rating: '8.7/10' },
				{ name: 'The Terminator', genre: 'Science Fiction', rating: '8/10' }
			]);
			Movie.getAllMovies((movies) => {
				expect(movies.length).to.equal(2);
				expect(movies[1].name).to.equal('The Terminator');
				Movie.find.restore();
			});
		});
	});

})
