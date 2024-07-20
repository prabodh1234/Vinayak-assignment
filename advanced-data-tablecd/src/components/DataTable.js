import React, { useState, useMemo } from 'react';
import { useTable, useSortBy, usePagination, useFilters, useGlobalFilter, useExpanded } from 'react-table';
import { FaSort, FaSortUp, FaSortDown, FaSearch, FaEye, FaFilter, FaLayerGroup, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import GroupingWindow from './GroupingWindow';
import ColumnVisibility from './ColumnVisibility';
import SortingWindow from './SortingWindow';
import FilterWindow from './FilterWindow';
import './DataTable.css';

const DataTable = ({ columns, data }) => {
  const [groupingWindowVisible, setGroupingWindowVisible] = useState(false);
  const [columnVisibilityWindowVisible, setColumnVisibilityWindowVisible] = useState(false);
  const [sortingWindowVisible, setSortingWindowVisible] = useState(false);
  const [filterWindowVisible, setFilterWindowVisible] = useState(false);
  const [groupedData, setGroupedData] = useState(data);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [columnVisibility, setColumnVisibility] = useState(columns.map(col => ({ ...col, isHidden: false })));
  const [dynamicColumns, setDynamicColumns] = useState(columns);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState([]);

  const handleGroup = () => {
    if (selectedGroup) {
      const grouped = [];
      data.forEach(item => {
        const groupValue = item[selectedGroup];
        if (!grouped.some(group => group.groupValue === groupValue)) {
          grouped.push({ groupValue, group: true, count: 0 });
        }
        grouped.push(item);
      });
      grouped.forEach(item => {
        if (item.group) {
          item.count = grouped.filter(i => i[selectedGroup] === item.groupValue).length - 1;
        }
      });
      setGroupedData(grouped);

      // Update columns to include the grouping column if it's not already present
      const groupingColumn = {
        Header: selectedGroup.charAt(0).toUpperCase() + selectedGroup.slice(1),
        accessor: selectedGroup,
        id: `group_${selectedGroup}`,
      };
      const newColumns = columns.some(column => column.accessor === selectedGroup)
        ? columns
        : [groupingColumn, ...columns];
      setDynamicColumns(newColumns);
    } else {
      setGroupedData(data);
      setDynamicColumns(columns);
    }
    setGroupingWindowVisible(false);
  };

  const handleClearGrouping = () => {
    setGroupedData(data);
    setSelectedGroup('');
    setDynamicColumns(columns);
    setGroupingWindowVisible(false);
  };

  const handleToggleColumn = columnId => {
    setColumnVisibility(prev =>
      prev.map(col => (col.id === columnId ? { ...col, isHidden: !col.isHidden } : col))
    );
  };

  const handleApplyColumnVisibility = () => {
    const visibleColumns = columnVisibility.filter(col => !col.isHidden);
    setDynamicColumns(visibleColumns);
    setColumnVisibilityWindowVisible(false);
  };

  const handleShowAllColumns = () => {
    setColumnVisibility(prev => prev.map(col => ({ ...col, isHidden: false })));
    setDynamicColumns(columns);
  };

  const handleSort = (columnId, direction) => {
    setSortBy([{ id: columnId, desc: direction === 'desc' }]);
  };

  const handleClearSort = () => {
    setSortBy([]);
  };

  const handleFilter = (columnId, value) => {
    setFilters(prev => ({ ...prev, [columnId]: value }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const filteredData = useMemo(() => {
    return groupedData.filter(row => {
      return Object.keys(filters).every(columnId => {
        const filterValue = filters[columnId]?.toLowerCase() || '';
        const rowValue = row[columnId]?.toString().toLowerCase() || '';
        return rowValue.includes(filterValue);
      });
    });
  }, [groupedData, filters]);

  const sortedData = useMemo(() => {
    if (!sortBy.length) return filteredData;
    const [{ id, desc }] = sortBy;
    return [...filteredData].sort((a, b) => {
      if (a[id] < b[id]) return desc ? 1 : -1;
      if (a[id] > b[id]) return desc ? -1 : 1;
      return 0;
    });
  }, [filteredData, sortBy]);

  const groupedColumns = useMemo(
    () => [
      {
        Header: ({ isAllRowsExpanded, toggleAllRowsExpanded }) => (
          <span {...{ onClick: () => toggleAllRowsExpanded() }}>
            {isAllRowsExpanded ? <FaChevronDown /> : <FaChevronRight />}
          </span>
        ),
        id: 'expander',
        Cell: ({ row }) => (
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? <FaChevronDown /> : <FaChevronRight />}
          </span>
        ),
        SubCell: () => null,
      },
      ...dynamicColumns,
    ],
    [dynamicColumns]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    toggleAllRowsExpanded,
    isAllRowsExpanded,
  } = useTable(
    {
      columns: groupedColumns,
      data: sortedData,
      initialState: { pageSize: 10, sortBy }, // Set default page size to 10 and sorting state
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    useExpanded,
    usePagination
  );

  const { pageIndex, pageSize, globalFilter } = state;

  return (
    <div>
      <div className="search-container">
        <div className="search-input-container">
          <FaSearch className="search-icon" />
          <input
            value={globalFilter || ''}
            onChange={(e) => setGlobalFilter(e.target.value || undefined)}
            placeholder="Search"
            className="search-input"
          />
        </div>
        <div className="icon-container">
          <FaEye className="table-icon" onClick={() => setColumnVisibilityWindowVisible(true)} />
          <FaFilter className="table-icon" onClick={() => setFilterWindowVisible(true)} />
          <FaLayerGroup className="table-icon" onClick={() => setGroupingWindowVisible(true)} />
          <FaSort className="table-icon" onClick={() => setSortingWindowVisible(true)} />
        </div>
      </div>
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? <FaSortDown />
                        : <FaSortUp />
                      : <FaSort />}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            const rowData = row.original;
            if (rowData.group) {
              return (
                <tr {...row.getRowProps()}>
                  <td colSpan={dynamicColumns.length + 1} style={{ fontWeight: 'bold' }}>
                    {rowData.groupValue} ({rowData.count})
                  </td>
                </tr>
              );
            }
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination-container">
        <div className="pagination">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </button>
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </button>
          {pageOptions.map(pageNumber => (
            <button
              key={pageNumber}
              onClick={() => gotoPage(pageNumber)}
              className={pageIndex === pageNumber ? 'active' : ''}
            >
              {pageNumber + 1}
            </button>
          ))}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </button>
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </button>
        </div>
        <div className="page-size">
          <select
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
      {columnVisibilityWindowVisible && <div className="shadow-overlay show" />}
      {groupingWindowVisible && <div className="shadow-overlay show" />}
      {sortingWindowVisible && <div className="shadow-overlay show" />}
      {filterWindowVisible && <div className="shadow-overlay show" />}
      <GroupingWindow
        show={groupingWindowVisible}
        onClose={() => setGroupingWindowVisible(false)}
        onGroup={handleGroup}
        onClear={handleClearGrouping}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
      />
      <ColumnVisibility
        show={columnVisibilityWindowVisible}
        columns={columnVisibility}
        onToggleColumn={handleToggleColumn}
        onClose={() => setColumnVisibilityWindowVisible(false)}
        onApply={handleApplyColumnVisibility}
        onShowAll={handleShowAllColumns}
      />
      <SortingWindow
        show={sortingWindowVisible}
        columns={dynamicColumns}
        onSort={handleSort}
        onClose={() => setSortingWindowVisible(false)}
        onClearSort={handleClearSort}
      />
      <FilterWindow
        show={filterWindowVisible}
        columns={columns}
        filters={filters}
        setFilter={handleFilter}
        onClose={() => setFilterWindowVisible(false)}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
};

export default DataTable;
