const express = require('express');
const {
  listCourses,
  getCourse,
  createCourse,
  deleteCourse,
  updateCourse,
} = require('../controllers/coursesController');
const storage = require('../services/storage');

const router = express.Router();

router.get('/', listCourses);
router.get('/:id', getCourse);
router.post('/', createCourse);

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Supprimer un cours
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du cours à supprimer
 *     responses:
 *       204:
 *         description: Supprimé
 *       404:
 *         description: Non trouvé
 */
router.delete('/:id', deleteCourse);

router.post('/:courseId/students/:studentId', (req, res) => {
  const { studentId, courseId } = req.params;
  const result = storage.enroll(studentId, courseId);

  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  return res.status(201).json({ success: true });
});

router.delete('/:courseId/students/:studentId', (req, res) => {
  const { studentId, courseId } = req.params;
  const result = storage.unenroll(studentId, courseId);

  if (result.error) {
    return res.status(404).json({ error: result.error });
  }

  return res.status(204).send();
});

router.put('/:id', updateCourse);

module.exports = router;
