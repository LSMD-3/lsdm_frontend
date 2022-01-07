import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Checkbox, Skeleton } from "@mui/material";
import { EnhancedTableHead } from "./EnhancedTableHead";
import { EnhancedTableToolbar } from "./EnhancedTableToolbar";
import { SearchParams } from "api/utils";
import { useSnackbar } from "notistack";
import { BaseResource } from "api/BaseResource";

export interface TableColumn {
  id: string;
  label: string;
  minWidth?: number;
  align?: "right";
  numeric?: boolean;
  disablePadding?: boolean;
  format?: (value: number) => string;
  render?: (value: any) => JSX.Element;
}

export type Order = "asc" | "desc";

interface TableProps<Resource> {
  // rows: Record<string, any>[];
  title: string;
  columns: TableColumn[];
  api: BaseResource<Resource>;
  onRowClick?: (item: Resource) => void;
}

export default function ColumnGroupingTable<Resource>({
  title,
  columns,
  api,
}: TableProps<Resource>) {
  const [page, setpage] = useState(0);
  const [pageSize, setpageSize] = useState(10);
  const [totalCount, settotalCount] = useState<number>(0);
  const [loading, setloading] = useState(true);
  const [items, setitems] = useState<any[]>([]);
  const [selectedItems, setselectedItems] = useState<string[]>([]);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<string>();
  const [search, setsearch] = useState<SearchParams>();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetch();
    fetchTotalCount();
    return () => {};
  }, [page, pageSize, search]);

  useEffect(() => {
    fetch();
    fetchTotalCount();
    return () => {};
  }, []);

  const fetch = async () => {
    setloading(true);
    try {
      const res = await api.search({
        limit: pageSize,
        offset: page * pageSize,
        sort:
          order && orderBy
            ? [{ field: orderBy, direction: order === "asc" ? 1 : -1 }]
            : undefined,
        like: search?.like,
        equal: search?.equal,
      });
      setitems(res);
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
    setloading(false);
  };

  const fetchTotalCount = async () => {
    try {
      const res = await api.count({ like: search?.like, equal: search?.equal });
      settotalCount(res);
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  const renderLoading = () => {
    const fakeRows = new Array(10).fill(0);
    return fakeRows.map((row) => {
      return (
        <TableRow hover role="checkbox" tabIndex={-1}>
          {columns.map((column) => {
            return (
              <TableCell align={column.align}>
                <Skeleton variant="text" style={{ maxWidth: 100 }} />
              </TableCell>
            );
          })}
        </TableRow>
      );
    });
  };

  const formatValue = (column: TableColumn, value: any) => {
    if (column.format && typeof value === "number") return column.format(value);
    return value;
  };

  const toggleRowChecked = (rowId: string) => {
    if (selectedItems.includes(rowId)) {
      setselectedItems(selectedItems.filter((itm) => itm === rowId));
    } else {
      setselectedItems([...selectedItems, rowId]);
    }
  };

  const toggleAllRows = () => {
    if (selectedItems.length === pageSize) {
      setselectedItems([]);
    } else setselectedItems(items.map((itm) => itm._id));
  };

  const renderTable = () => {
    return items.map((row) => {
      return (
        <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              checked={selectedItems.includes(row._id)}
              onChange={() => toggleRowChecked(row._id)}
              inputProps={{
                "aria-labelledby": row._id,
              }}
            />
          </TableCell>
          {columns.map((column) => {
            const value = row[column.id];
            return (
              <TableCell key={column.id} align={column.align}>
                {column.render
                  ? column.render(row)
                  : formatValue(column, value)}
              </TableCell>
            );
          })}
        </TableRow>
      );
    });
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    fetch();
  };

  const deleteItems = async () => {
    const promises: any = [];
    selectedItems.forEach((itm) => {
      promises.push(api.delete(itm));
    });
    try {
      const res = await Promise.all(promises);
      enqueueSnackbar(`${selectedItems.length} rows deleted`, {
        variant: "success",
      });
      setselectedItems([]);
      fetchTotalCount();
      fetch();
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  return (
    <Paper sx={{ width: "100%" }}>
      <EnhancedTableToolbar
        title={title}
        numSelected={selectedItems.length}
        onDeletePress={deleteItems}
        columns={columns}
        onFilterApplyed={(search) => setsearch(search)}
      />
      <TableContainer sx={{ maxHeight: 700 }}>
        <Table stickyHeader aria-label="sticky table">
          <EnhancedTableHead
            numSelected={selectedItems.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={toggleAllRows}
            onRequestSort={handleRequestSort}
            rowCount={pageSize}
            columns={columns}
          />
          <TableBody>
            {loading && renderLoading()}
            {!loading && renderTable()}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={totalCount}
        rowsPerPage={pageSize}
        page={page}
        onPageChange={(event: unknown, newPage: number) => {
          setpage(newPage);
        }}
        onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setpageSize(+event.target.value);
        }}
      />
    </Paper>
  );
}
