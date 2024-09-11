import { useEffect, useState } from "react";
import MySpinner from "../Commons/MySpinner";
import { Col, Container, Image, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import APIs, { endpoints } from "../../configs/APIs";

const ProductDetails = () => {
    const [product, setProduct] = useState(null);

    const { productId } = useParams();

    const loadProduct = async () => {
        try {
            let res = await APIs.get(endpoints['details'](productId));
            setProduct(res.data)
        } catch (ex) {
            console.error(ex);
        }
    }

    useEffect(() => {
        loadProduct();
    }, [productId]);

    return (
        <Container>
            <h1 className="text-center text-info mt-1">Chỉ Tiết Sản Phẩm</h1>
            {product === null ? <MySpinner /> : <>

                <Row>
                    <Col md={5} xs={6}>
                        <Image src={product.image} rounded fluid />
                    </Col>

                    <Col md={7} xs={6}>
                        <h1>{product.name}</h1>
                        <h4 className="text-danger">{product.price} VNĐ</h4>
                    </Col>
                </Row>
            </>}
        </Container>
    );
}

export default ProductDetails;