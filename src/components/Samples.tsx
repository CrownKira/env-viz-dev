import React from 'react';
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom';
import { EnvVisualizer } from './EnvVisualizer';
import { Sample } from '../samples';
import { Libraries } from '../libraries';
import { loadingVisualizerText } from '../configs';
import '../styles/EnvVisualizer.css';

interface Props {
  samples: Sample[];
  selectedLib: Libraries;
  loading: boolean;
  renderLibButton: () => JSX.Element;
  renderContainer: () => JSX.Element | null;
}

export const Samples: React.FC<Props> = ({
  samples,
  selectedLib,
  loading,
  renderLibButton,
  renderContainer
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
      {renderContainer()}
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
