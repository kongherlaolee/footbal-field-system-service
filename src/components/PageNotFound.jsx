import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function PageNotFound() {
  const location = useLocation();
  return (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'

    }}>
        <h1>
            Ops!
        </h1>
       
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
      <Link to={`/dashboard`}>
        Go to HomePage
      </Link>

    </div>
  );
}
