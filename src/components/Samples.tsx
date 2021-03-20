import React, { useState } from 'react';
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom';
import { EnvVisualizer } from './EnvVisualizer';
import { Sample } from '../samples';
import { Libraries } from '../libraries';
import { loadingVisualizerText } from '../configs';
import '../styles/EnvVisualizer.css';
import { Container } from './Container';

interface Props {
  samples: Sample[];
  selectedLib: Libraries;
  renderLibButton: () => JSX.Element;
}

export const Samples: React.FC<Props> = ({ samples, selectedLib, renderLibButton }) => {
  const [loading, setLoading] = useState<boolean>(true);
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
      <Container selectedLib={selectedLib} setLoading={setLoading} />
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
