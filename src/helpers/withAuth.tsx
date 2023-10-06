import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { verifyToken } from '@/services/authServices';

const withAuth = (WrappedComponent:React.FC) => {
  const Wrapper = (props:any) => {
    const router = useRouter();

    useEffect(() => {
      const verifyAccessToken = async () => {
        try {
          const response = await verifyToken();
          if(response?.status === 201){
            if(window.location.pathname === "/login"){
              router.push('/dashboard/main');
            }
          }else{
            router.push('/login');
          }
        } catch (error) {
          console.log(error);
          router.push('/login');
          return null
        }
      };

      verifyAccessToken();
    }, []);
    return <WrappedComponent {...props} />
  };
  return Wrapper;
};

export default withAuth;