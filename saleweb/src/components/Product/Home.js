import { useContext, useEffect, useState } from "react";
import Apis, { endpoints } from "../../configs/APIs.js";
import { Button, Card, CardImgOverlay, Col, Container, Form, Nav, Navbar, NavDropdown, Row, Spinner } from "react-bootstrap";
import MySpinner from "../Commons/MySpinner";
import { useNavigate, useSearchParams } from "react-router-dom";
import cookie from "react-cookies";
import { MyCartContext } from "../../App.js";

const Home = () => {


    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(false);

    const [q ] = useSearchParams();
 
    const [page, setPage] = useState(1);

    const [, cartDispath] = useContext(MyCartContext);


    const nav = useNavigate();



    const loadProducts = async () => {
        setLoading(true);
        try {
            let url = `${endpoints['products']}?page=${page}`;
            // console.info(url);
            let cateId = q.get('cateId');
            if (cateId)
                url = `${url}&cateId=${cateId}`;
            let kw = q.get('kw');
            if(kw)
                url = `${url}&kw=${kw}`;
            
            console.info(url);
            const res = await Apis.get(url);
            if( page === 1)
                setProducts(res.data);
            else
                setProducts(current => {
                    return [...current, ...res.data];
                });

        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        loadProducts();
    }, [q, page]);

    const loadMore = () =>{
        if(!loading)
            setPage(page + 1);
    }

    const addToCart = (p) => {
        let cart = cookie.load("cart") || null;
        if (cart === null)
            cart = {};

        if (p.id in cart) {
            cart[p.id]["quantity"]++;
        } else {
            cart[p.id] = {
                "id": p.id,
                "name": p.name,
                "unit_price": p.price,
                "quantity": 1
            }
        }
        cartDispath({
            "type": "inc",
            "payload": 1
        })

        cookie.save("cart", cart);
        cookie.save(cartDispath);
        console.info(cart);
    }


    return (
        <>
                <Container>
                    {loading && <MySpinner />}
                    <Row>
                        {products.map(p => <>
                            <Col md={3} xs={12} className="p-2">
                                <Card>
                                    <Card.Img variant="top" src={p.image} />
                                    <Card.Body>
                                        <Card.Title>{p.name}</Card.Title>
                                        <Card.Text>{p.price} VNĐ</Card.Text>
                                        <Button variant="primary" className="m-1" onClick={() =>nav(`/products/${p.id}`)}>Xem chi tiết</Button>
                                        <Button variant="danger" className="m-1" onClick={() => addToCart(p)}>Đặt hàng</Button>
                                        </Card.Body>
                                </Card>
                            </Col>
                        </>)}
                    </Row>
                    <div className="text-center">
                        <Button variant="info" onClick={loadMore} disabled={loading}>Xem thêm</Button>
                    </div>
                </Container>
        </>
    );
}


export default Home;