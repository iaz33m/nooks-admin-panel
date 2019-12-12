import React, { Component } from "react";
import { connect } from "react-redux";
import * as actionsCreators from "../../Store/Actions/AuthActions";
import alertify from 'alertifyjs';

import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from "reactstrap";

class Login extends Component {

  state = {
    number: "",
    password: "",
    hasError: false
  };

  componentWillMount(){
    if(this.props.user){
      this.props.history.push("/");
    }
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  login = () => {

    let {login,dispatch,history} = this.props;

    login(this.state).then(res => {

        dispatch({
          type: actionsCreators.LOGIN,
          payload: res.data
        });
        history.push("/");
    }).catch(err => {
        alertify.set('notifier','position', 'top-center');
        alertify.error(err.response.data.message);
        this.setState({
          hasError: true
        });
    });
  };

  render() {

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="5">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input

                          className="form-control-warning"
                          type="number"
                          placeholder="Number"
                          autoComplete="number"
                          name="number"
                          value={this.state.number}
                          onChange={this.onChange}
                          invalid={this.state.hasError}
                        />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          placeholder="Password"
                          autoComplete="current-password"
                          name="password"
                          value={this.state.password}
                          onChange={this.onChange}
                          invalid={this.state.hasError}
                        />
                      </InputGroup>

                      <Row>
                        <Col xs="6">
                          <Button
                            color="primary"
                            className="px-4"
                            onClick={this.login}
                          >
                            Login
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch: dispatch,
    login: data => actionsCreators.login(data)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
