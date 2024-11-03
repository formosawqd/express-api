var express = require("express");
var router = express.Router();
const { Article } = require("../../models");
const { Op } = require("sequelize");
const { filterBody } = require("../../utils/index");
const { NotFoundError, success, failure } = require("../../utils/response");
/* GET 文章列表. */
router.get("/", async function (req, res, next) {
  try {
    const { title } = req.query;
    const currentPage = Math.abs(Number(req.query.currentPage)) || 1;
    const pageSize = Math.abs(Number(req.query.pageSize)) || 10;
    const condition = {
      order: [["id", "DESC"]],
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    };
    if (title) {
      condition.where = {
        title: {
          [Op.like]: `%${title}%`,
        },
      };
    }
    const { count, rows } = await Article.findAndCountAll(condition);
    success(res, "查询文章列表成功", {
      rows,
      pagination: {
        total: count,
        pageSize,
        currentPage,
      },
    });
  } catch (error) {
    failure(res, error);
  }
});

/* GET 文章详情. */
router.get("/:id", async function (req, res, next) {
  try {
    const article = await getArticle(req);
    if (article) {
      success(res, "查询文章详情成功", article);
    }
  } catch (error) {
    failure(res, error);
  }
});

/* GET 文章创建. */
router.post("/", async function (req, res, next) {
  try {
    const body = filterBody(req);

    const article = await Article.create(body);
    success(res, "创建文章成功", article, 201);
  } catch (error) {
    failure(res, error);
  }
});

/* GET 文章删除. */
router.delete("/:id", async function (req, res, next) {
  try {
    const article = await getArticle(req);

    if (article) {
      await article.destroy();
      success(res, "文章成功删除");
    }
  } catch (error) {
    failure(res, error);
  }
});

/* GET 文章更新内容. */
router.put("/:id", async function (req, res, next) {
  try {
    const article = await getArticle(req);

    if (article) {
      const body = filterBody(req);
      await article.update(body);
      success(res, "文章更新成功", article);
    }
  } catch (error) {
    failure(res, error);
  }
});

async function getArticle(req) {
  const { id } = req.params;
  const article = await Article.findByPk(id);

  if (!article) {
    throw new NotFoundError(`ID:${id}的文章未找到`);
  }
  return article;
}
module.exports = router;
