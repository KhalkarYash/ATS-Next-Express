const adminAuth = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'hr')) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin/HR privileges required.' });
    }
};

module.exports = adminAuth;