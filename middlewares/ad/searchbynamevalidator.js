module.exports = function searchbynamevalidator(req, res, next)
{
    if(!req.query.cname)
    {
        return res.status(400).send("Search parameter not found");
    }

    return next();
};