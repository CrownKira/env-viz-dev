import React, { useRef, useEffect, useState } from 'react';
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom';
import '../styles/EnvVisualizer.css';
import { EnvVisualiser } from './EnvVisualiser';
import useForceUpdate from '../utils/forceUpdate';
import { Sample } from '../samples';

import { Libraries } from '../libraries';

interface Props {
  samples: Sample[];
  renderLibButton: Function;
  selectedLib: Libraries;
}

export const Samples: React.FC<Props> = ({ samples, renderLibButton, selectedLib }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const envVisContainer = useRef<HTMLDivElement>(null);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    envVisContainer && envVisContainer.current && (envVisContainer.current.innerHTML = '');

    switch (selectedLib) {
      case Libraries.ConcreteJs:
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
        break;

      case Libraries.KonvsJs:
        break;

      default:
        console.error('Please select a Library first');
    }
  }, [forceUpdate, selectedLib]);

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
          }) => loading || <EnvVisualiser sample={samples[id]} selectedLib={selectedLib} />}
        />
      </Switch>
    </>
  );
};
