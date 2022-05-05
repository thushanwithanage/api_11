module.exports = function updatevalidator(req, res, next)
{
    if(!req.body.cname){
        return res.status(400).send("Invalid name");
    }

    if(!req.body.description || req.body.description <= 5){
        return res.status(400).send("Invalid description. Must be atleast 5 characters long");
    }

    return next();
};