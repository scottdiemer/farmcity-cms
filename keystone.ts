/*
Welcome to Keystone! This file is what keystone uses to start the app.

It looks at the default export, and expects a Keystone config object.

You can find all the config options in our docs here: https://keystonejs.com/docs/apis/config
*/

import { config } from '@keystone-6/core';
import { statelessSessions } from '@keystone-6/core/session';
import 'dotenv/config'


// Look in the schema file for how we define our lists, and how users interact with them through graphql or the Admin UI
import { lists } from './schema';

// Keystone auth is configured separately - check out the basic auth setup we are importing from our auth file.
import { withAuth } from './auth';

const session =  statelessSessions({
      secret: process.env.SESSION_SECRET || "There should be a secret here!",
      maxAge: 60 * 60 * 8,
      secure: true,
    })

export default withAuth(
  // Using the config function helps typescript guide you to the available options.
  config({
    server: {
      port: 5000,
      cors: { origin: true, credentials: true},
    },
    // the db sets the database provider - we're using sqlite for the fastest startup experience
    db: {
      provider: 'postgresql',
      url: `postgres://${process.env.DB_URL}`,
    },
    // This config allows us to set up features of the Admin UI https://keystonejs.com/docs/apis/config#ui
    ui: {
      // For our starter, we check that someone has session data before letting them see the Admin UI.
      isAccessAllowed: (context) => !!context.session?.data,
    },
    lists,
    session,
    images: {
      upload: 'local',
      local: {
        storagePath: 'public/images',
        baseUrl: '/images'
      }
    },
  })
);

