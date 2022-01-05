import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Skeleton } from "@mui/material";

export interface TableColumn {
  id: string;
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
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
                {column.format && typeof value === "number"
                  ? column.format(value)
                  : value}
              </TableCell>
            );
          })}
        </TableRow>
      );
    });
  };

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
