function validateEmail(email)
{
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
}

module.exports = function signinvalidator(req, res, next)
{
    if(!req.body.email || !validateEmail(req.body.email)){
        return res.status(400).send("Invalid email address");
    }

    if(!req.body.password || req.body.password.length <= 7){
        return res.status(400).send("Invalid password. Must be atleast 7 characters long");
    }

    return next();
};