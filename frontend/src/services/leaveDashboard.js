import axios from 'axios'

export default {
  async getAvailableTokens() {
    return await axios.get('/leave/dashboard/token-count')
  },
  async getLeaveCount() {
    return await axios.get('/leave/dashboard/leave-count')
  },
  async getHistoryCount() {
    return await axios.get('/leave/dashboard/leave-history-count')
  },
  async getLeaveStat() {
    return await axios.get('/leave/dashboard/leave-stat')
  }
}
