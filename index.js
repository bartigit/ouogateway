const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
const SECRET_KEY = "gfgfklgfkgfkgfkfgkjgfkjgfjkgfjkgjfkjgkdwjkdsa,mcd,smv,smfmdmf,mfd,samdlksakledwaoirjwoakeowakoepwakfdxlkflsdklfdklreksldelwklsdkfkdlkfldklrekore3owkfdslf;aq;l4kl;34klek4lkldfkldklfdkll";
const ALLOWED_REFERRER = "https://ouo.io";

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

app.get("/get-token", (req, res) => {
    const jsHeader = req.get("X-JS-Enabled");

    if (!jsHeader || jsHeader !== "true") {
        return res.redirect("https://ouo.io/jIcX4m");
    }
    
    const token = jwt.sign({ ip: req.ip }, SECRET_KEY, { expiresIn: "5m" });

    res.send(token);
})

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
