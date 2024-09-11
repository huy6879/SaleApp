import cookie from "react-cookies";
import { useContext, useState } from "react";
import { Alert, Button, Container, Form, Table } from "react-bootstrap";
import { MyCartContext, MyUserContext } from "../../App";
import { Link } from "react-router-dom";
import { authApi, endpoints } from "../../configs/APIs";

const Cart = () => {
    // Lấy thông tin người dùng từ context
    const user = useContext(MyUserContext);

    // Lấy thông tin giỏ hàng từ cookie và khởi tạo state
    const [cart, setCart] = useState(cookie.load('cart') || {});

    // Lấy dispatch function từ cart context
    const [, cartDispatch] = useContext(MyCartContext);


    // Hàm để xóa sản phẩm khỏi giỏ hàng
    const deleteItems = (item) => {
        // Tạo bản sao của giỏ hàng hiện tại
        const updatedCart = { ...cart };

        // Xóa sản phẩm khỏi bản sao giỏ hàng
        if (item.id in updatedCart) {
            // Gửi hành động để giảm số lượng sản phẩm trong giỏ hàng
            cartDispatch({
                type: "dec",
                payload: updatedCart[item.id]["quantity"]
            });

            // Xóa sản phẩm khỏi giỏ hàng
            delete updatedCart[item.id];

            // Kiểm tra xem giỏ hàng có rỗng không
            if (Object.keys(updatedCart).length === 0) {
                // Xóa giỏ hàng khỏi cookie và trạng thái nếu giỏ hàng rỗng
                cookie.remove("cart");
                setCart({});
            } else {
                // Cập nhật giỏ hàng vào cookie và trạng thái nếu giỏ hàng không rỗng
                cookie.save("cart", updatedCart);
                setCart(updatedCart);
            }
        }
    }

    // Hàm để cập nhật thông tin sản phẩm
    const updateItem = () => {
        cookie.save("cart", cart);

        let sum = Object.values(cart).reduce((init, current) => init + current["quantity"], 0);

        cartDispatch({
            type: "update",
            payload: sum
        });
    }

    const pay = () => {
        const process = async() => {
            let res = await authApi().post(endpoints['pay'], cart);
            
            if(res.status === 200){
                cookie.remove("cart");
                setCart({});
            }
        }

        process();
    }

    if(Object.keys(cart).length === 0)
        <Alert variant="success">Thanh toán thành công ! </Alert>

    
    return (
        <Container>
            <h1 className="text-center text-info mt-1">GIỎ HÀNG</h1>
            {Object.keys(cart).length === 0 ? (
                <Alert variant="danger">Không có sản phẩm nào trong giỏ</Alert>
            ) : (
                <>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Mã sản phẩm</th>
                                <th>Tên sản phẩm</th>
                                <th>Đơn giá</th>
                                <th>Số lượng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(cart).map(c => (
                                <tr key={c.id}>
                                    <td>{c.id}</td>
                                    <td>{c.name}</td>
                                    <td>{c.unit_price}</td>
                                    <td>
                                        <Form.Control
                                            type="number"
                                            onBlur={updateItem}
                                            value={cart[c.id]?.quantity || 0}
                                            onChange={e => setCart({
                                                ...cart,
                                                [c.id]: { ...cart[c.id], quantity: parseInt(e.target.value) }
                                            })}
                                        />
                                    </td>
                                    <td>
                                        <Button variant="danger" onClick={() => deleteItems(c)}>&times;</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    {user === null ? (
                        <p>
                            Vui lòng <Link to="/login?next=/cart">Đăng Nhập</Link> để thanh toán
                        </p>
                    ) : (
                        <Button onClick={pay} variant="primary" className="m-1">Thanh Toán</Button>
                    )}
                </>
            )}
        </Container>
    );
}

export default Cart;
