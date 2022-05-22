import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Categories } from '/imports/api/databaseSchema';
import { tailwindColorMapping } from './App'

export const CategoriesList = () => {
  const categories = useTracker(() => Categories.find({}).fetch())

  return (
    <div className='my-8'>
      <div className='flex flex-wrap'>
        {
          categories.map((category) => (
            <span key={category.name} className={`inline-flex items-center mr-2 mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-${tailwindColorMapping(category.color)}-100 text-${tailwindColorMapping(category.color)}-800`}>
               { category.name }
            </span>
          ))
        }
      </div>
    </div>
  )
};
