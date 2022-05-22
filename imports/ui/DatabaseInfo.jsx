import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { KeyValueStore } from '/imports/api/databaseSchema';
import { DATABASE_LAST_UPDATE_TIMESTAMP_KEY } from '/imports/api/const';

export const DatabaseInfo = () => {
  const lastUpdateTimeStampObj = useTracker(() => KeyValueStore.findOne({ key: DATABASE_LAST_UPDATE_TIMESTAMP_KEY }))

  console.log(KeyValueStore.find().fetch())

  return (
    <div className="mb-8 flex">
      <label className="font-lg text-gray-700">Thời gian cập nhật CDSL gần nhất:</label>
      <span className='font-bold text-red-500 ml-4'>{ lastUpdateTimeStampObj?.value }</span>
    </div>
  )
};
