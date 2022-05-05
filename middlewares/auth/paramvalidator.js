module.exports = function paramvalidator(req, res, next)
{
    if(!req.params.userId)
    {
        return res.status(400).send("Id parameter not found");
    }

    return next();
};