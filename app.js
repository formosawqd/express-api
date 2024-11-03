var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const adminAuth = require("./middlewares/admin-auth");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var adminArticlesRouter = require("./routes/admin/articles");

var adminCategoriesRouter = require("./routes/admin/categories");
var adminSettingsRouter = require("./routes/admin/settings");
var adminUsersRouter = require("./routes/admin/users");
const adminCoursesRouter = require("./routes/admin/courses");
const adminChaptersRouter = require("./routes/admin/chapters");
const adminChartsRouter = require("./routes/admin/charts");
const adminAuthRouter = require("./routes/admin/auth");

// 移动端
const mobileIndex = require("./routes/mobile/index");
const mobileCategories = require("./routes/mobile/categories");
const mobileCourses = require("./routes/mobile/courses");
var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/admin/articles", adminArticlesRouter);
app.use("/admin/categories", adminAuth, adminCategoriesRouter);
app.use("/admin/settings", adminAuth, adminSettingsRouter);
app.use("/admin/users", adminAuth, adminUsersRouter);
app.use("/admin/courses", adminAuth, adminCoursesRouter);
app.use("/admin/chapters", adminAuth, adminChaptersRouter);
app.use("/admin/charts", adminAuth, adminChartsRouter);
app.use("/admin/auth", adminAuthRouter);

// 移动端
app.use("/mobile/index", mobileIndex);
app.use("/mobile/categories", mobileCategories);
app.use("/mobile/courses", mobileCourses);
module.exports = app;
