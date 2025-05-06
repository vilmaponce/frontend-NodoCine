// frontend/src/components/pages/Unauthorized.jsx
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <h1>Acceso No Autorizado</h1>
      <p>No tienes permisos para acceder a esta página.</p>
      <Link to="/" className="btn btn-primary">
        Volver al Inicio
      </Link>
    </div>
  );
};

export default Unauthorized;