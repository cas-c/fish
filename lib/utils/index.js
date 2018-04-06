const catchAsync = fn => (
    (req, res, next) => {
        const routePromise = fn(req, res, next);
        if (routePromise.catch) {
            routePromise.catch(err => next(err));
        }
    }
);

const createAvatarUrl = (id, av) => `https://cdn.discordapp.com/avatars/${id}/${av}.webp`;

module.exports = {
    catchAsync,
    createAvatarUrl
};
