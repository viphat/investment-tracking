import React, { useState } from 'react';
import { DatabaseInfo } from './DatabaseInfo'
import { CategoriesList } from './CategoriesList'
import { SummaryByCategories } from './SummaryByCategories'
import { Meteor } from 'meteor/meteor';

export const numberWithCommas = (x) => {
  if (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  if (x === 0) {
    return 0
  }

  return
}

export const tailwindColorMapping = (color) => {
  if (color === 'default') {
    return 'indigo'
  }

  if (color === 'brown') {
    return 'amber'
  }

  return color
}

export const App = () => {
  const [isLoading, setIsLoading] = useState(false)

  const syncWithNotion = () => {
    setIsLoading(true)

    Meteor.call('notion.fetchAll', {}, (err, res) => {
      if (err) {
        alert(err)
      } else {
        setTimeout(() => {
          setIsLoading(false)
        }, 10000)
      }
    })
  }

  const dataAggregate = () => {
    setIsLoading(true)

    Meteor.call('data.aggregate', {}, (err, res) => {
      if (err) {
        alert(err)
      } else {
        setTimeout(() => {
          setIsLoading(false)
        }, 10000)
      }
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className='py-8 text-3xl text-red-500 text-center'>Dương Đào Family Investment Tracking Application</h1>

        <DatabaseInfo />
        <button disabled={isLoading} type='button' className={`display-block inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${ isLoading ? 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500' } focus:outline-none focus:ring-2 focus:ring-offset-2`} onClick={syncWithNotion}>Sync with Notion</button>

        <button disabled={isLoading} type='button' className={`display-block ml-4 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${ isLoading ? 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500' : 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500' } focus:outline-none focus:ring-2 focus:ring-offset-2`} onClick={dataAggregate}>Data Aggregation</button>

        <CategoriesList />

        <SummaryByCategories />

        <hr className='mb-8'/>
      </div>
    </div>
  )
};
