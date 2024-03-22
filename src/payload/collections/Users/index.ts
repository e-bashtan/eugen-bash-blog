import type { CollectionConfig } from 'payload/types'

import { email as validateEmail } from 'payload/dist/fields/validations'

import { admins } from '../../access/admins'
import { checkRole } from './checkRole'
import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'
import { loginAfterCreate } from './hooks/loginAfterCreate'

const Users: CollectionConfig = {
  access: {
    admin: ({ req: { user } }) => checkRole(['admin'], user),
    create: () => true,
    delete: () => true,
  },
  admin: {
    defaultColumns: ['name', 'email', 'code'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      // override default email field to add a custom validate function to prevent users from changing the login email
      name: 'email',
      type: 'email',
      validate: (value, args) => {
        // if (args?.user?.email === adminEmail && value !== adminEmail) {
        //   return 'You cannot change the admin password on the public demo!'
        // }
        // call the payload default email validation
        return validateEmail(value, args)
      },
    },
    {
      name: 'code',
      type: 'text',
    },
    {
      name: 'roles',
      access: {
        create: admins,
        read: admins,
        update: admins,
      },
      defaultValue: ['user'],
      hasMany: true,
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      options: [
        {
          label: 'admin',
          value: 'admin',
        },
        {
          label: 'user',
          value: 'user',
        },
      ],
      type: 'select',
    },
  ],
  hooks: {
    afterChange: [loginAfterCreate],
    beforeOperation: [],
  },
  slug: 'users',
  timestamps: true,
}

export default Users
