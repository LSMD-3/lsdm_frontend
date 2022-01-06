import * as React from "react";
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

interface TableProps {
  rows: Record<string, any>[];
  columns: TableColumn[];
  totalRows: number;
  rowsPerPage: number;
  page: number;
  title?: string;
  loading?: boolean;
  handleChangeRowsPerPage?: (pagesize: number) => void;
  handleChangePage: (newPage: number) => void;
  onRowClick?: (item: any) => void;
}

export default function ColumnGroupingTable({
  rows,
  columns,
  title,
  rowsPerPage,
  page,
  totalRows,
  loading,
  handleChangeRowsPerPage,
  handleChangePage,
  onRowClick,
}: TableProps) {
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

  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("name");

  const formatValue = (column: TableColumn, value: any) => {
    if (column.format && typeof value === "number") return column.format(value);
    return value;
  };

  const renderTable = () => {
    return rows.map((row) => {
      return (
        <TableRow
          hover
          role="checkbox"
          tabIndex={-1}
          key={row.code}
          onClick={() => onRowClick && onRowClick(row)}
        >
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              checked={false}
              inputProps={{
                "aria-labelledby": row.code,
              }}
            />
          </TableCell>
          {columns.map((column) => {
            const value = row[column.id];
            return (
              <TableCell key={column.id} align={column.align}>
                {column.render
                  ? column.render(value)
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
  };

  return (
    <Paper sx={{ width: "100%" }}>
      <EnhancedTableToolbar numSelected={10} />
      <TableContainer sx={{ maxHeight: 700 }}>
        <Table stickyHeader aria-label="sticky table">
          <EnhancedTableHead
            numSelected={10}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={() => console.log("select all")}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
            columns={columns}
            title={title}
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
        count={totalRows}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event: unknown, newPage: number) => {
          handleChangePage && handleChangePage(newPage);
        }}
        onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          handleChangeRowsPerPage &&
            handleChangeRowsPerPage(+event.target.value);
        }}
      />
    </Paper>
  );
}
