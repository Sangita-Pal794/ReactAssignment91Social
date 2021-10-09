import {
  Box,
  Collapse,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@material-ui/icons";
import SearchIcon from "@material-ui/icons/Search";
import axios from "axios";
import React, { useEffect, useState } from "react";
import "./address.scss";

const useStyles = makeStyles({
  customTableContainer: {
    overflowX: "initial",
  },
});

const Row = (props) => {
  const { data } = props;
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow>
        <TableCell>{data.id}</TableCell>
        <TableCell>{data.title}</TableCell>
        <TableCell>{data.event_date_utc}</TableCell>
        <TableCell>{data.event_date_unix}</TableCell>
        <TableCell>{data.flight_number}</TableCell>
        <TableCell>{data.details}</TableCell>
        <TableCell>
          <Tooltip arrow title="Links">
            <IconButton onClick={() => setOpen(!open)}>
              {!open ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={11} style={{ paddingBottom: "0", paddingTop: "0" }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6">links</Typography>
                </Grid>
                <Grid item md={4} sm={2} xs={12}>
                  <Typography variant="body1">
                    &bull; reddit: {data.links.reddit}
                  </Typography>
                </Grid>
                <Grid item md={4} sm={2} xs={12}>
                  <Typography variant="body1">
                    &bull;{" "}
                    <Tooltip arrow title={data.links.article}>
                      <a
                        href={`${data.links.article}`}
                        target="_blank"
                        style={{ textDecoration: "none" }}
                      >
                        Article
                      </a>
                    </Tooltip>
                  </Typography>
                </Grid>
                <Grid item md={4} sm={2} xs={12}>
                  <Typography variant="body1">
                    &bull;{" "}
                    <Tooltip arrow title={data.links.wikipedia}>
                      <a
                        href={`${data.links.wikipedia}`}
                        target="_blank"
                        style={{ textDecoration: "none" }}
                      >
                        Wikipedia
                      </a>
                    </Tooltip>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const Address = () => {
  const [allData, setAllData] = useState(null);
  const [originalAllData, setOriginalAllData] = useState(null);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [search, setSearch] = useState("");

  const onChange = (e) => {
    setSearch(e.target.value);
    console.log(e.target.value);
    if (originalAllData !== null)
      setAllData(
        originalAllData &&
          originalAllData.filter(
            (each) =>
              each.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
              each?.flight_number
                ?.toString()
                .includes(e.target.value.toString().toLowerCase())
          )
      );
  };

  const classes = useStyles();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(+event.target.value));
    setPage(0);
  };
  let tableHead = [
    "Id",
    "Title",
    "Event Date (utc)",
    "Event Date (unix)",
    "Flight Number",
    "Details",
    " ",
  ];

  useEffect(() => {
    getAllData();
  }, []);

  const getAllData = () => {
    console.log("useEffect address");
    axios
      .get("https://api.spacexdata.com/v3/history")
      .then((response) => {
        console.log(response);
        setAllData(response.data);
        setOriginalAllData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="header">
        <Typography variant="h6">Address Details : </Typography>
        <TextField
          variant="outlined"
          margin="dense"
          InputProps={{
            startAdornment: (
              <InputAdornment position="end">
                <IconButton disabled>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={onChange}
          type="text"
          placeholder="Search"
        />
      </div>

      <TableContainer
        component={Paper}
        classes={{ root: classes.customTableContainer }}
      >
        <Table
          stickyHeader
          style={{ border: "2px solid lightgray", boxSizing: "border-box" }}
        >
          <TableHead>
            <TableRow className="sticky">
              {tableHead.map((eachHead, index) => {
                return <TableCell key={index}>{eachHead}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {allData &&
              allData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((eachData, index) => {
                  return <Row data={eachData} key={index} />;
                })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={allData && allData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default Address;
