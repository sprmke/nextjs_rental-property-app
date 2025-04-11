'use client';

import React from 'react';

import { Loader2 } from 'lucide-react';

import {
  useGetAuthUserQuery,
  useUpdateManagerSettingsMutation,
} from '@/state/api';

import SettingsForm from '@/components/SettingsForm';

const TenantSettings = () => {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();

  const [updateManagerSettings, { isLoading: updateLoading }] =
    useUpdateManagerSettingsMutation();

  if (authLoading || updateLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin opacity-50" />
      </div>
    );

  const { cognitoId, name, email, phoneNumber } = authUser?.userInfo ?? {};

  const initialData = {
    name,
    email,
    phoneNumber,
  };

  const handleSubmit = async (data: typeof initialData) => {
    if (!cognitoId) return;

    await updateManagerSettings({
      cognitoId,
      ...data,
    });
  };

  return (
    <SettingsForm
      initialData={initialData}
      onSubmit={handleSubmit}
      userType="manager"
    />
  );
};

export default TenantSettings;
