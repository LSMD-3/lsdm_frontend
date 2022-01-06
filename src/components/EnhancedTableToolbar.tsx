import { useState, useEffect } from "react";
import { alpha } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Tooltip,
  Toolbar,
  Typography,
  IconButton,
  Collapse,
  Box,
  Button,
  Grid,
  TextField,
  InputAdornment,
} from "@mui/material";
import { TableColumn } from "./Table";
import { BaseAndOrFilter, SearchParams } from "api/utils";
import { KeyOff, KeyOutlined } from "@mui/icons-material";

interface EnhancedTableToolbarProps {
  numSelected: number;
  title: string;
  columns: TableColumn[];
  onDeletePress?: () => void;
  onFilterApplyed: (search: SearchParams) => void;
}

export const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { numSelected, title, onDeletePress, columns, onFilterApplyed } = props;
  const [expanded, setexpanded] = useState(false);
  const [exactSelected, setexactSelected] = useState<string[]>([]);
  const [searchFields, setsearchFields] = useState<any>({});

  const initializeSearchFields = () => {
    const search: any = {};
    columns.forEach((c) => (search[c.id] = ""));
    setsearchFields(search);
  };

  useEffect(() => {
    initializeSearchFields();
    return () => {};
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const like: BaseAndOrFilter = { and: [], or: [] };
    const equal: BaseAndOrFilter = { and: [], or: [] };

    columns.forEach((c) => {
      const value = data.get(c.id)?.toString();
      if (value && value.length > 0) {
        if (exactSelected.includes(c.id))
          equal.and.push({ field: c.id, value, caseSensitive: false });
        else like.and.push({ field: c.id, value, caseSensitive: false });
      }
    });

    onFilterApplyed({ like, equal });
  };

  const toggleExactness = (fieldName: string) => {
    if (exactSelected.includes(fieldName)) {
      setexactSelected(exactSelected.filter((itm) => itm !== fieldName));
    } else {
      setexactSelected([...exactSelected, fieldName]);
    }
  };

  const clearForm = () => {
    // document.getElementById("h1").value = m;
    initializeSearchFields();
    onFilterApplyed({});
  };

  return (
    <div>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            {title}
          </Typography>
        )}
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton onClick={onDeletePress}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton onClick={() => setexpanded(!expanded)}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
      <Collapse in={expanded} style={{ margin: 16 }}>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {columns.map((c) => {
              // TODO
              // Generaliza field search => boolean, text, number, date
              return (
                <Grid item xs={2}>
                  <TextField
                    required
                    fullWidth
                    id={c.id}
                    name={c.id}
                    autoComplete={c.id}
                    label={c.label}
                    value={searchFields[c.id]}
                    onChange={(event) => {
                      const obj: any = {};
                      obj[c.id] = event.target.value;
                      setsearchFields({ ...searchFields, ...obj });
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip
                            title={
                              exactSelected.includes(c.id)
                                ? "Search for similar words"
                                : "Search for exact word"
                            }
                          >
                            <IconButton
                              onClick={() => toggleExactness(c.id)}
                              edge="end"
                            >
                              {exactSelected.includes(c.id) ? (
                                <KeyOutlined />
                              ) : (
                                <KeyOff />
                              )}
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              );
            })}
          </Grid>
          <Button
            variant="contained"
            style={{ float: "right", marginLeft: 10 }}
            onClick={clearForm}
          >
            Clear Filters
          </Button>
          <Button type="submit" variant="contained" style={{ float: "right" }}>
            Search
          </Button>
        </Box>
      </Collapse>
    </div>
  );
};
