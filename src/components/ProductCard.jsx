import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ image, title, desc, specs = [], link, variant = 'home' }) => {
  if (variant === 'home') {
    return (
      <Link to={link || '/products'} className="product-card-home">
        <div className="prod-img-box-home">
          <img src={image} alt={title} />
        </div>
        <h3 className="prod-title-home">{title}</h3>
      </Link>
    );
  }

  return (
    <div className="product-card-detailed">
      <div className="prod-img-box-det">
        <img src={image} alt={title} />
      </div>
      <div className="prod-info-det">
        <h3 className="prod-title-det">{title}</h3>
        {desc && <p className="prod-desc-det">{desc}</p>}
        {specs && specs.length > 0 && (
          <ul className="spec-list">
            {specs.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
