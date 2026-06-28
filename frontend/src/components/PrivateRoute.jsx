import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function PrivateRoute({ children }) {
    const { accessToken } = useAuth();
    return accessToken ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute