import { Redirect, Route, Router, Switch } from "react-router";
import history from "./history";
import Address from "./pages/address/address";
import History from "./pages/history";

function App() {
  return (
    <div style={{ padding: "10px 20px" }} className="App">
      <Router history={history}>
        <Switch>
          <Route exact path="/">
            <Redirect to="/history" />
          </Route>
          <Route path="/history" component={() => <History />} />
          <Route path="/address" component={() => <Address />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
