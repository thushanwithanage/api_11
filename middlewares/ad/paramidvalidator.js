module.exports = function paramidvalidator(req, res, next)
{
    if(!req.params.catId)
    {
        return res.status(400).send("Id parameter not found");
    }

    return next();
};