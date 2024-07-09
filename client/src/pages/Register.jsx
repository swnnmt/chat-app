import { useContext } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";



const Register = () => {

    const { registerInfor, updateRegisterInfor, registerUser, registerError,isregisterLoading } = useContext(AuthContext);

    const handlechange = (e) => {
        updateRegisterInfor({ ...registerInfor, [e.target.name]: e.target.value })
    }

    return (
        <>
            <Form onSubmit={registerUser}>
                <Row style={
                    {
                        height: "100vh",
                        justifyContent: "center",
                        paddingTop: "10%"
                    }}>
                    <Col xs={6} >
                        <Stack gap={3}>
                            <h2>Register</h2>

                            <Form.Control type="text" name="name" placeholder="name" onChange={handlechange} />
                            <Form.Control type="email" name="email" placeholder="email" onChange={handlechange} />
                            <Form.Control type="password" name="password" placeholder="Password" onChange={handlechange} />
                            <Button variant="primary" type="submit">
                                {isregisterLoading ? "Creating your account" : "Register"}
                            </Button>
                            {registerError?.error && (
                                <Alert variant="danger">
                                <p>{registerError?.message}</p>
                                </Alert>

                            )}

                        </Stack>
                    </Col>
                </Row>
            </Form>
        </>);
}

export default Register;