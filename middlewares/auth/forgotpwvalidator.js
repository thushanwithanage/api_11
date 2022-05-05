function validateEmail(email)
{
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
}

module.exports = function forgotpwvalidator(req, res, next)
{
    if(!req.body.email || !validateEmail(req.body.email))
    {
        return res.status(400).send("Invalid email address");
    }

    return next();
};