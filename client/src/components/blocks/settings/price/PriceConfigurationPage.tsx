import { Outlet, useNavigate } from "react-router";
import Button from "../../../../whitelabel/src/atoms/button/A-Button";
import TableFooterPagination from "../../../../whitelabel/src/atoms/pagination/A-TableFooterPagination";
import Table from "../../../../whitelabel/src/molecules/table/M-table";
import { PriceConfigurationPageData } from "./priceConfigurationPage.data";

const PriceConfigurationPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateCreateProduct = () => {
    navigate("new");
  };
  return (
    <div>
      <div className="uk-inline">
        <br />
        <Button
          {...PriceConfigurationPageData.createNewProductButton}
          onClick={handleNavigateCreateProduct}
        />
      </div>
      <Table {...PriceConfigurationPageData.table} />
      <TableFooterPagination {...PriceConfigurationPageData.pagination} />
    </div>
  );
};

export default PriceConfigurationPage;
