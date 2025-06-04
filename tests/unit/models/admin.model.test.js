const mongoose = require('mongoose');
const Admin = require('../../../models/Admin');

describe('Admin Model Test', () => {
    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
    });

    it('should create & save admin successfully', async () => {
        const validAdmin = new Admin({
            username: 'testadmin',
            password: 'testpassword123'
        });
        const savedAdmin = await validAdmin.save();
        
        expect(savedAdmin._id).toBeDefined();
        expect(savedAdmin.username).toBe(validAdmin.username);
        expect(savedAdmin.password).not.toBe('testpassword123'); // password should be hashed
    });

    it('should fail to save admin without required fields', async () => {
        const adminWithoutRequiredField = new Admin({ username: 'testadmin' });
        let err;
        
        try {
            await adminWithoutRequiredField.save();
        } catch (error) {
            err = error;
        }
        
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });

    it('should correctly compare passwords', async () => {
        const admin = new Admin({
            username: 'testadmin2',
            password: 'testpassword123'
        });
        await admin.save();

        const validPassword = await admin.comparePassword('testpassword123');
        const invalidPassword = await admin.comparePassword('wrongpassword');

        expect(validPassword).toBe(true);
        expect(invalidPassword).toBe(false);
    });
});
