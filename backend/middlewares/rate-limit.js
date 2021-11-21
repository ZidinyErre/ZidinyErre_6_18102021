const rateLimit = require('express-rate-limit');

// const limiter = rateLimit({
//     windowMs : 15 * 60 * 1000,
//     max : 100,
// });

// const limiter = rateLimit({
//     windowMs : 1000,
//     max : 1,
// });

exports.limiterLogin = () => {
     rateLimit({
            windowMs : 15 * 60 * 1000,
            max : 100,
        });
    
};