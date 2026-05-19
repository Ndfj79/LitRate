const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.signUp = async (req, res) => {
    try{
        console.log(req.body)
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

        return res.status(201).json({ message: "Пользователь успешно зарегистрирован" });
    } catch (error) {
        console.error("Ошибка при регистрации пользователя:", error);
        return res.status(500).json({ message: "Ошибка сервера" });
    }
}

exports.login = async (req, res) => {
    try{
        const { mail, password } = req.body;
        
        if (!mail || !password) {
            return res.status(400).json({ message: "Все поля обязательны для заполнения" });
        }

        const user = await User.findOne({mail});
        if (!user){
            return res.status(400).json({ message: "Неверный email или пароль" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Неверный email или пароль" });
        }

        const token = jwt.sign(
            {
                userId: user._id, login: user.login, mail: user.mail
            },
            "1234!@#%@#!@${}SA",
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