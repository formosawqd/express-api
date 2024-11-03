const express = require('express');
const router = express.Router();
const { User, Course } = require('../../models');
const { Op } = require('sequelize');
const { NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');


/**
 * 查询用户列表
 * GET /admin/users
 */
router.get('/', async function (req, res) {
    try {
        const query = req.query;
        const currentPage = Math.abs(Number(query.currentPage)) || 1;
        const pageSize = Math.abs(Number(query.pageSize)) || 10;
        const offset = (currentPage - 1) * pageSize;

        const condition = {
            order: [['id', 'DESC']],
            limit: pageSize,
            offset: offset
        };

        if (query.username) {
            condition.where = {
                username: {
                    [Op.like]: `%${query.username}%`
                }
            };
        }

        const { count, rows } = await User.findAndCountAll(condition);
        success(res, '查询文章列表成功。', {
            articles: rows,
            pagination: {
                total: count,
                currentPage,
                pageSize,
            }
        });
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 查询用户详情
 * GET /admin/user/:id
 */
router.get('/:id', async function (req, res) {
    try {
        const data = await getUser(req);
        success(res, '查询用户详情成功。', data);
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 创建用户
 * POST /admin/user
 */
router.post('/', async function (req, res) {
    try {
        const body = filterBody(req);

        const data = await User.create(body);
        success(res, '创建用户成功。', data, 201);
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
        const data = await getUser(req);
        const body = filterBody(req);
        await data.update(body);
        success(res, '更新用户信息成功。', data);
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
        const data = await getUser(req);
        await data.destroy();
        success(res, '删除用户成功。');
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 公共方法：查询当前文章
 */
async function getUser(req) {
    const { id } = req.params;
    const condition = {
        include: [
            {
                model: Course,
                as: 'courses',
            },
        ]
    }
    const data = await User.findByPk(id, condition);
    if (!data) {
        throw new NotFoundError(`ID: ${id}的分类详情未找到。`)
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
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        nickname: req.body.nickname,
        sex: req.body.sex,
        company: req.body.company,
        introduce: req.body.introduce,
        role: req.body.role,
        avatar: req.body.avatar
    };
}

module.exports = router;
