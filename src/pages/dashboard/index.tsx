import React, { useEffect, useState } from "react";
import withAuth from "@/helpers/withAuth";
import { useRouter } from 'next/router'
const Dashboard: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/dashboard/main")
    return () => {
    };
  }, []);
  return(
    null
  )};
  
  export default withAuth(Dashboard);
