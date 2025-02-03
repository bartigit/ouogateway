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

    if (!referrer || !referrer.startsWith(ALLOWED_REFERRER) || fetchSite !== "cross-site") {
        return res.status(403).send("error");
    }

    res.render("gateway");
});

app.get("/get-token", (req, res) => {
    const token = jwt.sign({ ip: req.ip }, SECRET_KEY, { expiresIn: "5m" });

    res.send(token);
})

app.get("/content", (req, res) => {
    const fetchSite = req.get("Sec-Fetch-Site");

    if (fetchSite !== "same-origin") {
        return res.status(403).send("error");
    }

    const token = req.query.token;
    if (!token) return res.status(403).send("no access");

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).send("invalid token");

        res.render("content");
    });
});

app.listen(5555, "::", () => console.log("server started on http://localhost:5555"));
