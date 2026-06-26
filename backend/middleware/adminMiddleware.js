const adminMiddleware = (req, res, next) => {

    console.log("REQ.USER =", req.user);

    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            message: "Admin access required"
        });
    }

    next();
};

module.exports = adminMiddleware;