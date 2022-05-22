import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Categories, Tags, KeyValueStore, InvestmentRecords } from '/imports/api/databaseSchema';
import { numberWithCommas } from './App'
import { DATABASE_LAST_UPDATE_TIMESTAMP_KEY, SUM_TOTAL } from '/imports/api/const';

export const DatabaseInfo = () => {
  const lastUpdateTimeStampObj = useTracker(() => KeyValueStore.findOne({ key: DATABASE_LAST_UPDATE_TIMESTAMP_KEY }))

  return (
    <div className="my-8 flex flex-col">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope='col' className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-pink-500 sm:pl-6" colSpan="2">
                    Database Info
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">Last Update</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">{ lastUpdateTimeStampObj?.value }</td>
                </tr>

                <tr>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">Categories</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                  { Categories.find().count() }
                  </td>
                </tr>

                <tr>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">Tags</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">{ Tags.find().count() }</td>
                </tr>

                <tr>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">Investment (#)</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">{ InvestmentRecords.find().count() }</td>
                </tr>

                <tr>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">Total Assets</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">{ numberWithCommas(KeyValueStore.findOne({ key: SUM_TOTAL })?.value)} đ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
};
