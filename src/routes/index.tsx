import React from 'react';
import { Route, Switch } from 'react-router-dom';

import routes from './routes';

export const Routes: React.FC = () => {
  return (
    <Switch>
      {routes.map(route => (
        <Route
          key={route.name}
          component={route.component}
          exact={route.exact}
          path={route.path}
        />
      ))}
    </Switch>
  );
};
