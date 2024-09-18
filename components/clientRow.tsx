import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileDown } from 'lucide-react';
import type { Detail } from '@prisma/client';
import * as XLSX from 'xlsx';

type ActivityType = 'Loading' | 'Unloading' | 'Daily Activities';

interface ClientRowProps {
  detail: Detail;
  index: number;
}

const ClientRow: React.FC<ClientRowProps> = ({ detail, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getItemColor = (type: ActivityType): string => {
    switch(type) {
      case 'Loading':
        return 'bg-white text-black';
      case 'Unloading':
        return 'bg-white text-black';
      case 'Daily Activities':
        return 'bg-white text-black';
      default:
        return 'bg-white text-black';
    }
  };

  const renderFormattedText = (items: string[], type: ActivityType): JSX.Element => {
    return (
      <div className={`space-y-4 ${isExpanded ? '' : 'max-h-20 overflow-hidden'}`}>
        {items.map((text, index) => (
          <pre key={index} className={`whitespace-pre font-mono text-xs ${getItemColor(type)} p-4 rounded overflow-x-auto`}>
            {text}
          </pre>
        ))}
      </div>
    );
  };

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([{
      'Detail ID': detail.id,
      'Loading': detail.Loading.join('\n'),
      'Unloading': detail.Unloading.join('\n'),
      'Daily Activities': detail.Daily_activities.join('\n')
    }]);
    
    XLSX.utils.book_append_sheet(workbook, worksheet, "Detail");
    XLSX.writeFile(workbook, `Detail_${detail.id}.xlsx`);
  };

  return (
    <>
      <tr className="bg-white border-b hover:bg-gray-50 transition duration-150 ease-in-out">
        <td className="py-4 px-4 font-medium text-gray-900 align-top">
          {index}
        </td>
        <td className="py-4 px-4 font-medium text-gray-900 align-top">
          {detail.id}
        </td>
        <td className="py-4 px-4 align-top">
          {renderFormattedText(detail.Loading, 'Loading')}
        </td>
        <td className="py-4 px-4 align-top">
          {renderFormattedText(detail.Unloading, 'Unloading')}
        </td>
        <td className="py-4 px-4 align-top">
          {renderFormattedText(detail.Daily_activities, 'Daily Activities')}
        </td>
        <td className="py-4 px-4 align-top">
          <button
            onClick={exportToExcel}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
          >
            <FileDown size={16} className="mr-1" />
            Export
          </button>
        </td>
      </tr>
      <tr>
        <td colSpan={6} className="py-2 px-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
          >
            {isExpanded ? (
              <>
                <ChevronUp size={16} className="mr-1" />
                See less
              </>
            ) : (
              <>
                <ChevronDown size={16} className="mr-1" />
                See more
              </>
            )}
          </button>
        </td>
      </tr>
    </>
  );
};

export default ClientRow;