import React from 'react';
import { Group } from 'konva/types/Group';
import { Group as KonvaGroup } from 'react-konva';

interface Props {
  selector: string;
  enabled: boolean;
}

// make a portal implementation
export const Portal: React.FC<Props> = ({ selector, enabled, children }) => {
  // "selector" is a string to find another container to insert all internals
  // if can be like ".top-layer" or "#overlay-group"
  const outer = React.useRef<Group>(null);
  const inner = React.useRef<Group>(null);

  React.useEffect(() => {
    const stage = outer.current?.getStage();
    const newContainer = stage?.findOne(selector);
    if (enabled && newContainer) {
      inner.current?.moveTo(newContainer);
    } else {
      inner.current?.moveTo(outer.current);
    }
    // manually redraw layers
    outer.current?.getLayer()?.batchDraw();
    if (newContainer) {
      newContainer.getLayer()?.batchDraw();
    }
  }, [selector, enabled]);

  // for smooth movement we will have to use two group
  // outer - is main container
  // inner - that we will move into another container
  return (
    <KonvaGroup name="_outer_portal" ref={outer}>
      <KonvaGroup name="_inner_portal" ref={inner}>
        {children}
      </KonvaGroup>
    </KonvaGroup>
  );
};
