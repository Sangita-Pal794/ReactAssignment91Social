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
import "../address/address.scss";

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
        <TableCell>{data.payload_id}</TableCell>
        <TableCell>
          {data.norad_id.map((each, index) => (
            <>{` ${each} `}</>
          ))}
        </TableCell>
        <TableCell>{data.reused ? "True" : "False"}</TableCell>
        <TableCell>{data.customers}</TableCell>
        <TableCell>{data.nationality}</TableCell>
        <TableCell>{data.manufacturer}</TableCell>
        <TableCell>{data.payload_type}</TableCell>
        <TableCell>{data.payload_mass_kg}</TableCell>
        <TableCell>{data.payload_mass_lbs}</TableCell>
        <TableCell>{data.orbit}</TableCell>
        <TableCell>
          <Tooltip arrow title="Orbit Params">
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
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6">Orbit Params</Typography>
                </Grid>
                <Grid item md={3} sm={4} xs={12}>
                  <Typography variant="body1">
                    &bull; Reference System:{" "}
                    {data.orbit_params.reference_system}
                  </Typography>
                </Grid>
                <Grid item md={3} sm={4} xs={12}>
                  <Typography variant="body1">
                    &bull; Regime: {data.orbit_params.regime}
                  </Typography>
                </Grid>
                <Grid item md={3} sm={4} xs={12}>
                  <Typography variant="body1">
                    &bull; Longitude: {data.orbit_params.longitude}
                  </Typography>
                </Grid>
                <Grid item md={3} sm={4} xs={12}>
                  <Typography variant="body1">
                    &bull; Semi major axis km:
                    {data.orbit_params.semi_major_axis_km}
                  </Typography>
                </Grid>
                <Grid item md={3} sm={4} xs={12}>
                  <Typography variant="body1">
                    &bull; eccentricity: {data.orbit_params.eccentricity}
                  </Typography>
                </Grid>
                <Grid item md={3} sm={4} xs={12}>
                  <Typography variant="body1">
                    &bull; periapsis_km: {data.orbit_params.periapsis_km}
                  </Typography>
                </Grid>
                <Grid item md={3} sm={4} xs={12}>
                  <Typography variant="body1">
                    &bull; apoapsis_km: {data.orbit_params.apoapsis_km}
                  </Typography>
                </Grid>
                <Grid item md={3} sm={4} xs={12}>
                  <Typography variant="body1">
                    &bull; inclination_deg: {data.orbit_params.inclination_deg}
                  </Typography>
                </Grid>
                <Grid item md={3} sm={4} xs={12}>
                  <Typography variant="body1">
                    &bull; period_min: {data.orbit_params.period_min}
                  </Typography>
                </Grid>
                <Grid item md={3} sm={4} xs={12}>
                  <Typography variant="body1">
                    &bull; lifespan_years: {data.orbit_params.lifespan_years}
                  </Typography>
                </Grid>
                <Grid item md={3} sm={4} xs={12}>
                  <Typography variant="body1">
                    &bull; epoch: {data.orbit_params.epoch}
                  </Typography>
                </Grid>
                <Grid item md={3} sm={4} xs={12}>
                  <Typography variant="body1">
                    &bull; mean_motion: {data.orbit_params.mean_motion}
                  </Typography>
                </Grid>
                <Grid item md={3} sm={4} xs={12}>
                  <Typography variant="body1">
                    &bull; raan: {data.orbit_params.raan}
                  </Typography>
                </Grid>
                <Grid item md={3} sm={4} xs={12}>
                  <Typography variant="body1">
                    &bull; arg_of_pericenter:
                    {data.orbit_params.arg_of_pericenter}
                  </Typography>
                </Grid>
                <Grid item md={3} sm={4} xs={12}>
                  <Typography variant="body1">
                    &bull; mean_anomaly: {data.orbit_params.mean_anomaly}
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

const History = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const classes = useStyles();
  const [search, setSearch] = useState("");

  const onChange = (e) => {
    setSearch(e.target.value);
    console.log(e.target.value);
    if (originalAllData !== null)
      setAllData(
        originalAllData &&
          originalAllData.filter(
            (each) =>
              each.orbit.toLowerCase().includes(e.target.value.toLowerCase()) ||
              each?.norad_id
                ?.toString()
                .includes(e.target.value.toString().toLowerCase())
          )
      );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(+event.target.value));
    setPage(0);
  };
  let tableHead = [
    "Payload Id",
    "Norad Id",
    "Reused",
    "Customers",
    "Nationality",
    "Manufacturer",
    "Payload Type",
    "Payload Mass(kg)",
    "Payload Mass(lbs)",
    "Orbit",
    " ",
  ];
  const [allData, setAllData] = useState(null);
  const [originalAllData, setOriginalAllData] = useState(null);

  useEffect(() => {
    getAllData();
  }, []);

  const getAllData = () => {
    console.log("useEffect running");
    axios
      .get("https://api.spacexdata.com/v3/payloads")
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
        <Typography variant="h6">History Details : </Typography>
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
            <TableRow>
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
        rowsPerPageOptions={[10, 15, 20, 25]}
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

export default History;
