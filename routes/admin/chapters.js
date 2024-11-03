const express = require('express');
const router = express.Router();
const { Chapter, Course } = require('../../models');
const { Op } = require('sequelize');
const { NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');


/**
 * 查询章节列表
 * GET /admin/users
 */
router.get('/', async function (req, res) {
    try {
        const condition = {
            order: [['id', 'DESC']],
        };
        const { count, rows } = await Chapter.findAndCountAll(condition);
        success(res, '查询文章列表成功。',
            rows
        );
    } catch (error) {
        failure(res, error);
    }
});


// 详情
router.get('/:id', async function (req, res) {
    try {
        const data = await getChapters(req);
        success(res, '查询用户详情成功。', data);
    } catch (error) {
        failure(res, error);
    }
});


/**
 * 公共方法：查询当前章节
 */
async function getChapters(req) {
    const { id } = req.params;
    const condition = {
        attributes: { exclude: ['CourseId'] },
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'name']
          }
        ]
    }
    const data = await Chapter.findByPk(id, condition);
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
