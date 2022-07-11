<template>
  <q-card :style="{ width: '400px', minHeight: '150px' }">
    <q-bar class="bg-primary text-white">
      <q-icon
        name="fas fa-exclamation-triangle"
        color="warning"
        text-color="white"
      />
      <div>Confirm</div>
      <q-space />
      <q-btn
        dense
        flat
        icon="fas fa-times"
        :disable="deleting"
        @click="context.emit('cancel')"
      >
        <q-tooltip>Close</q-tooltip>
      </q-btn>
    </q-bar>

    <q-card-section class="row items-center">
      <span class="q-ml-sm">{{ message }}</span>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn
        dense
        flat
        label="Cancel"
        :disable="deleting"
        color="accent"
        @click="context.emit('cancel')"
      />
      <q-btn
        dense
        :disable="deleting"
        color="negative"
        @click="context.emit('confirm')"
      >
        <template v-if="deleting">
          <q-spinner-grid color="white" size="xs" />
        </template>
        <template v-else> Delete </template>
      </q-btn>
    </q-card-actions>
  </q-card>

  <!-- <q-inner-loading :showing="deleting" style="width:100%">
    <q-spinner-grid color="primary" size="xl" />
  </q-inner-loading> -->
</template>

<script>
export default {
  name: "ConfirmDelete",
  props: ["message", "deleting"],
  setup(props, context) {
    return {
      context,
    };
  },
};
</script>

<style></style>
