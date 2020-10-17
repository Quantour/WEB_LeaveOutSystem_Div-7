import axios from 'axios'

export default {
  async getAvailableTokens() {
    return await axios.get('/leave/dashboard/token-count')
  },
  async getLeaveCount() {
    return await axios.get('/leave/dashboard/leave-count')
  },
  async getHistroyCount() {
    return await axios.get('/leave/dashboard/leave-history-count')
  }
}
