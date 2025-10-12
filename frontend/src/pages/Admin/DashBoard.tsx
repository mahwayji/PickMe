import { UsersDataTable } from '@/components/Admin/User/Table'
import { axiosInstance } from '@/lib/axios'
import type { User } from '@/types/user'
import React, { useEffect, useState } from 'react'

const AdminDashBoard : React.FC= () => {
  const [data, setData] = useState<User[]>([])

  const fetchUsers = async () => {
    const {data} = await axiosInstance.get('/user')
    setData(data)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  
  return (
    <div>
      <h1 className = 'text-4xl font-bold'> Admin Dashboard</h1>
      <UsersDataTable data = {data} setData = {setData} fetchUsers = {fetchUsers} />
    </div>
  )
}

export default AdminDashBoard