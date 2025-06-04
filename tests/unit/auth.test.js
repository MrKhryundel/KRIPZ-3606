const { ensureAuthenticated } = require('../../middleware/auth');

describe('Auth Middleware Test', () => {
    it('should allow authenticated user', () => {
        const req = {
            session: { isAdmin: true }
        };
        const res = {};
        const next = jest.fn();

        ensureAuthenticated(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('should redirect unauthenticated user', () => {
        const req = {
            session: { isAdmin: false },
            flash: jest.fn()
        };
        const res = {
            redirect: jest.fn()
        };
        const next = jest.fn();

        ensureAuthenticated(req, res, next);
        expect(res.redirect).toHaveBeenCalledWith('/admin/login');
        expect(next).not.toHaveBeenCalled();
    });
});
