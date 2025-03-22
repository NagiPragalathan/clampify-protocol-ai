import React from 'react'
import { CustomLoginButton } from '../components/CustomLoginButton';

const Tasks = () => {
  return (
    <div className="pt-16 px-2">
      <div className='flex flex-col items-center justify-center pt-6'>
        <p className="text-3xl font-bold mb-6">Scheduled Tasks</p>
        <CustomLoginButton/>
      </div>
    </div>
  );
}

export default Tasks
