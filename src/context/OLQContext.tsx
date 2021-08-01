import { useCallback, useMemo, useState } from 'react';
import { createContext } from 'use-context-selector';
import * as api from '../services/api';
import { resolveAlgorithmOptions } from '../utils';

interface IArea {
  key: string;
  lat: number;
  lng: number;
}

interface ICandidate {
  lat: number;
  lng: number;
}
interface IMapCandidates {
  able: ICandidate[];
  disable: ICandidate[];
}
interface OLDContextType {
  algorithmDropDownOptions:
    | { id: string; value: string; label: string }[]
    | undefined;
  areas: { key: string; lat: number; lng: number }[] | undefined;

  initializeData: (
    responseAlgorithms: string[],
    responseAreas: IArea[]
  ) => void;

  onSelectId: (area: IArea | undefined) => void;
  selectedId: IArea | undefined;
  selectedAlgorithm: string | undefined;
  onSelectAlgorithm: (algorithm?: string | undefined) => void;
  // onRun: api.IRunParams;
  onRun: () => void;

  candidates: IMapCandidates;
  onNewCandidate: (candidate: ICandidate) => void;
  onRemoveCandidate: (index: number) => void;
}

export const OLDContext = createContext<OLDContextType>({} as OLDContextType);

export const OLQProvider: React.FC = ({ children }) => {
  const [algorithmDropDownOptions, setAlgorithmDropDownOptions] = useState<
    { id: string; value: string; label: string }[] | undefined
  >();

  const [areas, setAreas] =
    useState<{ key: string; lat: number; lng: number }[]>();

  const [selectedAlgorithm, setSelectedAlgorithm] = useState<
    string | undefined
  >();

  const [selectedId, setSelectedId] = useState<undefined | IArea>();

  const [candidates, setCandidates] = useState<IMapCandidates>({
    able: [],
    disable: [],
  });

  const initializeData = useCallback(
    (responseAlgorithms: string[], responseAreas: IArea[]) => {
      const resolvedAlgorithms = resolveAlgorithmOptions(responseAlgorithms);
      setAlgorithmDropDownOptions(resolvedAlgorithms);
      setAreas(responseAreas);
      setSelectedAlgorithm(responseAlgorithms[0]);
    },
    []
  );

  const onSelectId = useCallback(
    (area?: { key: string; lat: number; lng: number }) => {
      setSelectedId(area);
    },
    []
  );

  const onSelectAlgorithm = useCallback((algorithm?: string) => {
    setSelectedAlgorithm(algorithm);
  }, []);

  const onNewCandidate = useCallback((candidate: ICandidate) => {
    setCandidates((state) => {
      return {
        able: [...state.able, candidate],
        disable: [...state.disable],
      };
    });
  }, []);

  const onRemoveCandidate = useCallback((index: number) => {
    setCandidates((state) => {
      const removed = state.able[index];

      return {
        able: [
          ...state.able.filter((value, i) => {
            return i !== index;
          }),
        ],
        disable: [...state.disable, removed],
      };
    });
  }, []);

  const onRun = useCallback(() => {
    api
      .run({
        location_id: 'rj',
        candidates: [-22.9666855, -43.6941723, -22.9581481, -43.684247],
        algorithm: 'minmax',
        k: 1,
      })
      .then((result) => {
        console.log(result);
      });
  }, []);

  return (
    <OLDContext.Provider
      value={{
        initializeData,
        algorithmDropDownOptions,
        areas,
        onSelectId,
        selectedId,
        selectedAlgorithm,
        onSelectAlgorithm,
        onRun,
        candidates,
        onNewCandidate,
        onRemoveCandidate,
      }}
    >
      {children}
    </OLDContext.Provider>
  );
};
