import React from 'react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ icon: Icon, title, link }) => {
  return (
    <Link to={link} className="service-card">
      <div className="service-icon-box">
        {typeof Icon === 'function' ? <Icon /> : Icon}
      </div>
      <h3 className="service-card-title">{title}</h3>
    </Link>
  );
};

export default ServiceCard;
