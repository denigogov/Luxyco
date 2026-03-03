import Button from "../../../../whitelabel/src/atoms/button/A-Button";
import TableFooterPagination from "../../../../whitelabel/src/atoms/pagination/A-TableFooterPagination";
import ActiveTag from "../../../../whitelabel/src/molecules/activeTag/ActiveTag";
import Table from "../../../../whitelabel/src/molecules/table/M-table";
import TableFilter from "../../../../whitelabel/src/molecules/tableFilter/M_tableFilter";
import TableSort from "../../../../whitelabel/src/molecules/tableSort/M_tableSort";
import { allOrdersData } from "./AllOrders.data";

const AllOrders: React.FC = () => {
  return (
    <div>
      <div
        id="orders-filters"
        uk-offcanvas="overlay: true; flip: true; container"
      >
        <button
          className="uk-offcanvas-close"
          type="button"
          data-uk-close
        ></button>
        <div className="uk-offcanvas-bar">
          <TableFilter {...allOrdersData.filterData} />
        </div>
      </div>

      <TableSort {...allOrdersData.sortData} />
      <Button {...allOrdersData.filterOpenButton} />
      <ActiveTag {...allOrdersData.tags} />
      <Table {...allOrdersData.table} />
      <TableFooterPagination {...allOrdersData.pagination} />
    </div>
  );
};

export default AllOrders;
