
import { useRef, useState } from "react";
import { Button, Container, Form} from "react-bootstrap";
import APIs, { endpoints } from "../../configs/APIs";
import { useNavigate } from "react-router-dom";

const Register = () => {

    const fields = [{
        label: "Tên người dùng",
        type: "text",
        field: "firstName"
    }, {
        label: "Họ và tên lót",
        type: "text",
        field: "lastName"
    }, {
        label: "Email",
        type: "text",
        field: "email"
    }, {
        label: "Điện thoại",
        type: "tel",
        field: "phone"
    }, {
        label: "Tên đăng nhập",
        type: "text",
        field: "username"
    }, {
        label: "Mật khẩu",
        type: "password",
        field: "password"
    }, {
        label: "Xác Nhận Mật khẩu",
        type: "password",
        field: "confirm"
    }];

    const [user, setUser] = useState({});
    const avatar = useRef();
    const nav = useNavigate();

    const change = (e, field) =>{
        setUser(current => {
            return {...current, [field]: e.target.value}
        })
    }

    const register = async(e) => {
        e.preventDefault();

        let form = new FormData();

        for (let key in user)
            if(key !== 'confirm')
                form.append(key,user[key]);
        
        if(avatar)
            form.append('avatar', avatar.current.files[0])

        try{
            let res = await APIs.post(endpoints['register'], form, {
                headers:{
                    'Content-Type': 'multipart/form-data'
                }
            });
            if( res.status === 201)
                nav("/login")
        }catch(ex){
            console.error(ex);
        }

    }

    return (
        <Container>
            <h1 className="text-center text-info mt-1">Đăng ký tài khoản</h1>
            <Form onSubmit={register}>
                {fields.map(f => <Form.Group key={f.field} className="mb-3" controlId={f.field}>
                    <Form.Label>{f.label}</Form.Label>
                    <Form.Control onChange={e => change(e, f.field)} value={user[f.field]} type={f.type} placeholder={f.label} />
                </Form.Group>)}

                <Form.Group className="mb-3" controlId="avatar">
                    <Form.Label>Ảnh đại diện</Form.Label>
                    <Form.Control type="file" accept=".png, .jpg" ref={avatar} />
                </Form.Group>
                    
                <Form.Group className="mb-3">
                    <Button type="submit" value="primary">Đăng ký</Button>
                </Form.Group>
            </Form>
        </Container>
    )
}
export default Register;