"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, TextInput, Pagination } from "flowbite-react";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  itemsPerPage?: number;
  onRowClick?: (item: T) => void;
}

export default function DataTable<T extends { id: string | number }>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = "Search...",
  searchKeys,
  itemsPerPage = 10,
  onRowClick,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Get search keys from columns if not provided
  const defaultSearchKeys = searchKeys || (columns.map((col) => col.key) as (keyof T)[]);

  // Filter data based on search query
  const filteredData = searchable
    ? data.filter((item) =>
        defaultSearchKeys.some((key) => {
          const value = item[key];
          return value?.toString().toLowerCase().includes(searchQuery.toLowerCase());
        })
      )
    : data;

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on search
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Search Bar */}
      {searchable && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <TextInput
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full"
            icon={() => (
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            {/*
              FIX: The hydration error '<th> cannot be a child of <thead>' 
              is solved by wrapping the header cells in a <TableRow> component.
            */}
            <TableRow>
              {columns.map((column, index) => (
                <TableHeadCell key={index}>{column.label}</TableHeadCell>
              ))}
            </TableRow>
          </TableHead>
          
          <TableBody className="divide-y">
            {currentData.length > 0 ? (
              currentData.map((item) => (
                <TableRow
                  key={item.id}
                  className="bg-white hover:bg-gray-50"
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className={onRowClick ? "cursor-pointer" : ""}
                    >
                      {column.render
                        ? column.render(item)
                        : (item[column.key as keyof T] as React.ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-gray-500">
                  {data.length === 0
                    ? "No data"
                    : "No data found matching your search."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredData.length > 0 && (
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(endIndex, filteredData.length)}
            </span>{" "}
            of <span className="font-medium">{filteredData.length}</span> entries
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            showIcons
          />
        </div>
      )}
    </div>
  );
}