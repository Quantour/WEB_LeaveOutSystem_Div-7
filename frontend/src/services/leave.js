import axios from 'axios'

export default {
  async getAvailables() {
    return await axios.get('/leave/available')
  },
  async applyLeave(departure, tokens) {
    return await axios.post('/leave/apply', { departure, tokens })
  },
  async adminGetApplies() {
    return await axios.get('/leave/admin/apply')
  },
  async adminDecideApply(apply, status) {
    return await axios.post('/leave/admin/decide', { apply, status })
  }
}
