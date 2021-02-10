const got = require('got')
const qs = require('qs')
const CacheService = require('../services/cache.js')
const data = require('../data/session-data-defaults')

const ttl = 60 * 60 * 24 * 30 // cache for 30 days
const cache = new CacheService(ttl) // Create a new cache service instance

const teacherTrainingService = {
  async getCourses (page, perPage, filter) {
    try {
      const query = {
        filter,
        include: 'provider,accredited_body',
        page,
        per_page: perPage,
        sort: 'provider.provider_name'
      }

      const key = `courseListResponse_${page}-${perPage}-${JSON.stringify(query)}`
      const courseListResponse = await cache.get(key, async () => await got(`${data.publicApiEndpoint}/recruitment_cycles/${data.cycle}/courses/?${qs.stringify(query)}`).json())

      return courseListResponse
    } catch (error) {
      console.error(error)
    }
  },

  async getProviderCourses (page, perPage, filter, providerCode) {
    const query = {
      filter,
      include: 'provider,accredited_body',
      page,
      per_page: perPage,
      sort: 'provider.provider_name'
    }

    const key = `courseListResponse_${page}-${perPage}-${JSON.stringify(query)}`
    const courseListResponse = await cache.get(key, async () => await got(`${data.publicApiEndpoint}/recruitment_cycles/${data.cycle}/providers/${providerCode}/courses/?${qs.stringify(query)}`).json())
    return courseListResponse
  },

  async getCourse (providerCode, courseCode) {
    try {
      const key = `courseSingleResponse_${data.cycle}-${providerCode}-${courseCode}`
      const courseSingleResponse = await cache.get(key, async () => await got(`${data.privateApiEndpoint}/recruitment_cycles/${data.cycle}/providers/${providerCode}/courses/${courseCode}?include=provider,sites`).json())

      courseSingleResponse.data.attributes.provider = courseSingleResponse.included
        .filter(item => item.type === 'providers')
        .map(provider => provider.attributes)[0]

      courseSingleResponse.data.attributes.sites = courseSingleResponse.included
        .filter(item => item.type === 'sites')
        .map(site => site.attributes)

      return courseSingleResponse
    } catch (error) {
      console.error(error)
    }
  },

  async getCourseLocations (providerCode, courseCode) {
    const key = `locationListResponse_${data.cycle}-${providerCode}-${courseCode}`
    const locationListResponse = await cache.get(key, async () => await got(`${data.publicApiEndpoint}/recruitment_cycles/${data.cycle}/providers/${providerCode}/courses/${courseCode}/locations?include=course,location_status,provider`).json())
    return locationListResponse
  },

  async getProviderSuggestions (query) {
    const key = `providerSuggestionListResponse_${query}`
    const providerSuggestionListResponse = await cache.get(key, async () => await got(`${data.publicApiEndpoint}/provider_suggestions?query=${query}`).json())
    return providerSuggestionListResponse
  }
}

module.exports = teacherTrainingService
