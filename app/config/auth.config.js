const jwt_secret = process.env['jwt_secret'];

module.exports = {
    secret: jwt_secret,
};