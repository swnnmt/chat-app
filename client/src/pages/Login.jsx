import { useContext } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";



const Login = () => {

    const {loginUser,
        loginError,
        loginInfor,
        updateLoginInfor,
        isLoginLoading } = useContext (AuthContext);
    const handlechange = (e) => {
        updateLoginInfor({ ...loginInfor, [e.target.name]: e.target.value })
    }
    return ( 
    <>
    <Form onSubmit={loginUser}>
        <Row style={
            {height:"100vh", 
            justifyContent:"center",
            paddingTop:"10%"
            }}>
            <Col xs={6} >
                <Stack gap={3}>
                    <h2>Login</h2>
                    <Form.Control type="email" name="email"  placeholder="email" onChange={handlechange} />
                    <Form.Control type="password" name="password" placeholder="Password" onChange={handlechange} />
                    <Button variant="primary" type="submit">
                        {isLoginLoading? "Getting you in ..." : "Login"}
                    </Button>
                    {loginError?.error && (
                    <Alert variant="danger">
                        <p>{loginError?.message}</p>
                    </Alert>
                    )}
                    
                </Stack>
            </Col>
        </Row>
    </Form>
    </>);
}
 
export default Login;