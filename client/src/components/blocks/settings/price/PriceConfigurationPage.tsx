import { useNavigate } from "react-router";
import Button from "../../../../whitelabel/src/atoms/button/A-Button";
import TableFooterPagination from "../../../../whitelabel/src/atoms/pagination/A-TableFooterPagination";
import Table from "../../../../whitelabel/src/molecules/table/M-table";
import { PriceConfigurationPageData } from "./priceConfigurationPage.data";
import { usePriceList } from "../../../../features/price/price.queries";
import {
  CreateOrderTags,
  mapPriceListToRow,
} from "./priceConfigurationPage.helpers";
import { useMemo } from "react";
import { useDataFilters } from "../../../../utils/hooks/useDataFilters";
import ActiveTag from "../../../../whitelabel/src/molecules/activeTag/ActiveTag";

const PriceConfigurationPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateCreateProduct = () => {
    navigate("new");
  };

  const { page, limit, setFilters } = useDataFilters();

  const params = useMemo(
    () => ({
      page: page ?? 1,
      limit,
    }),
    [page, limit],
  );

  const { data, isLoading, error } = usePriceList(params);
  const tableListData = data?.data ?? [];
  console.log(tableListData);

  const rows = useMemo(
    () => tableListData?.map(mapPriceListToRow),
    [tableListData],
  );

  const handleFilterReset = () => {
    setFilters({
      limit: undefined,
      page: undefined,
    });
  };

  const clearAllFilterTags = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    handleFilterReset();
  };

  const tags = CreateOrderTags({
    setFilters,
    limit,
    page,
  });

  if (isLoading) {
    return <h1>Loading</h1>;
  }

  if (error) {
    return <h1>Error Batej</h1>;
  }

  return (
    <div>
      <div className="uk-inline">
        <br />
        <Button
          {...PriceConfigurationPageData.createNewProductButton}
          onClick={handleNavigateCreateProduct}
        />
      </div>
      <br /> <br />
      <ActiveTag
        {...PriceConfigurationPageData.tags}
        items={tags}
        onClearAll={clearAllFilterTags}
        className="b-orders-tags"
      />
      <Table {...PriceConfigurationPageData.table} rows={rows} />
      <TableFooterPagination
        {...PriceConfigurationPageData.pagination}
        meta={(data as any)?.meta}
        onPageChange={(p) => setFilters({ page: p })}
        onLimitChange={(l) => setFilters({ limit: l, page: 1 })}
      />
    </div>
  );
};

export default PriceConfigurationPage;
