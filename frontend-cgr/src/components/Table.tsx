import React, { useMemo, useState } from "react";
import { Input } from "./Input";

export type ColumnDef<T> = {
  header: string;
  render: (item: T) => React.ReactNode;
  sortable?: boolean;
};

type TableProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  loading?: boolean;
  tableName?: string;
  showSearch?: boolean;
  className?: string;
};

export function Table<T>({
  columns,
  data,
  loading = false,
  tableName,
  showSearch = true,
  className = "",
}: TableProps<T>) {
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter(row =>
      columns.some(
        col =>
          String(col.render(row)).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, data, columns]);

  return (
    <div className={`bg-white rounded-lg shadow overflow-x-auto ${className}`}>
      {(tableName || showSearch) && (
        <div className="flex justify-between items-center px-4 py-2 border-b bg-gray-50">
          {tableName && (
            <div className="text-lg font-bold text-gray-800">{tableName}</div>
          )}
          {showSearch && (
            <Input
              placeholder="Buscar..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-56"
            />
          )}
        </div>
      )}
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-100">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="p-2 text-left font-semibold text-gray-700"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center text-gray-400">
                Carregando...
              </td>
            </tr>
          ) : filteredData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center text-gray-400">
                Nenhum dado encontrado.
              </td>
            </tr>
          ) : (
            filteredData.map((row, idx) => (
              <tr key={idx} className="border-b last:border-none hover:bg-gray-50">
                {columns.map((col, jdx) => (
                  <td key={jdx} className="p-2">{col.render(row)}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}