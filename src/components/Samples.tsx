import React from 'react';
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom';
import '../styles/EnvVisualizer.css';
import { EnvVisualizer } from './EnvVisualizer';
import { Sample } from '../samples';
import { Libraries } from '../libraries';
import { loadingVisualizerText } from '../configs';

interface Props {
  children: React.ReactNode;
  samples: Sample[];
  renderLibButton: () => JSX.Element;
  selectedLib: Libraries;
  loading: boolean;
}

export const Samples: React.FC<Props> = ({
  children,
  samples,
  renderLibButton,
  selectedLib,
  loading
}) => {
  const { path } = useRouteMatch();

  return (
    <>
      <div className="ui horizontal list">
        {renderLibButton()}
        {samples.map(({ id, name }) => (
          <Link key={id} to={`${path}/${id}`} className="ui button">
            {name}
          </Link>
        ))}
      </div>

      {loading && <p>{loadingVisualizerText}</p>}
      {children}
      <Switch>
        <Redirect exact from={`${path}`} to={`${path}/0`} />
        <Route
          exact
          path={`${path}/:id`}
          render={({
            match: {
              params: { id }
            }
          }) => loading || <EnvVisualizer sample={samples[id]} selectedLib={selectedLib} />}
        />
      </Switch>
    </>
  );
};
