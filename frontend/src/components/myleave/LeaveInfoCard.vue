<template>
  <v-card outlined v-if="leave">
    <v-row v-if="leave.tokens[0].type === '휴가'" no-gutters class="pa-3">
      <v-col cols="2">휴가</v-col>
      <v-col cols="6"
        >{{ leave.startDate | formatDate }} ~
        {{ leave.endDate | formatDate }} ({{ leave.length - 1 }}박
        {{ leave.length }}일)</v-col
      >
      <v-col cols="4" class="d-flex">
        <v-tooltip
          bottom
          v-for="token of leave.tokens"
          :key="`leave-${leave._id}-${token._id}`"
          :disabled="!token.reason"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-chip
              class="mr-2"
              dense
              color="primary"
              outlined
              v-bind="attrs"
              v-on="on"
            >
              {{ token.kind }} {{ token.amount }}일
            </v-chip>
          </template>
          <span>{{ token.reason }}</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-row v-if="leave.tokens[0].type === '외출'" no-gutters class="pa-3">
      <v-col cols="2">외출</v-col>
      <v-col cols="6">{{ leave.startDate | formatDate }}</v-col>
      <v-col cols="4" class="d-flex">
        <v-tooltip
          bottom
          v-for="token of leave.tokens"
          :key="`leave-${leave._id}-${token._id}`"
          :disabled="!token.reason"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-chip
              class="mr-2"
              dense
              color="primary"
              outlined
              v-bind="attrs"
              v-on="on"
            >
              {{ token.kind }}
            </v-chip>
          </template>
          <span>{{ token.reason }}</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-row v-if="leave.tokens[0].type === '외박'" no-gutters class="pa-3">
      <v-col cols="2">외박</v-col>
      <v-col cols="6"
        >{{ leave.startDate | formatDate }} ~
        {{ leave.endDate | formatDate }}</v-col
      >
      <v-col cols="4" class="d-flex">
        <v-tooltip
          bottom
          v-for="token of leave.tokens"
          :key="`leave-${leave._id}-${token._id}`"
          :disabled="!token.reason"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-chip
              class="mr-2"
              dense
              color="primary"
              outlined
              v-bind="attrs"
              v-on="on"
            >
              {{ token.kind }}
            </v-chip>
          </template>
          <span>{{ token.reason }}</span>
        </v-tooltip>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { format, parseISO } from 'date-fns'

export default {
  props: {
    leave: {
      type: Object,
      default: () => null
    }
  },
  filters: {
    formatDate(value) {
      return format(parseISO(value), 'yyyy년 MM월 dd일')
    }
  }
}
</script>
