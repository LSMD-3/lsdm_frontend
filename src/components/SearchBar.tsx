import React, { useEffect, useState } from "react";
import { TextField, Button, Autocomplete } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useSnackbar } from "notistack";

export interface SearchBarProps<T> {
  onSelectOption: (option: T) => void;
  searchApi: (text: string) => Promise<T[]>;
  labelExtractor: (option: T) => string;
  keyExtractor: (option: T) => string;
}

export default function SearchBar<T>({
  onSelectOption,
  labelExtractor,
  keyExtractor,
  searchApi,
}: SearchBarProps<T>) {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(false);
  const [searchText, setsearchText] = useState<string>();
  const [options, setOptions] = useState<T[]>([]);
  const [selecteItem, setselecteItem] = useState<T>();
  const loading = open && options.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) return undefined;

    (async () => {
      await fetchOptions();
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const fetchOptions = async () => {
    if (!searchText || searchText.length === 0) return [];
    try {
      const items = await searchApi(searchText);
      if (items) setOptions(items);
      else setOptions([]);
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  useEffect(() => {
    fetchOptions();
    return () => {};
  }, []);

  return (
    <div>
      <Autocomplete
        options={options}
        value={selecteItem}
        onChange={(event: any, newValue: T | null) => {
          if (newValue) {
            setselecteItem(newValue);
            onSelectOption(newValue);
          }
        }}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        isOptionEqualToValue={(option, value) =>
          keyExtractor(option) === keyExtractor(value)
        }
        getOptionLabel={(option) => labelExtractor(option)}
        loading={loading}
        inputValue={searchText}
        onInputChange={(event, newInputValue) => {
          setsearchText(newInputValue);
          fetchOptions();
        }}
        id="controllable-states-demo"
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Asynchronous"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    </div>
  );
}
