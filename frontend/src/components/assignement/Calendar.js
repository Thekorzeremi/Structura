import React, { useState } from 'react';
import { useAuth } from '../../security/AuthContext';
import Select from '../ui/Select';

export default function Calendar() {
    const { user } = useAuth();

    const userSelectItems = [
        { name: 'En cours' },
        { name: 'Passé' },
        { name: 'A venir' },
    ];

    return (
        <div className='px-3'>
            <div className='flex flex-1 p-6 h-[calc(100vh-110px)] bg-white rounded-md shadow'>
                {user.roles.includes('ROLE_USER') &&
                    <Select items={userSelectItems} />

                }
            </div>
        </div>

    );

}