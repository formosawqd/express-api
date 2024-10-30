var express = require('express');
var router = express.Router();
const { Article } = require('../../models');
const { Op } = require('sequelize');

/* GET 文章列表. */
router.get('/', async function (req, res, next) {
    try {
        const { title } = req.query
        const currentPage = Math.abs(Number(req.query.currentPage)) || 1
        const pageSize = Math.abs(Number(req.query.pageSize)) || 10
        const condition = {
            order: [['id', 'ASC']],
            limit: pageSize,
            offset: (currentPage - 1) * pageSize
        }
        if (title) {
            condition.where = {
                title: {
                    [Op.like]: `%${title}%`
                }
            }
        }
        const { count, rows } = await Article.findAndCountAll(condition)
        res.json({
            status: true,
            message: '查询文章列表成功',
            data: {
                rows,
                pagination: {
                    total: count,
                    pageSize,
                    currentPage
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            status: true,
            message: '查询文章列表失败',
            error:
                [error.message]
        });
    }

});

/* GET 文章详情. */
router.get('/:id', async function (req, res, next) {
    try {
        const { id } = req.params
        const data = await Article.findByPk(id)
        if (data) {
            res.json({
                status: true,
                message: '查询文章详情成功',
                data:
                    data
            });
        } else {
            res.status(404).json({
                status: false,
                message: '文章未找到',

            });
        }
    } catch (error) {
        res.status(500).json({
            status: true,
            message: '查询文章列表失败',
            error:
                [error.message]
        });
    }

});

/* GET 文章创建. */
router.post('/', async function (req, res, next) {
    try {
        const body = {
            title: req.body.title,
            content: req.body.content
        }
        const article = await Article.create(body)
        res.status(201).json({
            status: true,
            message: '创建文章成功',
            data: article

        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: '创建文章失败',
            data:
                [error.message]
        });
    }

});

/* GET 文章删除. */
router.delete('/:id', async function (req, res, next) {
    try {
        const { id } = req.params
        const article = await Article.findByPk(id)
        if (article) {
            await article.destroy()
            res.json({
                status: true,
                message: '文章成功删除',
            })
        } else {
            res.status(404).json({
                status: false,
                message: '文章未找到',

            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: '文章删除失败',
            data:
                [error.message]
        });
    }

});

/* GET 文章更新内容. */
router.put('/:id', async function (req, res, next) {
    try {
        const { id } = req.params
        const article = await Article.findByPk(id)
        if (article) {
            const body = {
                title: req.body.title,
                content: req.body.content,
            }
            await article.update(body)
            res.json({
                status: true,
                message: '更新成功',
                data: article
            });
        } else {
            res.status(404).json({
                status: false,
                message: '文章未找到',

            });
        }
    } catch (error) {
        res.status(500).json({
            status: true,
            message: '更新失败',
            error:
                [error.message]
        });
    }

});
module.exports = router;
