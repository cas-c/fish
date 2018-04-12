const catchAsync = fn => (
    (req, res, next) => {
        const routePromise = fn(req, res, next);
        if (routePromise.catch) {
            routePromise.catch(err => next(err));
        }
    }
);

const getBearerToken = header => header.match(/Bearer\s((.*)\.(.*)\.(.*))/)[1];

module.exports = {
    catchAsync,
    getBearerToken
};
