import React, { useState, useRef } from 'react';
import { Input, Flex, Radio, InputNumber, Modal } from 'antd';
const { TextArea } = Input;
import log from 'xac-loglevel';
import Draggable from 'react-draggable';

function HistogramBinsModal({ onChange, modal, setModal, options = {} }) {
  const defaultBin = options.bin || 'customBins';
  const defaultBinSize = options.binSize || 6;
  const defaultBinMinValue = options.binMinValue || 5;
  const defaultCustomBins = options.customBins || '';
  const [values, setValues] = useState({
    bin: defaultBin,
    binSize: defaultBinSize,
    binMinValue: defaultBinMinValue,
    customBins: defaultCustomBins,
  });

  const [dragDisabled, setDragDisabled] = useState(true);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef(null);

  const onHandleModalOk = () => {
    if (onChange) {
      onChange(values);
    }
    closeModal()
  };

  const closeModal = () => {
    setModal({ ...modal, open: false });
  };

  const onGenerateBinValueChange = (field, value) => {
    log.debug('HistogramBins.onGenerateBinValueChange', field, value);
    setValues({ ...values, [field]: value });
  };

  const onCustomBins = (e) => {
    const values = e.target.value.split(',');
    const list = values.map((v) => Number(v));
    onGenerateBinValueChange('customBins', list);
  };

  const onBinChange = (e) => {
    log.debug('HistogramBins.onBinChange', e);
    setValues({ ...values, bin: e.target.value });
    if (onChange) {
      onChange({ ...values, bin: e.target.value });
    }
  };

  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  return (
    <div className="c-gridWidget__histogramBinsModal">
      <Modal
        title={
          <div
            style={{ width: '100%', cursor: 'move' }}
            onMouseOver={() => {
              if (dragDisabled) {
                setDragDisabled(false);
              }
            }}
            onMouseOut={() => {
              setDragDisabled(true);
            }}

            onFocus={() => {}}
            onBlur={() => {}}
          >
            Custom Bins
          </div>
        }
        open={modal.open}
        onOk={onHandleModalOk}
        onCancel={closeModal}
        modalRender={(modal) => (
          <Draggable
            disabled={dragDisabled}
            bounds={bounds}
            nodeRef={draggleRef}
            onStart={(event, uiData) => onStart(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
      >
        <Flex vertical gap="medium">
          <Radio.Group
            defaultValue={values.bin}
            buttonStyle="solid"
            onChange={onBinChange}
          >
            <Radio.Button value="quartiles">Quartiles</Radio.Button>
            <Radio.Button value="median">Median split</Radio.Button>
            <Radio.Button value="generateBins">Generate bins</Radio.Button>
            <Radio.Button value="customBins">Custom bins</Radio.Button>
          </Radio.Group>
          {values.bin.eq('generateBins') && (
            <Flex gap={'large'}>
              {/* TODO: Find out what this is on cbioportal */}
              {/* <span>Bin Size{' '}</span>
              <InputNumber
                min={1}
                defaultValue={values.binSize}
                name="binSize"
                onChange={(v) => onGenerateBinValueChange('binSize', v)}
              /> */}
              <span>Number of bins </span>
              <InputNumber
                min={1}
                defaultValue={values.binMinValue}
                name="binMinValue"
                onChange={(v) => onGenerateBinValueChange('binMinValue', v)}
              />
            </Flex>
          )}
          {values.bin.eq('customBins') && (
            <TextArea
              rows={2}
              name="customBins"
              defaultValue={values.customBins}
              onChange={onCustomBins}
              placeholder="Please specify bin boundaries of the x axis"
            />
          )}
        </Flex>
      </Modal>
    </div>
  );
}

export default HistogramBinsModal;
