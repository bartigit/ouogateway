const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
const SECRET_KEY = "gfgfklgfkgfkgfkfgkjgfkjgfjkgfjkgjfkjgkdwjkdsa,mcd,smv,smfmdmf,mfd,samdlksakledwaoirjwoakeowakoepwakfdxlkflsdklfdklreksldelwklsdkfkdlkfldklrekore3owkfdslf;aq;l4kl;34klek4lkldfkldklfdkll";
const ALLOWED_REFERRER = "https://ouo.io";
const RECAPTCHA_SECRET = "6LeyIMwqAAAAAJTcDpzxf0eFWBdv0Vc85Vcxauu1";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next) => {
    console.log("🔍 Wszystkie nagłówki:", req.headers);
    next();
});

app.get("/gateway", (req, res) => {
    const fetchSite = req.get("Sec-Fetch-Site");
    const referrer = req.get("Referer") || req.get("Referrer");

    if (!referrer || (!referrer.startsWith("https://ouo.io") && !referrer.startsWith("https://ouo.press")) || fetchSite !== "cross-site") {
        return res.redirect("https://ouo.io/jIcX4m");
    }

    res.render("gateway");
});

app.post("/get-token", async (req, res) => {
    const recaptchaResponse = req.body["g-recaptcha-response"];

    if (!recaptchaResponse) {   
        return res.redirect("https://ouo.io/jIcX4m");        
    }

    try {
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
            params: {
                secret: RECAPTCHA_SECRET,
                response: recaptchaResponse,
            },
        });

        if (!response.data.success) {
            return res.redirect("https://ouo.io/jIcX4m");
        }

        const token = jwt.sign({ ip: req.ip }, SECRET_KEY, { expiresIn: "5m" });

        return res.json({ token });

    } catch (error) {
        console.error("Błąd weryfikacji reCAPTCHA:", error);
        return res.status(500).json({ error: "Błąd serwera reCAPTCHA." });
    }
});

app.get("/content", (req, res) => {
    const fetchSite = req.get("Sec-Fetch-Site");

    if (fetchSite !== "same-origin") {
        return res.redirect("https://ouo.io/jIcX4m");
    }

    const token = req.query.token;
    if (!token) return res.redirect("https://ouo.io/jIcX4m");


    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.redirect("https://ouo.io/jIcX4m");


        res.render("content");
    });
});

app.listen(5555, "::", () => console.log("server started on http://localhost:5555"));
