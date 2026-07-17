import React, { useState } from 'react';
import { Input, Flex, Radio, InputNumber } from 'antd';
const { TextArea } = Input;
import log from 'xac-loglevel';
import AppModal from '@/components/AppModal';

function HistogramBinsModal({ onChange, modal, setModal, options = {} }) {
  const defaultBin = options.bin || 'customBins'
  const [bin, setBin] = useState(defaultBin);
  const defaultBinSize = options.binSize || 6;
  const defaultBinMinValue = options.binMinValue || 1;
  const defaultCustomBins = options.customBins || '';
  const [values, setValues] = useState({
    bin: defaultBin,
    binSize: defaultBinSize,
    binMinValue: defaultBinMinValue,
    customBins: defaultCustomBins,
  });

  const onHandleModalOk = () => {
    if (onChange) {
      onChange(values);
    }
    setModal({...modal, open: false})
  };

  const onGenerateBinValueChange = (field, value) => {
    log.debug('HistogramBins.onGenerateBinValueChange', field, value);
    setValues({ ...values, [field]: value });
  };

  const onCustomBins = (e) => {
    const values = e.target.value.split(',')
    const list = values.map((v) => Number(v))
    onGenerateBinValueChange('customBins', list)
  }

  const onBinChange = (e) => {
    log.debug('HistogramBins.onBinChange', e);
    setBin(e.target.value);
    if (onChange) {
      onChange({ bin: e.target.value, ...values });
    }
  };

  return (
    <div className='c-gridWidget__histogramBinsModal'>
      <AppModal modal={modal} setModal={setModal} handleModalOk={onHandleModalOk}>
        <Flex vertical gap="medium">
          <Radio.Group
            defaultValue={bin}
            buttonStyle="solid"
            onChange={onBinChange}
          >
            <Radio.Button value="quartiles">Quartiles</Radio.Button>
            <Radio.Button value="median">Median split</Radio.Button>
            <Radio.Button value="generateBins">Generate bins</Radio.Button>
            <Radio.Button value="customBins">Custom bins</Radio.Button>
          </Radio.Group>
          {bin.eq('generateBins') && (
            <Flex gap={'large'}>
              Bin Size{' '}
              <InputNumber
                min={1}
                defaultValue={values.binSize}
                name="binSize"
                onChange={(v) => onGenerateBinValueChange('binSize', v)}
              />
              Min value{' '}
              <InputNumber
                min={1}
                defaultValue={values.binMinValue}
                name="binMinValue"
                onChange={(v) => onGenerateBinValueChange('binMinValue', v)}
              />
            </Flex>
          )}
          {bin.eq('customBins') && (
            <TextArea
              rows={2}
              name="customBins"
              defaultValue={values.customBins}
              onChange={onCustomBins}
              placeholder="Please specify bin boundaries of the x axis"
            />
          )}
        </Flex>
      </AppModal>
    </div>
  );
}

export default HistogramBinsModal;
