"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface AdminInterfaceProps { }

const Table: React.FC<AdminInterfaceProps> = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        const fetchUsers = async () => {
            await fetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json")
                .then((response) => response.json())
                .then(data => setUsers(data))
        }
        fetchUsers();
    }, [])

    const rowsPerPage: number = 10;

    const getTotalPages = () => {
        const filteredUsers = users.filter((user) => {
            const searchValue = searchQuery.toLowerCase();
            return (
                user.name.toLowerCase().includes(searchValue) ||
                user.email.toLowerCase().includes(searchValue) ||
                user.role.toLowerCase().includes(searchValue)
            );
        });

        return Math.ceil(filteredUsers.length / rowsPerPage);
    };
    const totalFilteredPages = getTotalPages();

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalFilteredPages) {
            setCurrentPage(page);
        }
    };
    const handleEdit = (id: number, field: string, value: string) => {
        const updatedUsers = users.map((user) =>
            user.id === id ? { ...user, [field]: value } : user
        );

        setUsers(updatedUsers);
    };

    const handleDelete = (id: number) => {
        const updatedUsers = users.filter((user) => user.id !== id);
        setUsers(updatedUsers);
        setSelectedRows([]);
    };

    const handleSearch = () => {
        const filteredUsers = users.filter((user) => {
            const searchValue = searchQuery.toLowerCase();
            return (
                user.name.toLowerCase().includes(searchValue) ||
                user.email.toLowerCase().includes(searchValue) ||
                user.role.toLowerCase().includes(searchValue)
            );
        });
        setUsers(filteredUsers);
    };

    const handleCheckboxChange = (id: number) => {
        const isSelected = selectedRows.includes(id);
        const updatedSelectedRows = isSelected
            ? selectedRows.filter((rowId) => rowId !== id)
            : [...selectedRows, id];

        setSelectedRows(updatedSelectedRows);
    };
    const handleSelectAll = () => {
        const allRowIdsOnPage = users
            .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
            .map((user) => user.id);

        const allSelected = allRowIdsOnPage.every((rowId) =>
            selectedRows.includes(rowId)
        );

        const updatedSelectedRows = allSelected
            ? selectedRows.filter((rowId) => !allRowIdsOnPage.includes(rowId))
            : [...selectedRows, ...allRowIdsOnPage];

        setSelectedRows(updatedSelectedRows);
    };
    const handleDeleteSelected = () => {
        const updatedUsers = users.filter(
            (user) => !selectedRows.includes(user.id)
        );
        setUsers(updatedUsers);
        setSelectedRows([]);
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search...."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-2 border border-gray-300 mr-2 rounded-lg"
                />
                <button
                    className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md"
                    onClick={handleSearch}
                >
                    Search</button>
            </div>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="p-2 bg-gray-200 text-start">
                            <input
                                type="checkbox"
                                className='h-6 w-6 border-2 border-gray-400 rounded-md checked:bg-blue-500 checked:border-transparent'
                                checked={selectedRows.length > 0}
                                onChange={handleSelectAll}
                            />
                        </th>
                        <th className="p-2 bg-gray-200 text-start">Name</th>
                        <th className="p-2 bg-gray-200 text-start">Email</th>
                        <th className="p-2 bg-gray-200 text-start">Role</th>
                        <th className="p-2 bg-gray-200 text-start">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.filter((user) => {
                        const searchValue = searchQuery.toLowerCase();
                        return (
                            user.name.toLowerCase().includes(searchValue) ||
                            user.email.toLowerCase().includes(searchValue) ||
                            user.role.toLowerCase().includes(searchValue)
                        );
                    })
                        .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                        .map((user) => (
                            <tr key={user.id} className={selectedRows.includes(user.id) ? 'bg-gray-100' : ''}>
                                <td className="p-2">
                                    <input
                                        type="checkbox"
                                        className='h-6 w-6 border-2 border-gray-400 rounded-md checked:bg-blue-500 checked:border-transparent'
                                        checked={selectedRows.includes(user.id)}
                                        onChange={() => handleCheckboxChange(user.id)}
                                    />
                                </td>
                                <td className="p-2">
                                    <input type="text" className='outline-none text-sm sm:text-md px-3 py-1 rounded-md' value={user.name}
                                        onChange={(e) => handleEdit(user.id, 'name', e.target.value)} />
                                </td>
                                <td className="p-2">
                                    <input type="text" className='outline-none text-sm sm:text-md px-3 py-1 rounded-md' value={user.email}
                                        onChange={(e) => handleEdit(user.id, 'email', e.target.value)} />
                                </td>
                                <td className="p-2">
                                    <input type="text" className='outline-none text-sm sm:text-md px-3 py-1 rounded-md' value={user.role}
                                        onChange={(e) => handleEdit(user.id, 'role', e.target.value)} />
                                </td>
                                <td className="p-2 flex gap-1">
                                    <button className='p-1 border border-gray-300 rounded-md hover:bg-red-50' onClick={() => handleDelete(user.id)}>
                                        <Image src={"/delete.png"} alt="delete logo" width={20} height={20} />
                                    </button>
                                </td>

                            </tr>
                        ))}</tbody>
            </table>
            <div className="mt-4 flex items-center">
                <button
                    className="bg-gray-200 px-3 py-1 rounded mr-2 hover:bg-gray-100"
                    onClick={() => handlePageChange(1)}
                >
                    First
                </button>
                <button
                    className="bg-gray-200 px-3 py-1 rounded mr-2 hover:bg-gray-100"
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    Previous
                </button>
                {Array.from({ length: totalFilteredPages }).map((_, index) => (
                    <button
                        key={index}
                        className={`${currentPage === index + 1 ? 'bg-black text-white' : 'bg-gray-200'
                            } px-3 py-1 rounded-md hover:bg-gray-100 mr-2`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    className="bg-gray-200 px-3 py-1 rounded mr-2 hover:bg-gray-100"
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Next
                </button>
                <button
                    className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-100"
                    onClick={() => handlePageChange(totalFilteredPages)}
                >
                    Last
                </button>
            </div>
            <button
                className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md mt-4"
                onClick={handleDeleteSelected}
            >
                Delete Selected
            </button>
        </div>
    );
};

export default Table;
