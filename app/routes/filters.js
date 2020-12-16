const filters = require('../filters')()

const backLink = {
  text: 'Back to search results',
  href: '/results'
}

module.exports = router => {
  // Location
  router.get('/results/filters/location', (req, res) => {
    const { selectedLocation } = req.session.data

    res.render('filters/location', { backLink, selectedLocation })
  })

  // Qualification
  router.get('/results/filters/qualification', (req, res) => {
    const { qualificationOptions, qualification } = req.session.data

    const items = qualificationOptions.map(option => {
      return {
        value: option.value,
        text: option.text,
        label: { classes: 'govuk-label--s' },
        hint: { text: filters.markdown(option.hint) },
        checked: qualification.includes(option.value)
      }
    })

    res.render('filters/qualification', { backLink, items })
  })

  // Salary
  router.get('/results/filters/salary', function (req, res) {
    const { salaryOptions, salary } = req.session.data

    const items = salaryOptions.map(option => {
      return {
        value: option.value,
        text: option.text,
        checked: salary === option.value
      }
    })

    res.render('filters/salary', { backLink, items })
  })

  // Subject/SEND
  router.get('/results/filters/subject', function (req, res) {
    const { subjectOptions, selectedSendOption, selectedSubjectOption, levels } = req.session.data
    const allSubjects = subjectOptions.map(option => option.value)
    const selectedSubjects = selectedSubjectOption || allSubjects

    const groups = levels.map(level => {
      return {
        text: level.text,
        items: subjectOptions.filter(subject => subject.type === level.value).map(option => ({
          value: option.value,
          id: option.name ? `subject-${option.name}` : `subject-${option.value}`,
          name: option.name || 'subject',
          text: option.text,
          label: { classes: 'govuk-label--s' },
          hint: { text: option.hint },
          checked: option.name === 'send' ? (selectedSendOption === true) : selectedSubjects.includes(option.value)
        }))
      }
    })

    res.render('filters/subject', { backLink, groups })
  })

  // Study type
  router.get('/results/filters/study-type', function (req, res) {
    const { studyTypeOptions, studyType } = req.session.data

    const items = studyTypeOptions.map(option => {
      return {
        value: option.value,
        text: option.text,
        label: { classes: 'govuk-label--s' },
        hint: { text: option.hint },
        checked: studyType.includes(option.value)
      }
    })

    res.render('filters/study-type', { backLink, items })
  })

  // Vacancies
  router.get('/results/filters/vacancy', function (req, res) {
    const { vacancyOptions, vacancy } = req.session.data

    const items = vacancyOptions.map(option => {
      return {
        value: option.value,
        text: option.text,
        checked: vacancy === option.value
      }
    })

    res.render('filters/vacancy', { backLink, items })
  })
}
