import { reactive, toRefs, ref } from "vue";
import { date } from "quasar";
import { api } from "../boot/axios";
import Utils from "../helpers/Utils";

export default function useUser() {
  const state = reactive({
    loading: false,
    saving: false,
    deleting: false,
    items: [],
  });

  const columns = [
    {
      name: "name",
      label: "NAME",
      required: true,
      field: (row) => row.name,
      align: "left",
      sortable: true,
    },
    {
      name: "email",
      label: "EMAIL",
      required: false,
      field: (row) => row.email,
      align: "left",
    },
    {
      name: "created_at",
      label: "CREATED AT",
      required: true,
      field: (row) => date.formatDate(row.created_at, "DD/MM/YYYY"),
      align: "left",
      sortable: true,
    },
  ];

  const add = async (data) => {
    try {
      state.saving = true;
      await api.post("/users", data);
    } catch (err) {
      throw Error(Utils.getErrorMessage(err));
    } finally {
      state.saving = false;
    }
  };

  const update = async (id, data) => {
    try {
      state.saving = true;
      await api.put(`/users/${id}`, data);
    } catch (err) {
      throw Error(Utils.getErrorMessage(err));
    } finally {
      state.saving = false;
    }
  };

  const trash = async (id) => {
    try {
      state.deleting = true;
      await api.delete(`/users/${id}`);
    } catch (err) {
      throw Error(Utils.getErrorMessage(err));
    } finally {
      state.deleting = false;
    }
  };

  const get = async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response;
    } catch (err) {
      throw Error(Utils.getErrorMessage(err));
    }
  };

  const paginate = async (props) => {
    state.loading = true;
    let params =
      props.filter !== undefined
        ? Object.assign(props.pagination, { ...props.filter })
        : props.pagination;
    try {
      const response = await api.get("/users/paginate", { params });
      state.items = response.data.data;
      state.loading = false;
      return response;
    } catch (err) {
      state.loading = false;
      throw Error(Utils.getErrorMessage(err));
    }
  };

  return {
    ...toRefs(state),
    columns,
    add,
    update,
    trash,
    get,
    paginate,
  };
}
