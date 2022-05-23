import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import { Categories, KeyValueStore } from '/imports/api/databaseSchema';
import { tailwindColorMapping, hightChartsColorMapping, numberWithCommas } from './App'

export const getTotalByCategory = (category) => {
  var record = KeyValueStore.findOne({ key: `sum-${category['_id']}` })

  return record?.value
}

export const SummaryByCategories = () => {
  const [total, setTotal] = useState(0)
  const [categories, setCategories] = useState([])
  const [highChartsOptions, setHighChartsOptions] = useState({})
  const categoriesFromDB = useTracker(() => Categories.find({ name: { $nin: ['Insurance'] } }).fetch())

  useEffect(() => {
    if (categories.length === 0) {
      var t = 0
      var arr = []

      categoriesFromDB.forEach((category) => {
        var totalByCategory = getTotalByCategory(category)
        arr.push({
          ...category,
          ...{
            total: totalByCategory
          }
        })

        t = t + totalByCategory
      })

      arr.forEach((category) => {
        category['percent'] = (category['total'] / t * 100.0).toFixed(2)
      })

      setTotal(t)
      const sortedArr = arr.sort((a, b) => b.total - a.total)
      setCategories(sortedArr)

      const highChartsData = sortedArr.map((category) => {
        return {
          name: category.name,
          y: parseFloat(category.percent),
          color: hightChartsColorMapping(category.color),
        }
      })

      if (highChartsData.length > 0) {
        highChartsData[0]['selected'] = true
        highChartsData[0]['sliced'] = true

        const options = {
          title: {
            text: 'Summary'
          },
          chart: {
            type: 'pie',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
          },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
              }
            }
          },
          series: [{
            name: 'Categories',
            colorByPoint: true,
            data: highChartsData
          }]
        }

        setHighChartsOptions(options)
      }
    }
  }, [categoriesFromDB, setHighChartsOptions, setCategories, setTotal])

  return (
    <div className="my-8 flex flex-col">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr className="divide-x divide-gray-200">
                  <th scope="col" className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-6">Category</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Percent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {
                  categories.map((category) => (
                    <tr key={`sum-${category['_id']}`} className="divide-x divide-gray-200">
                      <td className={`whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium sm:pl-6 bg-${tailwindColorMapping(category.color)}-100 text-${tailwindColorMapping(category.color)}-800`}>{ category.name }</td>
                      <td className={`whitespace-nowrap bg-${tailwindColorMapping(category.color)}-100 p-4 text-sm ${ category.total < 0 ? 'text-red-500' : 'text-gray-500' }`}>{ numberWithCommas(category.total) } đ</td>
                      <td className={`whitespace-nowrap py-4 pl-4 pr-4 text-sm bg-${tailwindColorMapping(category.color)}-100 ${ category.percent < 0 ? 'text-red-500' : 'text-gray-500'} sm:pr-6`}>{ category.percent }%</td>
                    </tr>
                  ))
                }
                <tr className="divide-x divide-gray-200">
                  <td className={`whitespace-nowrap py-4 pl-4 pr-4 text-sm font-bold sm:pl-6 bg-fuchsia-100 text-fuchsia-800`}>Total</td>
                  <td className="font-bold bg-fuchsia-100 whitespace-nowrap p-4 text-sm text-gray-500">{ numberWithCommas(total) } đ</td>
                  <td className="font-bold bg-fuchsia-100 whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {highChartsOptions && (
        <div className='my-8 w-full flex justify-center items-center'>
          <HighchartsReact
            highcharts={Highcharts}
            options={highChartsOptions}
          />
        </div>
      )}
    </div>
  )
};
