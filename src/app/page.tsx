import ProjectResources from '@/components/ProjectResources'
import Table from '@/components/Table'
import Image from 'next/image'

export default function Home() {
  return (
    <div>
      <ProjectResources />
      <div className='flex flex-col items-center mt-20'>
        <h2 className='mb-10 text-4xl sm:text-5xl font-semibold'>Admin <span className='text-blue-600'>dashboard.</span></h2>
      </div>
      <Table />
    </div>
  )
}
