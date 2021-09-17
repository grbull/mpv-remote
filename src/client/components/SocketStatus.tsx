import cn from 'classnames';
import React, { ReactElement } from 'react';

import { SocketStatus } from '../hooks/useSocket';

interface Props {
  status: SocketStatus;
}

export function SocketStatus({ status }: Props): ReactElement {
  return (
    <div className="p-2">
      <span
        className={cn('h-3 w-3 rounded-full inline-block mx-3', {
          'bg-gray-500': status === 'Connecting',
          'bg-yellow-500': status === 'Reconnecting',
          'bg-green-500': status === 'Connected',
          'bg-red-500': status === 'Disconnected',
        })}
      />
      {status}
    </div>
  );
}
