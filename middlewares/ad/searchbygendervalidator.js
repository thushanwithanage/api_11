module.exports = function searchbygendervalidator(req, res, next)
{
    if(!req.query.cgender || req.query.cgender !== "Male" || req.query.cgender !== "Female")
    {
        return res.status(400).send("Search parameter not found or is invalid");
    }

    return next();
};