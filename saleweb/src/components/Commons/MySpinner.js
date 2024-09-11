import { Spinner } from "react-bootstrap"

export default ({ animation = "grow", variant = "success" }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Spinner animation={animation} variant={variant} style={{ width: '100px', height: '100px' }} />
        </div>
    );
}