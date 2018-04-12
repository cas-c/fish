const catchAsync = fn => (
    (req, res, next) => {
        const routePromise = fn(req, res, next);
        if (routePromise.catch) {
            routePromise.catch(err => next(err));
        }
    }
);

const createAvatarUrl = (id, av) => `https://cdn.discordapp.com/avatars/${id}/${av}.png`;

const getBearerToken = header => header.match(/Bearer\s((.*)\.(.*)\.(.*))/)[1];

module.exports = {
    catchAsync,
    createAvatarUrl,
    getBearerToken
};
