import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { verifyToken } from '@/services/authServices'

const Index = () => {
    const router = useRouter()
    useEffect(() => {
        const verifyAccessToken = async () => {
            try {
              await verifyToken();
              router.push('/dashboard/main')
            } catch (error) {
              console.log(error);
              router.push('/login');
            }
          };
          verifyAccessToken();
    }, [])
}

export default Index;