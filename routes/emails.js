var keystone = require('keystone');

module.exports = {
    
    /** New Enquiry Notifications */
    
    'enquiry-notification': function(req, res, callback) {
        
        var Enquiry = keystone.list('Enquiry');
        
        var newEnquiry = new Enquiry.model({
            name: { first: 'Test', last: 'User' },
            email: 'dashamatsay@gmail.com',
            phone: '-',
            enquiryType: 'message',
            message: { md: 'Тестовое почтовое сообщение.' }
        });
        
        callback(null, {
            admin: 'Admin User',
            enquiry: newEnquiry,
            enquiry_url: '/keystone/enquiries/'
        });
        
    }
    
};
