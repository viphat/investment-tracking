import React, { useState } from 'react';
import { DatabaseInfo } from './DatabaseInfo'
import { Meteor } from 'meteor/meteor';

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className='py-8 text-3xl text-red-500 text-center'>Dương Đào Family Investment Tracking Application</h1>

        <DatabaseInfo />
        <button disabled={isLoading} type='button' className={`display-block inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${ isLoading ? 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500' } focus:outline-none focus:ring-2 focus:ring-offset-2`} onClick={syncWithNotion}>Sync with Notion</button>
      </div>
    </div>
  )
};
