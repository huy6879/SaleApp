import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Product/Home";
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductDetails from "./components/Product/ProductDetails";
import Header from "./components/Commons/Header";
import Cart from "./components/Product/Cart";
import Register from "./components/User/Register";
import Login from "./components/User/Login";
import { createContext, useReducer } from "react";
import MyUserReducer from "./configs/Reducers.js";
import cookie from "react-cookies";
import { Container } from "react-bootstrap";
import MycartCountReducer from "./configs/MyCartCountReducer.js";
export const MyUserContext = createContext(null);
export const MyDispatchContext = createContext(null);
export const MyCartContext = createContext(null);


const countCart = () => {
  let cart = cookie.load("cart") || null;
  if(cart !== null)
    return Object.values(cart).reduce((init, current) => init + current["quantity"], 0);

  return 0;
}

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, cookie.load("user") || null);
  const [cartCounter, carDispatch] = useReducer(MycartCountReducer, countCart());

  return (
    <BrowserRouter>
      <MyUserContext.Provider value={user}>
        <MyDispatchContext.Provider value={dispatch}>
          <MyCartContext.Provider value={[cartCounter, carDispatch]}>
            <Header />
            <Container>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products/:productId" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </Container>
          </MyCartContext.Provider>
        </MyDispatchContext.Provider>
      </MyUserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
