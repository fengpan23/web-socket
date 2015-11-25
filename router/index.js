module.exports = function(router){
	console.log(router);
	router.route('/connet')
	.post(function(req, res){
		console.log('req');
	})
	.get(function(req, res){
		console.log('req');
	})
};
