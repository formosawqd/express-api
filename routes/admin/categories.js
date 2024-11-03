const express = require('express');
const router = express.Router();
const { Category, Course } = require('../../models');
const { Op } = require('sequelize');
const { NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');


/**
 * 查询文章列表
 * GET /admin/articles
 */
router.get('/', async function (req, res) {
    try {
        const data = await Category.findAll();
        success(res, '查询分类列表成功。', data);
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 查询文章详情
 * GET /admin/articles/:id
 */
router.get('/:id', async function (req, res) {
    try {
        const data = await getCategory(req);
        success(res, '查询分类详情成功。', data);
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 创建文章
 * POST /admin/articles
 */
router.post('/', async function (req, res) {
    try {
        const body = filterBody(req);

        const data = await Category.create(body);
        success(res, '创建分类成功。', data, 201);
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 更新文章
 * PUT /admin/articles/:id
 */
router.put('/:id', async function (req, res) {
    try {
        const data = await getCategory(req);
        const body = filterBody(req);
        await data.update(body);
        success(res, '更新分类成功。', data);
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 删除文章
 * DELETE /admin/articles/:id
 */
router.delete('/:id', async function (req, res) {
    try {
        const data = await getCategory(req);

        const count = await Course.count({ where: { categoryId: req.params.id } });

        if (count > 0) {
            throw new Error('当前分类有课程，无法删除。');
        }
        await data.destroy();
        success(res, '删除分类成功。');
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 公共方法：查询当前文章
 */
/**
 * 公共方法：查询当前分类
 */
async function getCategory(req) {
    const { id } = req.params;
    const condition = {
        include: [
            {
                model: Course,
                as: 'courses',
            },
        ]
    }

    const category = await Category.findByPk(id, condition);
    if (!category) {
        throw new NotFoundError(`ID: ${id}的分类未找到。`)
    }

    return category;
}


/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{title, content: (string|string|DocumentFragment|*)}}
 */
function filterBody(req) {
    return {
        name: req.body.name,
        rank: req.body.rank
    };
}

module.exports = router;
