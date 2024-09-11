import { useContext, useEffect, useState } from "react";
import { Badge, Button, Col, Container, Form, Image, Nav, Navbar, NavDropdown, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import APIs, { endpoints } from "../../configs/APIs.js";
import MySpinner from "./MySpinner.js";
import { MyCartContext, MyDispatchContext, MyUserContext } from "../../App";



const Header = () => {

    const [categories, setCategories] = useState([]);
    const cartCounter = useContext(MyCartContext);
    const [q, setQ] = useState("");
    // const [cateId, setCateId] = useState("");
    const nav = useNavigate();

    const user = useContext(MyUserContext)

    const dispatch = useContext(MyDispatchContext);

    const loadCates = async () => {
        try {
            const res = await APIs.get(endpoints['categories']);
            setCategories(res.data);
        } catch (ex) {
            console.error(ex);
        }
    }

    useEffect(() => {
        loadCates();
    }, []);

    const search = (e, cateId) => {
        e.preventDefault();
        // setCateId(cateId);
        nav(`/?cateId=${cateId}`);
    }

    const submit = (e) => {
        e.preventDefault();

        nav(`/?kw=${q}`);
    }

    return (<>
        {categories === null ? <MySpinner /> : <>

            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="#home">E-Commerce WebSite</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Link className="nav-link" to="/">Trang chủ</Link>
                            {/* <Nav.Link href="#link">Link</Nav.Link> */}
                            <NavDropdown title="Danh Mục" id="basic-nav-dropdown">
                                {categories.map(c => <NavDropdown.Item key={c.id} href="#" onClick={e => search(e, c.id)}>{c.name}</NavDropdown.Item>)}
                            </NavDropdown>

                            {user === null ? <>
                                <Link className="nav-link text-success" to="/register">Đăng ký</Link>
                                <Link className="nav-link text-info" to="/login">Đăng nhập</Link>
                            </> : <>
                                <Link className="nav-link text-success" to="/">
                                    <Image src={user.avatar} width="40" roundedCircle /> {user.username} 
                                </Link>

                                <Link onClick={() => dispatch({"type" : "logout"})} className="nav-link">Đăng xuất</Link>
                            </>}

                            <Link className="nav-link" to="/cart">&#128722; <Badge bg="danger">{cartCounter}</Badge></Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
                <Form inline onSubmit={submit}>
                    <Row>
                        <Col xs="auto">
                            <Form.Control
                                type="text" value={q} onChange={e => setQ(e.target.value)} placeholder="Tìm sản phẩm...." className=" mr-sm-2" />
                        </Col>
                    </Row>
                </Form>
                <Col xs="auto">
                    <Button type="submit">Tìm</Button>
                </Col>
            </Navbar>
        </>}

    </>);

};
export default Header;



