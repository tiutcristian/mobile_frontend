import React from "react";

interface ButtonGroupProps {
  children: React.ReactNode;
  onClick?: ( index: number ) => void;
}

export default function ButtonGroup( props: ButtonGroupProps ) {
	const [selectedIndex, setSelectedIndex] = React.useState( 0 );
  return (
    <div className="inline-flex shadow-xs" role="group">
      {
        React.Children.map( props.children, ( child, index ) => {
          const isFirst = index === 0;
          const isLast = index === React.Children.count( props.children ) - 1;
          const isMiddle = !isFirst && !isLast;
          const baseClassName = 
            selectedIndex === index
            ? "px-4 py-2 text-sm font-medium text-white bg-blue-700 border border-blue-700 hover:bg-blue-800 hover:text-white dark:bg-blue-600 dark:border-blue-600 dark:hover:bg-blue-700 dark:hover:text-white dark:active:bg-blue-800"
            : "px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white dark:active:bg-gray-800";
          const className = isFirst
            ? `${baseClassName} border rounded-s-lg`
            : isLast
            ? `${baseClassName} border-r border-t border-b rounded-e-lg`
            : `${baseClassName} border-r border-t border-b`;
          return (
            <button
              key={index}
              type="button"
              className={className}
                onClick={() => {
                    setSelectedIndex( index );
                    if ( props.onClick ) {
                    	props.onClick( index );
                    }
                }}
            >
              {child}
            </button>
          );
        } )
      }
    </div>
  );
}