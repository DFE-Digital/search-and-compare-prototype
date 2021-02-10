const teacherTrainingService = require('../services/teacher-training')
const utils = require('../utils')()

module.exports = router => {
  router.get('/course/:providerCode/:courseCode', async (req, res) => {
    const { providerCode, courseCode } = req.params

    try {
      const courseSingleResponse = await teacherTrainingService.getCourse(providerCode, courseCode)
      const course = utils.decorateCourse(courseSingleResponse.data.attributes)
      const placementAreas = utils.getPlacementAreas(course.sites)

      res.render('course', { course, placementAreas })
    } catch (error) {
      res.render('error', {
        title: error.name,
        content: error.message
      })
    }
  })
}
