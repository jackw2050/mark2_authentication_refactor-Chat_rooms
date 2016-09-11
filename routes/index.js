module.exports = function(app, passport) {


	app.get('/', function(req, res) {
		res.render('index');
	});

	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('mark', {
			user : req.user
		});
	});


	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

		app.get('/login', function(req, res) {
			res.render('login', { message: req.flash('loginMessage') });
		});


		app.post('/login', passport.authenticate('local-login', {
			successRedirect : '/profile',
			failureRedirect : '/login',
			failureFlash : true
		}));


		app.get('/signup', function(req, res) {
			res.render('signup', { message: req.flash('loginMessage') });
		});


		app.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/profile',
			failureRedirect : '/signup',
			failureFlash : true
		}));

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
	}
}
