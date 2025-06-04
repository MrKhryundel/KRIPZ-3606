const Admin = require('../../models/Admin');

describe('Admin Model Test', () => {
    it('should create valid admin', () => {
        const admin = new Admin({
            username: 'admin',
            password: 'password123'
        });

        expect(admin.username).toBe('admin');
        expect(admin.password).toBeDefined();
    });

    it('should require username', () => {
        const adminWithoutUsername = new Admin({ password: 'test123' });
        const validationError = adminWithoutUsername.validateSync();
        
        expect(validationError.errors.username).toBeDefined();
    });
});
