import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import ShowResult from "./ShowResult";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function ApiForm() {
  const classes = useStyles();
  const notify = (message) => toast(message);

  // Declare a new state variable, which we'll call "count"
  const [apiLink, setApiLink] = useState();
  const [apiData, setApiData] = useState("");
  const [apiTimeTaken, setApiTimeTaken] = useState("");


  function onSubmit(e) {
    e.preventDefault();

    const data = {
      apiLink: apiLink,
    };

    create(data);
  }

  async function create(data) {
    try {
      let start = Date.now();
      var result = await axios.post("http://127.0.0.1:4000/apiLink", data);
      let end = Date.now();
      setApiTimeTaken(end-start);
      console.log(result);
      setApiData(result.data);

      const message = "ApiLink Submitted SuccessFully";
      notify(message);
      console.log("success");
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <Container component="main">
      <CssBaseline />
      <div className={classes.paper}>
        <form className={classes.form} noValidate>
          <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="stretch"
            spacing={2}
          >
            <Grid item xs={12} sm={12}>
              <TextField
                autoComplete="apiLink"
                name="apiLink"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="apiLink"
                label="ApiLink"
                autoFocus
                onChange={(e) => setApiLink(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={onSubmit}
          >
            Submit
          </Button>
        </form>
        {/* <ShowResult resultJson={apiData} /> */}
        <ToastContainer />
      </div>
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="stretch"
        spacing={2}
      >
        <Grid item xs={12} sm={12}>
          <b>Time Taken:{apiTimeTaken}ms</b>
          <ShowResult resultJson={apiData} />
        </Grid>
      </Grid>
    </Container>
  );
}
