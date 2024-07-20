import React, { useMemo } from 'react';
import DataTable from './components/DataTable';
import data from './Data';

const App = () => {
  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        id: 'column_id',  // Unique id based on the column name
      },
      {
        Header: 'Name',
        accessor: 'name',
        id: 'column_name',  // Unique id based on the column name
      },
      {
        Header: 'Category',
        accessor: 'category',
        id: 'column_category',  // Unique id based on the column name
      },
      {
        Header: 'Subcategory',
        accessor: 'subcategory',
        id: 'column_subcategory',  // Unique id based on the column name
      },
      {
        Header: 'Created At',
        accessor: 'createdAt',
        id: 'column_createdAt',  // Unique id based on the column name
      },
      {
        Header: 'Updated At',
        accessor: 'updatedAt',
        id: 'column_updatedAt',  // Unique id based on the column name
      },
      {
        Header: 'Price',
        accessor: 'price',
        id: 'column_price',  // Unique id based on the column name
      },
      {
        Header: 'Sale Price',
        accessor: 'salePrice',
        id: 'column_salePrice',  // Unique id based on the column name
      },
    ],
    []
  );

  return (
    <div className="App">
      <h1>Advanced Data Table</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default App;
