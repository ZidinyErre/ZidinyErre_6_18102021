const rateLimit = require('express-rate-limit');
const User = require('../models/User');


exports.limiterLogin = (req, res, next) => {
    User.findOne({email: req.body.email}),{
        const limiter = rateLimit({
            windowMs : 15 * 60 * 1000,
             max : 100,
         }),
    }

    .then(() => res.status(200).json({ message: "Ok" }))
    .catch(error => res.status(400).json({ error }));
};

// const limiter = rateLimit({
//     windowMs : 15 * 60 * 1000,
//     max : 100,
// });

// const limiter = rateLimit({
//     windowMs : 1000,
//     max : 1,
// });

// exports.limiterLogin = () => {
//      rateLimit({
//             windowMs : 15 * 60 * 1000,
//             max : 100,
//         });
    
// };