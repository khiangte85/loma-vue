<template>
  <q-page>
    <q-card square flat class="bg-primary">
      <q-card-section class="q-pb-xl">
        <q-breadcrumbs class="text-white">
          <q-breadcrumbs-el label="Users" class="text-white" />
        </q-breadcrumbs>
      </q-card-section>
    </q-card>

    <div class="page-wrap bc-overlap">
      <q-card flat class="q-mx-md">
        <q-card-section class="q-pa-md">
          <q-page-sticky position="top-right" :offset="[30, 35]">
            <q-btn
              size="sm"
              rounded
              padding="10px"
              color="accent"
              icon="fas fa-plus"
              @click="showAdd = true"
            />
          </q-page-sticky>
        </q-card-section>
        <q-card-section>
          <q-table
            class="q-pt-md"
            color="primary"
            :loading="loading"
            :rows="items"
            row-key="id"
            :columns="columns"
            v-model:pagination="pagination"
            selection="multiple"
            :filter="filters"
            v-model:selected="selected"
            @request="onRequest"
            @row-click="onRowClick"
            @row-dblclick="onRowDblClick"
            :rows-per-page-options="[10, 15, 20, 50, 100, 150, 200, 500]"
            binary-state-sort
          >
            <template v-slot:top>
              <q-input
                dense
                outlined
                debounce="300"
                v-model="filters.name"
                placeholder="Search..."
                style="width: 300px"
              />
              <q-space />
              <q-btn
                :disable="selected.length !== 1"
                size="sm"
                label="Edit"
                icon="fas fa-pen-alt"
                color="accent"
                @click="showEdit = true"
              />
              <q-btn
                class="q-ml-sm"
                :disable="selected.length === 0"
                size="sm"
                label="Delete"
                icon="fas fa-trash"
                color="negative"
                @click="showConfirm = true"
              />
            </template>
          </q-table>
        </q-card-section>
      </q-card>

      <q-dialog v-model="showConfirm" persistent>
        <confirm-delete
          :message="`Are you sure you want to delete selected User${
            selected.length > 1 ? 's' : ''
          }?`"
          @cancel="showConfirm = false"
          @confirm="onDelete('User')"
          :deleting="deleting"
        />
      </q-dialog>

      <!-- Add / edit dialog -->
      <q-dialog v-model="showAdd" position="top" persistent>
        <add-user @onClose="showAdd = false" @onAdded="onRefresh" />
      </q-dialog>

      <q-dialog v-model="showEdit" position="top" persistent>
        <edit-user
          :user="selected[0]"
          @onClose="showEdit = false"
          @onUpdated="onRefresh"
        />
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import { onMounted, reactive } from "vue";
import useTable from "../composables/useTable";
import useUser from "../composables/useUser";
import AddUser from "../components/User/Add.vue";
import EditUser from "../components/User/Edit.vue";
import ConfirmDelete from "../components/Common/ConfirmDelete.vue";

export default {
  name: "PageIndex",
  components: {
    ConfirmDelete,
    AddUser,
    EditUser,
  },
  setup() {
    const { loading, deleting, columns, items, trash, paginate } = useUser();
    const {
      showAdd,
      showEdit,
      showConfirm,
      selected,
      pagination,
      onRequest,
      onRefresh,
      onRowClick,
      onRowDblClick,
      onDelete,
    } = useTable(paginate, trash);

    const filters = reactive({
      name: "",
    });

    onMounted(() => {
      onRequest({
        pagination: pagination.value,
        filter: undefined,
      });
    });

    return {
      loading,
      deleting,
      columns,
      items,
      selected,
      pagination,
      filters,
      showAdd,
      showEdit,
      showConfirm,
      onRequest,
      onRowClick,
      onRowDblClick,
      onRefresh,
      onDelete,
    };
  },
};
</script>

<style></style>
