import Link from 'next/link'
import React from 'react'
import { FaGithub } from 'react-icons/fa'

const ProjectResources = () => {
    return (
        <Link href="https://github.com/narayan-raghuwanshi/admin-dashboard" target='_blank' className="bg-white rounded-full border-4 border-gray-800 fixed bottom-10 right-10">
            <FaGithub size={40} />
        </Link>
    )
}

export default ProjectResources
