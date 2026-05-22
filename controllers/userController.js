const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.signUp = async (req, res) => {
    try{
        const { login, mail, password } = req.body;

        if (!mail || !login || !password) {
            return res.status(400).json({ message: "Все поля обязательны для заполнения" });
        }

        const existingUser = await User.findOne({mail});
        if (existingUser) {
            return res.status(400).json({ message: "Пользователь с таким email уже существует" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            mail,
            login,
            password: hashedPassword
        });

        await newUser.save();

        return res.redirect('/signin');
    } catch (error) {
        console.error("Ошибка при регистрации пользователя:", error);
        return res.redirect("/");
    }
}

exports.login = async (req, res) => {
    try{
        const { mail, password } = req.body;
        
        if (!mail || !password) {
            res.clearCookie('mail');
            res.clearCookie('token');
            res.redirect("/signin");
        }

        const user = await User.findOne({mail});
        if (!user){
            res.clearCookie('mail');
            res.clearCookie('token');
            res.redirect("/signin");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            res.clearCookie('mail');
            res.clearCookie('token');
            res.redirect("/signin");
        }

        const token = jwt.sign(
            {
                userId: user._id, login: user.login, mail: user.mail
            },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
        );

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 3600000
        });
        res.cookie('mail', user.mail, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 3600000
        });

        res.redirect('/');
    } catch (error) {
        console.error("Ошибка при входе пользователя:", error);
        return res.status(500).json({ message: "Ошибка сервера" });
        
    }
}