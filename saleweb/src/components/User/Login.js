import { Button, Container, Form } from "react-bootstrap";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import cookie from "react-cookies";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useContext, useState } from "react";
import { MyDispatchContext } from "../../App";



const Login = () => {

    const fields = [{
        label: "Tên đăng nhập",
        type: "text",
        field: "username"
    }, {
        label: "Mật khẩu",
        type: "password",
        field: "password"
    }];

    
    const [user, setUser] = useState({});

    const dispatch = useContext(MyDispatchContext);

    const nav = useNavigate();

    const [q] = useSearchParams();

    const change = (e, field) => {
        setUser(current => {
            return { ...current, [field]: e.target.value }
        })
    }

    const login = async (e) => {
        e.preventDefault();
        try {
            let res = await APIs.post(endpoints['login'], { ...user });
            console.info(res.data);
            cookie.save("token", res.data);

            let u = await authApi().get(endpoints['current-user'])

            console.info(u.data);
            cookie.save("user", u.data);

            dispatch({
                "type": "login",
                "payload": u.data
            });
            nav("/")
        } catch (ex) {
            console.error(ex);
        }
    }



    return (
        <Container>
            <h1 className="text-center text-info mt-1">ĐĂNG NHẬP NGƯỜI DÙNG</h1>
            <Form onSubmit={login}>
                
                {fields.map(f => <Form.Group key={f.field} className="mb-3" controlId={f.field}>
                    <Form.Label>{f.label}</Form.Label>
                    <Form.Control onChange={e => change(e, f.field)} value={user[f.field]} type={f.type} placeholder={f.label} />
                </Form.Group>)}

                <Form.Group className="mb-3">
                    <Button type="submit" value="primary">Đăng nhập</Button>
                </Form.Group>

            </Form> 
        </Container>
    )
}
export default Login;