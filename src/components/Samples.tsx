import React, { useRef, useEffect, useState } from 'react';
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom';
import '../styles/EnvVisualizer.css';
import { EnvVisualiser } from './EnvVisualiser';
import useForceUpdate from '../utils/forceUpdate';
import { Sample } from '../samples';

interface Props {
  samples: Sample[];
  renderLibButton: Function;
}

export const Samples: React.FC<Props> = ({ samples, renderLibButton }) => {
  const [loading, setLoading] = useState(true);
  const envVisContainer = useRef(null);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    if (envVisContainer && (window as any).EnvVisualizer) {
      (window as any).EnvVisualizer.init(envVisContainer.current);
      setLoading(false);
    } else {
      const checkIfLoaded = () => {
        if (envVisContainer && (window as any).EnvVisualizer) {
          forceUpdate();
        } else {
          setTimeout(checkIfLoaded, 1000);
        }
      };
      checkIfLoaded();
    }
  }, [forceUpdate]);

  let { path } = useRouteMatch();
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
      <div ref={envVisContainer} className="sa-env-visualizer"></div>
      {loading && <p>loading environment visualiser..</p>}
      <Switch>
        <Redirect exact from={`${path}`} to={`${path}/0`} />
        <Route
          exact
          path={`${path}/:id`}
          render={({
            match: {
              params: { id }
            }
          }) => loading || <EnvVisualiser sample={samples[id]} />}
        />
      </Switch>
    </>
  );
};
