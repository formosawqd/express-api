const express = require('express');
const router = express.Router();
const { Course, Category, User, Chapter } = require('../../models');
const { Op } = require('sequelize');
const { NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');

/**
 * 查询课程列表
 * GET /admin/articles
 */
router.get('/', async function (req, res) {
    const condition = {
        attributes: { exclude: ['CategoryId', 'UserId'] },
        include: [
            {
                model: Category,
                as: 'category',
                attributes: ['id', 'name']
            },
            {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'avatar']
            }
        ],
        order: [['id', 'DESC']],
    };

    try {
        const data = await Course.findAll(condition);
        success(res, '查询课程列表成功。', data);
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 查询课程详情
 * GET /admin/articles/:id
 */
router.get('/:id', async function (req, res) {
    try {
        const data = await getCategory(req);
        success(res, '查询课程详情成功。', data);
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 创建课程
 * POST /admin/articles
 */
router.post('/', async function (req, res) {
    try {
        const body = filterBody(req);
        // 获取当前登录的用户 ID
        body.userId = req.user.id;
        const data = await Course.create(body);
        success(res, '创建课程成功。', data, 201);
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 更新课程
 * PUT /admin/articles/:id
 */
router.put('/:id', async function (req, res) {
    try {
        const data = await getCategory(req);
        const body = filterBody(req);
        await data.update(body);
        success(res, '更新课程成功。', data);
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 删除课程
 * DELETE /admin/articles/:id
 */
router.delete('/:id', async function (req, res) {
    try {
        const data = await getCategory(req);
        await data.destroy();
        success(res, '删除课程成功。');
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 公共方法：查询当前课程
 */
async function getCategory(req) {
    const condition = {
        attributes: { exclude: ['CategoryId', 'UserId'] },
        include: [
            {
                model: Category,
                as: 'category',
                attributes: ['id', 'name']
            },
            {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'avatar']
            },
            {
                model: Chapter,
                as: 'chapters',
            },
        ],
    };

    const { id } = req.params;
    const data = await Course.findByPk(id, condition);
    if (!data) {
        throw new NotFoundError(`ID: ${id}的课程详情未找到。`)
    }
    return data;
}

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{title, content: (string|string|DocumentFragment|*)}}
 */
function filterBody(req) {
    return {
        categoryId: req.body.categoryId,
        // userId: req.body.userId,
        name: req.body.name,
        image: req.body.image,
        recommended: req.body.recommended,
        introductory: req.body.introductory,
        content: req.body.content
    };
}

module.exports = router;
