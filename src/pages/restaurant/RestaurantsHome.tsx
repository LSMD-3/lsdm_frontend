import { RestaurantApi } from "api";
import { Table } from "components";
import { TableColumn } from "components/Table";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Restaurant } from "types";
import { useSnackbar } from "notistack";

export default function RestaurantsHome() {
  const [items, setitems] = useState<Restaurant[]>([]);
  const [page, setpage] = useState(0);
  const [pageSize, setpageSize] = useState(10);
  const [totalCount, settotalCount] = useState<number>(0);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const fetchRestaurant = async () => {
    try {
      const res = await RestaurantApi.search({
        limit: pageSize,
        offset: page * pageSize,
      });
      setitems(res);
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  const fetchTotalCount = async () => {
    try {
      const res = await RestaurantApi.count();
      console.log({ res });
      settotalCount(res);
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  useEffect(() => {
    fetchRestaurant();
    return () => {};
  }, [page, pageSize]);

  useEffect(() => {
    fetchRestaurant();
    fetchTotalCount();
    return () => {};
  }, []);

  const columns: TableColumn[] = [
    { id: "nome", label: "Nome" },
    { id: "tipologia", label: "Tipologia" },
    { id: "email", label: "Email" },
    { id: "comune", label: "Comune" },
    { id: "provincia", label: "Provincia" },
  ];

  const openRestaurantDetails = (restaurant: Restaurant) => {
    navigate("/restaurant/" + restaurant._id);
  };

  return (
    <div style={{ marginRight: 20, marginLeft: 20, marginTop: 20 }}>
      <Table
        totalRows={totalCount}
        rows={items}
        columns={columns}
        page={page}
        title="Ristoranti"
        rowsPerPage={pageSize}
        handleChangeRowsPerPage={setpageSize}
        handleChangePage={setpage}
        onRowClick={openRestaurantDetails}
      />
    </div>
  );
}
