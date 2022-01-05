import { UserApi } from "api";
import { Table } from "components";
import { TableColumn } from "components/Table";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "types";
import { useSnackbar } from "notistack";

export default function UserHome() {
  const [items, setitems] = useState<User[]>([]);
  const [page, setpage] = useState(0);
  const [pageSize, setpageSize] = useState(10);
  const [totalCount, settotalCount] = useState<number>(0);
  const navigate = useNavigate();
  const [loading, setloading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const fetchUser = async () => {
    try {
      const res = await UserApi.search({
        limit: pageSize,
        offset: page * pageSize,
      });
      setitems(res);
      setloading(false);
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  const fetchTotalCount = async () => {
    try {
      const res = await UserApi.count();
      settotalCount(res);
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  useEffect(() => {
    fetchUser();
    return () => {};
  }, [page, pageSize]);

  useEffect(() => {
    fetchUser();
    fetchTotalCount();
    return () => {};
  }, []);

  const columns: TableColumn[] = [
    { id: "name", label: "Nome" },
    { id: "surname", label: "Cognome" },
    { id: "email", label: "Email" },
    {
      id: "master",
      label: "Master",
      render: (master: boolean) => <p>{master ? "Yes" : "No"}</p>,
    },
  ];

  const openUserDetails = (user: User) => {
    navigate("/user/" + user._id);
  };

  return (
    <div style={{ marginRight: 20, marginLeft: 20, marginTop: 20 }}>
      <Table
        loading={loading}
        totalRows={totalCount}
        rows={items}
        columns={columns}
        page={page}
        title="Ristoranti"
        rowsPerPage={pageSize}
        handleChangeRowsPerPage={setpageSize}
        handleChangePage={setpage}
        onRowClick={openUserDetails}
      />
    </div>
  );
}
