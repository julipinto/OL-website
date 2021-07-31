import React, { useState } from 'react';
import { useAlgorithmDropDownOpions, useRun } from '../../../../hooks';
import { FormMode } from '../../../../utils';
import { BlockButton, DropDown, IDropDown, ResultItem } from '../../atoms';
import { IToggleSec, ToggleSec } from '../../molecules';
import './styles.css';

// import { Container } from './styles';
export interface IQueryForm extends IDropDown, IToggleSec {}
const QueryForm: React.FC<IQueryForm> = ({
  toggled,
  setIsToggled,
  onDropDownChange,
}) => {
  const [formMode, setFormMode] = useState<FormMode>(FormMode.FORM);
  const run = useRun();
  const active = { color: '#4E6068', borderColor: '#00BAFF' };

  const options = useAlgorithmDropDownOpions();
  return (
    <div className="query-form">
      <div className="menu-form">
        <div
          className="menu-option"
          style={formMode === FormMode.FORM ? active : {}}
          onClick={() => {
            setFormMode(FormMode.FORM);
          }}
        >
          Realizar consulta
        </div>
        <div
          className="menu-option"
          style={formMode === FormMode.RESULTS ? active : {}}
          onClick={() => {
            setFormMode(FormMode.RESULTS);
          }}
        >
          Resultados
        </div>
      </div>
      {formMode === FormMode.FORM ? (
        <>
          <ToggleSec
            toggled={toggled}
            setIsToggled={setIsToggled}
            title="Modo edição de candidatos"
            subtitle="Ative essa opção para adicionar e remover candidatos"
          />

          <DropDown
            dropDownLabel="Algoritmo Optimal Location"
            options={options}
            onDropDownChange={onDropDownChange}
          />

          <BlockButton
            BButtonLabel="Start"
            onClick={() => {
              run();
            }}
          />
        </>
      ) : (
        <div className="results-container">
          <ResultItem />
          <ResultItem />
          <ResultItem />
          <ResultItem />
          <ResultItem />
          <ResultItem />
          <ResultItem />
          <ResultItem />
          <ResultItem />
          <ResultItem />
          <ResultItem />
          <ResultItem />
          <ResultItem />
          <ResultItem />
        </div>
      )}
    </div>
  );
};

export default React.memo(QueryForm);
