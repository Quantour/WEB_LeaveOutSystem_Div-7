<template>
  <div>
    <CurrentLocation :location="location"></CurrentLocation>
    <v-row>
      <!-- 현재 보유한 출타 -->
      <v-col cols="4">
        <v-card>
          <v-tabs v-model="currentType">
            <v-tab>휴가</v-tab>
            <v-tab>외출</v-tab>
            <v-tab>외박</v-tab>
          </v-tabs>
          <KindFilter v-model="kindFilterOptions" />
        </v-card>
        <template v-if="availableLoading">
          <v-skeleton-loader
            v-for="i in 4"
            class="mb-3"
            type="article, actions"
            :key="`loader-${i}`"
          ></v-skeleton-loader>
        </template>
        <v-tabs-items v-else v-model="currentType">
          <v-tab-item
            v-for="typ of availableTypes"
            :key="`leave-tab-${typ.value}`"
            class="pa-2"
          >
            <v-card
              outlined
              v-for="(item, idx) of currentAvailables[typ.value]"
              :key="idx"
              class="mb-2"
            >
              <v-card-title> {{ item.kind }} {{ item.type }} </v-card-title>
              <v-card-text>
                <div v-if="item.type === '휴가'">{{ item.amount }}일</div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="clickApplyLeave(item)">사용하기</v-btn>
              </v-card-actions>
            </v-card>
          </v-tab-item>
          <!-- <v-tab-item>asdf</v-tab-item>
          <v-tab-item>asdf</v-tab-item> -->
        </v-tabs-items>
      </v-col>

      <!-- 휴가 신청 전 선택 -->
      <v-col>
        <v-toolbar flat>
          <v-toolbar-title>
            {{ availableTypes[currentType].value }} 신청
          </v-toolbar-title>
          <v-spacer />
        </v-toolbar>
        <v-sheet class="pa-3 mb-2">
          <DateRangeSelect
            v-if="totalApplyLength[availableTypes[currentType].value] > 0"
            v-model="applyPlan"
            :length="totalApplyLength[availableTypes[currentType].value]"
            :type="availableTypes[currentType].value"
            :range="availableTypes[currentType].value === '휴가'"
          />
          <v-btn
            :disabled="totalApplyLength[availableTypes[currentType].value] < 1"
            color="primary"
            @click="applyLeave(availableTypes[currentType].value)"
            >신청하기</v-btn
          >
        </v-sheet>
        <v-alert
          v-model="successAlert"
          dense
          text
          type="success"
          transition="fade-transition"
        >
          신청 되었습니다.
        </v-alert>
        <v-card
          outlined
          v-for="(item, idx) of applyList[availableTypes[currentType].value]"
          :key="`apply-card-${idx}`"
          class="mb-2"
        >
          <v-toolbar flat>
            <v-toolbar-title>{{ item.kind }} {{ item.type }}</v-toolbar-title>
            <v-spacer />
            <v-btn fab text @click="deleteFromApplyList(idx, item.type)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <div v-if="item.type === '휴가'">{{ item.amount }}일</div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="4"> </v-col>
    </v-row>
  </div>
</template>
<script>
import CurrentLocation from '../../components/myleave/CurrentLocation.vue'
import KindFilter from '../../components/myleave/KindFilter.vue'
import DateRangeSelect from '../../components/DateRangeSelect.vue'
import leaveAPI from '../../services/leave'
import { format } from 'date-fns'

export default {
  components: {
    CurrentLocation,
    KindFilter,
    DateRangeSelect
  },
  data: () => ({
    availables: [],
    availableLoading: false,
    kindFilterOptions: [],
    currentType: 0,
    applyList: {},
    applyPlan: {
      departure: format(new Date(), 'yyyy-MM-dd')
    },
    successAlert: false
  }),
  computed: {
    location: () => [
      { text: '대시보드', path: '/myleave' },
      { text: '사용 가능 출타', path: '/myleave/leave-available' }
    ],
    availableTypes: () => [
      { value: '휴가' },
      { value: '외출' },
      { value: '외박' }
    ],

    currentAvailables() {
      const ret = {}

      for (const item of this.availables) {
        ret[item.type] = ret[item.type] || []
        if (this.kindFilterOptions.includes(item.kind)) {
          ret[item.type].push(item)
        }
      }

      return ret
    },
    currentVacations() {
      return this.availables.filter(ava => ava.type === '휴가')
    },
    // 선택한 휴가의 총 일수
    totalApplyLength() {
      const ret = {}
      for (const type of this.availableTypes) {
        ret[type.value] = (
          (this.applyList && this.applyList[type.value]) ||
          []
        ).reduce((sum, { amount }) => sum + amount, 0)
      }
      return ret
    }
  },
  methods: {
    async loadAvailables() {
      this.availableLoading = true
      const res = await leaveAPI.getAvailables()
      this.availables = res.data
      this.availableLoading = false
    },
    clickApplyLeave(item) {
      // if (!this.applyList[item.type]) {
      //   this.applyList[item.type] = []
      // }
      if (!this.applyList[item.type]) {
        this.$set(this.applyList, item.type, [])
      }
      if (!this.applyList[item.type].includes(item)) {
        this.applyList[item.type] = [...this.applyList[item.type], item]
      }
    },
    deleteFromApplyList(idx, type) {
      this.applyList[type].splice(idx, 1)
    },
    showSuccessAlert() {
      this.successAlert = true
      setTimeout(() => {
        this.successAlert = false
      }, 2500)
    },
    async applyLeave(type) {
      if (type === '휴가') {
        if (
          await this.$confirm(
            `총 ${this.totalApplyLength['휴가'] - 1}박 ${
              this.totalApplyLength['휴가']
            }일의 휴가를 신청하시겠습니까?`,
            {
              color: 'primary',
              title: '휴가 신청',
              buttonTrueColor: 'primary'
            }
          )
        ) {
          this.loading = true
          this.$store.dispatch('startAppLoading')

          await leaveAPI.applyLeave(
            this.applyPlan.departure,
            this.applyList['휴가'].map(app => app._id)
          )
          this.$store.dispatch('endAppLoading')
          this.$set(this.applyList, '휴가', [])
        }
      } else if (type === '외출') {
        if (
          await this.$confirm(`외출을 신청하시겠습니까?`, {
            color: 'primary',
            title: '외출 신청',
            buttonTrueColor: 'primary'
          })
        ) {
          this.loading = true
          this.$store.dispatch('startAppLoading')

          await leaveAPI.applyLeave(
            this.applyPlan.departure,
            this.applyList['외출'].map(app => app._id)
          )
          this.$store.dispatch('endAppLoading')
          this.$set(this.applyList, '외출', [])
        }
      } else if (type === '외박') {
        if (
          await this.$confirm(`외박을 신청하시겠습니까?`, {
            color: 'primary',
            title: '외박 신청',
            buttonTrueColor: 'primary'
          })
        ) {
          this.loading = true
          this.$store.dispatch('startAppLoading')

          await leaveAPI.applyLeave(
            this.applyPlan.departure,
            this.applyList['외박'].map(app => app._id)
          )
          this.$store.dispatch('endAppLoading')
          this.$set(this.applyList, '외박', [])
        }
      }
      this.showSuccessAlert()
    }
  },
  async created() {
    this.$store.dispatch('startAppLoading')
    await this.loadLeaves()
    this.$store.dispatch('endAppLoading')
  }
}
</script>
