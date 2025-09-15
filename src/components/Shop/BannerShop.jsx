import { FaStore } from "react-icons/fa";

const Banner = ({ shop }) => (
  <header className="banner">
    <div className="banner-content">
      {shop?.logo && <img src={shop.logo} alt="logo" className="shop-logo" />}
      <h1>{shop?.name || "Boutique de ..."}</h1>
      <p className="slogan">
        {shop?.description || "Découvrez nos produits exclusifs 🚀"}
      </p>
      {shop?.city && (
        <div className="shop-address">
          <FaStore /> {shop.district}
        </div>
      )}
    </div>
  </header>
);

export default Banner;
