import { createSelector } from 'reselect'

export const getResultTraces = createSelector((traces) => {
    return traces.filter((trace) => {
      return trace.message.msg === 'result';
    });
  }
)