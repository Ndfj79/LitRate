const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
      
    if (!token) {
      req.user = 'No-user';
      next();
      return;
    }

    const decoded = await jwt.verify(token, process.env.JWT_KEY);
    if (!decoded) {
      throw new Error();
    }

    req.user = decoded;
    next();

} catch(error){
    res.clearCookie('token');
    console.log(error)
    return res.status(401).redirect('/');
    }
};

