import { useQuasar } from "quasar";
import { reactive, ref, toRefs } from "vue";

export default function useTable(paginate, trash) {
  const $q = useQuasar();

  const state = reactive({
    showAdd: false,
    showEdit: false,
    showConfirm: false,
    filters: {},
    selected: [],
  });

  const pagination = ref({
    sortBy: "created_at",
    descending: false,
    page: 1,
    rowsPerPage: 15,
    rowsNumber: 0,
  });

  async function onRequest(props) {
    const { page, rowsPerPage, sortBy, descending } = props.pagination;
    try {
      const response = await paginate(props);
      pagination.value.rowsNumber = response.data.total;
      pagination.value.page = page;
      pagination.value.rowsPerPage = rowsPerPage;
      pagination.value.sortBy = sortBy;
      pagination.value.descending = descending;
    } catch (err) {
      $q.notify({
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: err.toString(),
      });
    }
  }

  function onRefresh() {
    onRequest({
      pagination: pagination.value,
      filter: undefined,
    });
    state.selected = [];
    state.showAdd = false;
    state.showEdit = false;
  }

  function onRowClick(evt, row) {
    state.selected = [row];
    state.showEdit = true;
  }

  function onRowDblClick(evt, row) {}

  async function onDelete(type = "Data") {
    let itemIds = state.selected.map((item) => {
      return item.id;
    });

    try {
      for (let i = 0; i < itemIds.length; i++) {
        await trash(itemIds[i]);
      }
      $q.notify({
        type: "positive",
        icon: "fas fa-check",
        message: `${type}(s) deleted successfully`,
      });
    } catch (err) {
      console.log(err.toString());
      $q.notify({
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: err.toString(),
      });
    }

    state.showConfirm = false;
    state.selected = [];
    onRequest({
      pagination: pagination.value,
      filter: undefined,
    });
  }

  return {
    ...toRefs(state),
    pagination,
    onRequest,
    onRefresh,
    onRowClick,
    onRowDblClick,
    onDelete,
  };
}
