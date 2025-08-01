import axios from 'axios'
import { useEffect, useState } from 'react'

export function useGetUser() {
  const [user, setUser] = useState<any>()
  useEffect(() => {
    const fecthUser = async () => {
      const { data } = await axios.get('/api/auth/me')
      console.log(data)
      setUser(data)
    }
    fecthUser()
  }, [])
  return { user }
}
