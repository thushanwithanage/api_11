module.exports = function inputvalidator(req, res, next)
{
    if(!req.body.cname){
        return res.status(400).send("Invalid name");
    }

    if(!(req.body.gender === "Male" || req.body.gender === "Female")){
        return res.status(400).send("Invalid value for gender");
    }

    if(!req.body.description || req.body.description <= 5){
        return res.status(400).send("Invalid description. Must be atleast 5 characters long");
    }

    if(req.body.likecount !== 0){
        return res.status(400).send("Invalid like count. Must be 0");
    }

    return next();
};