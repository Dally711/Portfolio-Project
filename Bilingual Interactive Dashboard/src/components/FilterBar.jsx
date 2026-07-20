import { metricOrder } from '../data/datasetConfig'

export default function FilterBar({ copy, metric, setMetric, housingView, setHousingView, geography, setGeography, category, setCategory, structure, setStructure, startDate, setStartDate, endDate, setEndDate, geographyOptions, categoryOptions, structureOptions, dateOptions, formatDateOption, onReset }) {
  return (
    <form className="filter-card card border-0" aria-label={copy.controls} onSubmit={(event) => event.preventDefault()}>
      <div className="row g-3 align-items-end">
        <SelectControl id="metric" label={copy.metric} value={metric} onChange={setMetric} options={metricOrder} getLabel={(option) => copy[option]} />
        <SelectControl id="geography" label={copy.geography} value={geography} onChange={setGeography} options={geographyOptions} wide />
        <SelectControl id="category" label={copy.category} value={category} onChange={setCategory} options={categoryOptions} wide />
        {metric === 'housing' && housingView === 'rent' && <SelectControl id="structure" label={copy.structure} value={structure} onChange={setStructure} options={structureOptions} wide />}
        <SelectControl id="from" label={copy.from} value={startDate} onChange={setStartDate} options={dateOptions.filter((date) => !endDate || date <= endDate)} getLabel={formatDateOption} />
        <SelectControl id="to" label={copy.to} value={endDate} onChange={setEndDate} options={dateOptions.filter((date) => !startDate || date >= startDate)} getLabel={formatDateOption} />
        <div className="col-12 col-sm-auto ms-sm-auto">
          <button type="button" className="btn reset-button w-100" onClick={onReset}>{copy.reset}</button>
        </div>
      </div>
      {metric === 'housing' && <fieldset className="housing-subsection">
        <legend className="visually-hidden">{copy.housingSection}</legend>
        <button type="button" className={housingView === 'house' ? 'active' : ''} aria-pressed={housingView === 'house'} onClick={() => setHousingView('house')}>{copy.housePrices}</button>
        <button type="button" className={housingView === 'rent' ? 'active' : ''} aria-pressed={housingView === 'rent'} onClick={() => setHousingView('rent')}>{copy.rent}</button>
      </fieldset>}
    </form>
  )
}

function SelectControl({ id, label, value, onChange, options, getLabel = (option) => option, wide = false }) {
  return (
    <div className={`col-12 col-sm-6 ${wide ? 'col-xl' : 'col-xl-auto'}`}>
      <label className="form-label" htmlFor={id}>{label}</label>
      <select className="form-select" id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option value={option} key={option}>{getLabel(option)}</option>)}
      </select>
    </div>
  )
}
