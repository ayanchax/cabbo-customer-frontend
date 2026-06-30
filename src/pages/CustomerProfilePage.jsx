import React from 'react'
import {AppLayout} from "@/layouts";
import { ProfileInformation } from '@/features/customer'

function CustomerProfilePage() {
  return (
    <AppLayout>
        <ProfileInformation/>
    </AppLayout>
  )
}

export default CustomerProfilePage