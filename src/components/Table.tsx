import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Box, Checkbox, Skeleton, TableSortLabel } from "@mui/material";
import { visuallyHidden } from "@mui/utils";

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

  type Order = "asc" | "desc";

  interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
  }

  function EnhancedTableHead(props: EnhancedTableProps) {
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
      onRequestSort,
    } = props;
    const createSortHandler =
      (property: string) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
      };

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                "aria-label": "select all desserts",
              }}
            />
          </TableCell>
          {columns.map((column) => (
            <TableCell
              key={column.id}
              align={column.numeric ? "right" : "left"}
              padding={column.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === column.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === column.id}
                direction={orderBy === column.id ? order : "asc"}
                onClick={createSortHandler(column.id)}
              >
                {column.label}
                {orderBy === column.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  return (
    <Paper sx={{ width: "100%" }}>
      <TableContainer sx={{ maxHeight: 700 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            {title && (
              <TableRow>
                <TableCell align="center" colSpan={5}>
                  {title}
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ top: 57, minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
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
