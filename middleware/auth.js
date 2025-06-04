const ensureAuthenticated = (req, res, next) => {
    if (req.session.isAdmin) {
        return next();
    }    req.flash('error_msg', 'Будь ласка, увійдіть в систему для доступу до панелі адміністратора');
    res.redirect('/admin/login');
};

module.exports = {
    ensureAuthenticated
};
