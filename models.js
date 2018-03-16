const mongoose = require('mongoose');
const { Schema } = mongoose;

const MovieSchema = new Schema({
	name: {
		required: true,
		type: String
	},
	genre: {
		required: true,
		type: String
	},
	rating: {
		required: true,
		type: String
	}
});

MovieSchema.methods.getMovieName = function() {
	return this.name;
}

MovieSchema.methods.getMovieRating = function() {
	return this.rating;
}

MovieSchema.statics.getAllMovies = (cb) => {
	Movie.find({}, (err, movies) => {
		if (err) console.log(err);
		cb(movies);
	});
}

const Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;
